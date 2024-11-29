import { Express, Request } from "express";
import { Offer } from "../dataModels/Offer";
import { Company } from "../dataModels/Company";
import { Application } from "../dataModels/Application";
import {} from "../main.d";

export function offerCrud(app: Express) {
    /**
     * Route to fech offer data
     */
    interface GetQuery {
        offerId: number;
    }
    app.get("/api/offer", async (req: Request<{}, {}, {}, GetQuery>, res) => {
        if (!req.query.offerId) {
            res.status(400);
            res.send("Missing offerId");
            return;
        }
        const offer = await Offer.findByPk(req.query.offerId, {
            include: [{ model: Company }, { model: Application, include: [{model: Offer, include: [Company]}]}],
        });
        if (!offer) {
            res.status(404);
            res.send("Offer not found");
            return;
        }

        // return a public safe json object
        res.json(offer.public());
    });

    interface ListOptions {
        companyId?: number;
    }
    app.get("/api/offer/list", async (req: Request<{}, {}, {}, ListOptions>, res) => {
        try {
            const offers = await Offer.findAll({
                where: req.query.companyId ? {
                    companyId: req.query.companyId,
                } : undefined,
                include: [{ model: Company }], // Inclure les détails de la Company pour chaque offre
            });
            if (!offers || offers.length === 0) {
                res.status(404).send("No offers found");
                return;
            }
            res.json(offers.map((offer) => offer.public()));
        } catch (error) {
            console.error("Error fetching offers:", error);
            res.status(500).send("An error occurred while fetching offers");
        }
    });
    /**
     * Route to add a new offer
     */
    interface AddBody {
        title: string;
        description: string;
        companyId: number;
        city: string;
        salary: number;
        hours: number;
    }
    app.post("/api/offer", (req: Request<{}, {}, AddBody, {}>, res) => {
        if (!req.session.user) {
            res.status(403).send('Must be logged in');
            return;
        }

        if (!req.session.user.admin && 
            !(req.session.user.companyId && req.session.user.companyId === req.body.companyId)) {
                res.status(403).send('Forbidden');
                return;
        }

        if (!req.body.title || 
            !req.body.description || 
            !req.body.companyId ||
            !req.body.city ||
            !req.body.salary ||
            !req.body.hours) {
                res.status(400);
                res.send("Missing body content.");
                return;
        }

        Offer.create({
            title: req.body.title,
            description: req.body.description,
            companyId: req.body.companyId,
            city: req.body.city,
            salary: req.body.salary,
            hours: req.body.hours,
        })
            .then((newOffer) => {
                res.status(200);
                res.json(newOffer.public());
            })
            .catch((err) => {
                console.error(err);
                res.status(500);
                res.send("Internal server error");
            });
    });
    /**
     * Route to update an offer
     */
    interface PatchOffer {
        offerId: number;
        title?: string;
        description?: string;
        companyId?: number;
        city?: string;
        salary?: number;
        hours?: number;
    }
    app.patch(
        "/api/offer",
        async (req: Request<{}, {}, PatchOffer, {}>, res) => {
            if (!req.session.user) {
                res.status(403).send('Must be logged in.');
                return;
            }

            if (!req.body.offerId) {
                res.status(400);
                res.send("Missing offerId.");
                return;
            }
            console.log(req.body)
            const offer = await Offer.findByPk(req.body.offerId);
            if (!offer) {
                res.status(404);
                res.send("Offer not found.");
                return;
            }

            if (!req.session.user.admin && (
                !req.session.user.companyId || 
                offer.companyId !== req.session.user.companyId)) {
                    res.status(403).send("Forbidden.");
                    return;
            }

            if (req.body.title) offer.title = req.body.title;
            if (req.body.description) offer.description = req.body.description;
            if (req.body.city) offer.city = req.body.city;
            if (req.body.salary) offer.salary = req.body.salary;
            if (req.body.hours) offer.hours = req.body.hours;
            if (req.body.companyId) offer.companyId = req.body.companyId;

            try {
                await offer.save();
                res.status(200);
                res.json(offer.public());
            } catch (err) {
                console.error(err);
                res.status(500);
                res.send("Update error occurred.");
            }
        }
    );

    /**
     * Route to delete an offer
     */
    interface DeleteOffer {
        offerId: number;
    }
    app.delete(
        "/api/offer",
        async (req: Request<{}, {}, DeleteOffer, {}>, res) => {
            if (!req.session.user) {
                res.status(403).send('Must be logged in.');
                return;
            }

            if (!req.body.offerId) {
                res.status(400);
                res.send("Missing offerId.");
                return;
            }

            const offer = await Offer.findByPk(req.body.offerId);
            if (!offer) {
                res.status(404);
                res.send("Offer not found.");
                return;
            }

            if (!req.session.user.admin && (
                !req.session.user.companyId || 
                offer.companyId !== req.session.user.companyId)) {
                    res.status(403).send("Forbidden.");
                    return;
            }

            const previousData = offer.public();
            offer
                .destroy()
                .then(() => {
                    res.status(200);
                    res.json(previousData);
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500);
                    res.send("Internal error during deletion.");
                });
        }
    );
}
