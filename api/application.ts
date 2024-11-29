import { Express, Request } from "express";
import { validator } from "sequelize/lib/utils/validator-extras";
import { Application } from "../dataModels/Application";
import { User } from "../dataModels/User";
import { Offer } from "../dataModels/Offer";
import { Op } from "sequelize";
import {} from "../main.d";
import { Company } from "../dataModels/Company";

export function applicationCrud(app: Express) {
    /**
     * Route to fech application data
     */
    interface GetApplication {
        applicationId: string
    }
    app.get('/api/application', async (req: Request<{}, {}, {}, GetApplication>, res) => {
        if (!req.query.applicationId) {
            res.status(400);
            res.send('Missing applicationId.');
            return;
        }

        if (!validator.isNumeric(req.query.applicationId)) {
            res.status(400);
            res.send('Malformed applicationId.');
            return;
        }
        
        const application = await Application.findByPk(req.query.applicationId, {
            include: [
                {model: User},
                {model: Offer}
            ]
        });


        if (!application) {
            res.status(404);
            res.send('Unknown applicationId.');
            return;
        }

        res.status(200);
        res.json(application.public());
    });
    /**
     * Route to add a new application
     */
    interface PostBody {
        offerId: number,
        userId: number,
        message: string
    }
    app.post('/api/application', async (req: Request<{}, {}, PostBody, {}>, res) => {
        if (!req.session.user) {
            res.status(403);
            res.send('Not logged in.');
            return;
        }

        if (!req.body.offerId ||
            !req.body.message ||
            !req.body.userId) {
                res.status(400);
                res.send('Missing body content.');
                return;
        }

        // casting ids to numbers
        const offerId = +req.body.offerId;
        const userId = req.session.user.id;


        if ( !req.session.user.admin && userId !== req.body.userId) {
            res.status(403).send('Forbidden.');
        }

        const offer = await Offer.findByPk(offerId);
        if (!offer) {
                res.status(400);
                res.send('Unknown offerId.')
                return;
        }

        const application = await Application.findOne({where: {
            [Op.and]: [
                {userId},
                {offerId}
            ]
        }});

        if (application) {
            res.status(400);
            res.send('Already exists.')
            return;
        }

        Application.create({
            userId: userId,
            offerId: offerId,
            message: req.body.message,
            rejected: false
        })
        .then(async apply => {
            const user = await User.findByPk(userId);
            if (user) {
                user.message = apply.message;
                user.save();
            }
            res.status(200);
            res.json(apply.public());
        })
        .catch(() => {
            res.status(500);
            res.send('Internal error while adding application');
        });
    });
    /**
     * Route to update an application
     */
    interface PatchApplication {
        applicationId: string;
        message: string;
    }
    app.patch('/api/application', async (req: Request<{}, {}, PatchApplication, {}>, res) => {
        if (!req.session.user) {
            res.status(403);
            res.send('Not logged in.');
            return;
        }

        if (!req.body.applicationId ||
            !req.body.message) {
                res.status(400);
                res.send('Missing body content.');
                return;
        }

        const offerId = +req.body.applicationId;
        const userId = req.session.user.id;

        const application = await Application.findByPk(req.body.applicationId, {include: User});

        if (!application) {
            res.status(404);
            res.send('Application not found.');
            return;
        }

        if (!req.session.user.admin && req.session.user.id !== application.userId) {
            res.status(403).send('Forbidden.');
            return;
        }

        application.message = req.body.message;
        application.save({})
        .then(async apply => {
            const user = await User.findByPk(userId);
            if (user) {
                user.message = apply.message;
                user.save();
            }
            res.status(200);
            res.json(apply.public());
        })
        .catch(err => {
            res.status(500);
            res.send('Internal error while updating the application.');
        });
    });
    /**
     * Route to delete an application
     */
    interface DeleteApplication {
        applicationId: string;
    }
    app.delete('/api/application', async (req: Request<{}, {}, DeleteApplication, {}>, res) => {
        if (!req.session.user) {
            res.status(403);
            res.send('Not logged in.');
            return;
        }

        if (!req.body.applicationId) {
            res.status(400);
            res.send('Missing offerId.');
            return;
        }

        const application = await Application.findByPk(req.body.applicationId);

        if (!application) {
            res.status(404);
            res.send('Application not found');
            return;
        }

        if (!req.session.user.admin && req.session.user.id !== application.userId) {
            res.status(403).send('Forbidden.');
            return;
        }

        const prevData = application.public();
        application.destroy()
        .then(() => {
            res.status(200);
            res.json(prevData);
        })
        .catch(err => {
            res.status(500);
            res.send('Internal error during deletion');
        });
    });

    interface ListOptions {
        userId?: string;
        offerId?: string;
        rejected?: boolean;
    }
    app.get('/api/application/list', async (req: Request<{}, {}, {}, ListOptions>, res) => {
        const userId = req.query.userId;
        const offerId = req.query.offerId;
        const rejected = req.query.rejected;
        const applications = await Application.findAll({
            where: (userId || offerId || rejected !== undefined) ? removeUndefinedKeys({
                userId: userId ? userId : undefined,
                offerId: offerId ? offerId : undefined,
                rejected: rejected !== undefined ? rejected : undefined
            }) : undefined,
            include: [User, {model: Offer, include: [Company]}]
        });
        res.json(applications.map(application => application.public()));
    });

    interface RejectRequest {
        applicationId: string;
    }
    app.patch('/api/application/reject', async (req: Request<{}, {}, RejectRequest, {}>, res) => {
        if (!req.session.user) {
            res.status(403).send('Must be logged in.');
            return;
        }

        if (!req.body.applicationId) {
            res.status(400).send('Missing application id.');
            return;
        }
        
        const application = await Application.findByPk(req.body.applicationId);

        if (!application) {
            res.status(404).send('Unknown application.');
            return;
        }

        if (!req.session.user.companyId || req.session.user.companyId !== application.id) {
            res.status(403).send('Forbidden.');
            return;
        }

        application.rejected = true;
        application.save()
        .then((data) => {
            res.status(200).json(data.public());
        })
        .catch(() => {
            res.status(500).send('Internal server Error.');
        })
    });
}


const removeUndefinedKeys = (obj: Record<string, any>): Record<string, any> => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== undefined)
    );
};

