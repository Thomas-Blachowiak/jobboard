import { Express, Request } from "express";
import { User } from "../dataModels/User";
import validator from "validator";
import { Company } from "../dataModels/Company";
import { Application } from "../dataModels/Application";
import {} from "../main.d";

function formatName(name: string) {
    const trimmed = name.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

function formatPhone(phone: string) {
    let res = phone;
    if (res.startsWith('+33')) res = `0${phone.slice(3)}`;

    return res;
}

export function userCrud(app: Express) {
    /**
     * Route to fech user data
     *
     * userId : number
     */
    interface GetQuery {
        userId: string;
    }
    app.get("/api/user", async (req: Request<{}, {}, {}, GetQuery>, res) => {
        if (!req.query.userId) {
            res.status(400);
            res.send("Missing userId");
            return;
        }
        if (!validator.isNumeric(req.query.userId)) {
            res.status(400);
            res.send("Malformed userId");
            return;
        }
        const user = await User.findByPk(req.query.userId, {
            include: [
                {model: Company},
                {model: Application}
            ]
        });
        if (!user) {
            res.status(404);
            res.send("User not found");
            return;
        }
        // return a public safe json object
        res.json(user.public());
    });
    /**
     * Route to add a new user
     */
    interface AddBody {
        photo?: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
    }
    app.post("/api/user", async (req: Request<{}, {}, AddBody, {}>, res) => {
        console.log(req.body);
        if (
            !req.body.email ||
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.phone ||
            !req.body.password
        ) {
            console.log(req.body);
            res.status(400);
            res.send("Missing body content.");
            return;
        }

        if (
            !validator.isEmail(req.body.email) ||
            !validator.isMobilePhone(req.body.phone, "fr-FR")
        ) {
            res.status(400);
            res.send("Malformed body.");
            return;
        }

        const emailUser = await User.findOne({
            where: { email: req.body.email },
        });
        const phoneUser = await User.findOne({
            where: { phone: req.body.phone },
        });
        if (phoneUser || emailUser) {
            res.status(400);
            res.send("Already exists.");
            return;
        }

        const hashedPassword = await Bun.password.hash(req.body.password);

        User.create({
            firstName: formatName(req.body.firstName),
            lastName: formatName(req.body.lastName),
            email: req.body.email,
            phone: formatPhone(req.body.phone),
            password: hashedPassword,
            admin: false,
            message: ""
        })
            .then((usr) => {
                res.status(200);
                res.json(usr.public());
            })
            .catch((err) => {
                res.status(500);
                console.error(err);
                res.send("Internal server Error");
            });
    });
    /**
     * Route to update an user
     */
    interface PatchUser {
        userId?: string;
        password: string;
        photo?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        newPassword?: string;
        message?: string;
    }
    app.patch("/api/user", async (req: Request<{}, {}, PatchUser, {}>, res) => {
        // check if credentials were given
        const userId = req.body.userId ? req.body.userId : req.session.user?.id
 
        if (!(req.session.user?.admin || req.body.password) || !userId) {
            res.status(400);
            res.send("No credentials given.");
            return;
        }

        if (
            (req.body.email && !validator.isEmail(req.body.email)) ||
            (req.body.phone && !validator.isMobilePhone(req.body.phone, "fr-FR")) ||
            (req.body.newPassword && !validator.isStrongPassword(req.body.newPassword, {minSymbols: 0}))
        ) {
            res.status(400);
            res.send("Malformed request.");
            return;
        }
        // fetch the user
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404);
            res.send("User not found.");
            return;
        }
        // check if credentials are valid
        if (!(req.session.user?.admin || await Bun.password.verify(req.body.password, user.password))) {
            res.status(403);
            res.send("Invalid credentials.");
            return;
        }
        // check if at least 1 thing to update has been provided
        if (
            !req.body.photo &&
            !req.body.email &&
            !req.body.firstName &&
            !req.body.lastName &&
            !req.body.phone &&
            !req.body.newPassword &&
            !req.body.message
        ) {
            res.status(400);
            res.send("No update data given.");
            return;
        }
        // check if email and/or phone number are unique
        const emailUser = req.body.email
            ? await User.findOne({ where: { email: req.body.email } })
            : null;
        const phoneUser = req.body.phone
            ? await User.findOne({ where: { phone: req.body.phone } })
            : null;
        if (phoneUser || emailUser) {
            res.status(400);
            res.send("Email or phone already in use.");
            return;
        }
        if (req.body.message) user.message = req.body.message;
        if (req.body.photo) user.photo = req.body.photo;
        if (req.body.email) user.email = req.body.email;
        if (req.body.phone) user.phone = formatPhone(req.body.phone);
        if (req.body.firstName) user.firstName = formatName(req.body.firstName);
        if (req.body.lastName) user.lastName = formatName(req.body.lastName);
        if (req.body.newPassword)
            user.password = await Bun.password.hash(req.body.newPassword);

        user.save()
            .then((usr) => {
                req.session.user = usr;
                res.status(200);
                res.json(usr.public());
            })
            .catch((err) => {
                console.error(err);
                res.status(500);
                res.send("Update error occured.");
            });
    });
    /**
     * Route to delete an user
     */
    interface DeleteUser {
        userId?: string;
        password: string;
    }
    app.delete(
        "/api/user",
        async (req: Request<{}, {}, DeleteUser, {}>, res) => {
            const userId = req.body.userId ? req.body.userId : req.session.user?.id;
            
            if (!req.session.user?.admin && (!userId || !req.body.password)) {
                res.status(400);
                res.send("Missing credentials.");
                return;
            }
            const user = await User.findByPk(userId);
            if (!user) {
                res.status(404);
                res.send("User not found");
                return;
            }
            if (!req.session.user?.admin &&
                !(await Bun.password.verify(req.body.password, user.password))
            ) {
                res.status(403);
                res.send("Incorrect credentials");
                return;
            }
            const previousData = user.public();
            user.destroy()
                .then(() => {
                    req.session.user = undefined;
                    res.status(200);
                    res.json(previousData);
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500);
                    res.send("Internal error during deletion");
                });
        }
    );

    interface ListOptions {
        companyId: string;
    }
    app.get('/api/user/list', async (req: Request<{}, {}, {}, ListOptions>, res) => {
        const users = await User.findAll(req.query.companyId ? {
            where: {
                companyId: req.query.companyId
            }
        }: undefined);
        res.json(users.map(user => user.public()));
    });
}
