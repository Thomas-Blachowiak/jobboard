import { Express, Request } from "express";
import { Company } from "../dataModels/Company";
import { User } from "../dataModels/User";
import { Offer } from "../dataModels/Offer";
import { validator } from "sequelize/lib/utils/validator-extras";
import {} from "../main.d";

export function companyCrud(app: Express) {
    /**
     * Route to fech company data
     */
    interface GetQuery {
        companyId: number;
    }
    app.get("/api/company", async (req: Request<{}, {}, {}, GetQuery>, res) => {
        if (!req.query.companyId) {
            res.status(400);
            res.send("Missing companyId");
            return;
        }
        const company = await Company.findByPk(req.query.companyId, {
            include: [
                {model: User},
                {model: Offer}
            ]
        });
        if (!company) {
            res.status(404);
            res.send("Company not found");
            return;
        }
        
        res.json(company.public());
    });
    app.get("/api/company/list", async (req: Request, res) => {
        try {
            const companies = await Company.findAll();
            if (!companies || companies.length === 0) {
                res.status(404).send("No companies found");
                return;
            }
            res.json(companies.map((offer) => offer.public()));
        } catch (error) {
            console.error("Error fetching companies:", error);
            res.status(500).send("An error occurred while fetching companies");
        }
    });
    /**
     * Route to add a new comapny
     */
    interface AddBody {
        addMe?: string;
        name: string;
        description: string;
        email: string;
        siretNumber:string;
    }
    app.post("/api/company", async (req: Request<{}, {}, AddBody, {}>, res) => {
        if (!req.session.user) {
            res.status(403).send('Must be logged in.');
            return;
        }
        
        if (!req.body.name || 
            !req.body.description || 
            !req.body.email ||
            !req.body.siretNumber) {
                res.status(400);
                res.send("Missing body content.");
                return;
        }

        if (!validator.isEmail(req.body.email) ||
            !validator.isNumeric(req.body.siretNumber) || req.body.siretNumber.length !== 14) {
                console.log(req.body);
                res.status(400).send('Malformed request.');
                return;
        }

        if (await Company.findOne({where: {
            siretNumber: req.body.siretNumber
        }})) {
            res.status(403).send('Siret already exists');
            return;
        }

        Company.create({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            siretNumber: req.body.siretNumber
        })
        .then(async (newCompany) => {
            if (!req.body.addMe) {
                res.status(200);
                res.json(newCompany.public());
                return;
            }
            if (!req.session.user) return;
            const user = await User.findByPk(req.session.user.id, {include: Company});
            if (!user) return;
            user.companyId = newCompany.id;
            user.save()
            .then(() => {
                req.session.user = user;
                res.status(200);
                res.json(newCompany.public());
                return;
            })
            .catch(() => {
                res.status(200).json(newCompany.public());
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500);
            res.send("Internal server error");
        });
    });
    /**
     * Route to update a company
     */
    interface PatchCompany {
        companyId: number;
        password: string;
        name?: string;
        description?: string;
        email?: string;
    }
    app.patch(
        "/api/company",
        async (req: Request<{}, {}, PatchCompany, {}>, res) => {
            if (!req.session.user) {
                res.status(403).send("Must be logged in.");
                return;
            }

            if (!req.body.companyId) {
                res.status(400);
                res.send("Missing companyId.");
                return;
            }

            console.log("admin", req.session.user.admin);
            console.log("hasPass", req.body.password);
            console.log("rightPass", await Bun.password.verify(req.body.password, req.session.user.password));
            console.log('rightCompany', req.session.user.companyId != req.body.companyId);
            console.log
            if (!req.session.user.admin && (
                !req.body.password ||
                !await Bun.password.verify(req.body.password, req.session.user.password) ||
                req.session.user.companyId !== req.body.companyId)) {
                    res.status(403).send('Forbidden.');
                    return;
            }
            
            const company = await Company.findByPk(req.body.companyId);
            if (!company) {
                res.status(404);
                res.send("Company not found.");
                return;
            }

            if (req.body.name) company.name = req.body.name;
            if (req.body.description)
                company.description = req.body.description;
            if (req.body.email) company.email = req.body.email;

            try {
                await company.save();
                res.status(200);
                res.json(company.public());
            } catch (err) {
                console.error(err);
                res.status(500);
                res.send("Update error occurred.");
            }
        }
    );
    /**
     * Route to delete a company
     */
    interface DeleteCompany {
        companyId: number;
        password: string;
    }
    app.delete(
        "/api/company",
        async (req: Request<{}, {}, DeleteCompany, {}>, res) => {
            if (!req.body.companyId) {
                res.status(400);
                res.send("Missing companyId.");
                return;
            }

            if (!req.session.user) {
                res.status(403).send("Must be logged in.");
                return;
            }


            
            if ((!req.session.user.admin) &&
                (!req.body.password || !await Bun.password.verify(req.body.password, req.session.user.password) || req.session.user.companyId !== req.body.companyId)) {
                    res.status(403).send("Forbidden");
                    return;
            }

            const company = await Company.findByPk(req.body.companyId);
            if (!company) {
                res.status(404);
                res.send("Offer not found.");
                return;
            }

            const previousData = company.public();
            company
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
