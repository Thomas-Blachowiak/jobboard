import { Express, Request } from "express";
import { User } from "../dataModels/User";
import { Op } from "sequelize";
import { Company } from "../dataModels/Company";
import {} from "../main.d";
export function loginApi(app: Express) {

    interface LoginPost {
        userCredentials: string, // can either be phone or email
        password: string
    }
    app.post('/api/login', async (req: Request<{}, {}, LoginPost, {}>, res) => {
        if (req.session.user) {
            res.status(400);
            res.send('Already logged in.');
            return;
        }
        if (!req.body.userCredentials ||
            !req.body.password) {
                res.status(400);
                res.send('Missing credentials.');
                return;
        }
        const user = await User.findOne({where: {
            [Op.or]: [
                {email: req.body.userCredentials},
                {phone: req.body.userCredentials}
            ]
        }, include: Company});

        if (!user ||  !await Bun.password.verify(req.body.password, user.password)) {
            res.status(403);
            res.send('Invalid credentials.');
            return;
        }
        console.log(`${user.firstName} ${user.lastName} has logged in`);
        req.session.user = user;
        res.status(200);
        res.json(user.public());
    });

    app.get('/api/logout', (req, res) => {
        if (!req.session.user) {
            res.status(400);
            res.send('Not logged in yet.');
            return;
        }
        const userString = `${req.session.user.firstName} ${req.session.user.lastName} has logged out`;
        req.session.destroy(err => {
            if (err) {
                res.status(500);
                res.send('Internal server error during logout.')
                return;
            }
            console.log(userString);
            res.status(200);
            res.send('Successfully logged out.');
        });
    });

    app.get('/api/whoami', async (req, res) => {
        if (!req.session || !req.session.user) {
            res.json(null);
            return;
        }
        const user = await User.findByPk(req.session.user.id, {include: Company})
        req.session.user = user ? user : undefined;
        if (!req.session.user) {
            res.json(null);
            return;
        }
        res.json(req.session.user.public());
    });

    app.get('/api/amiadmin', (req, res) => {
        if (!req.session || !req.session.user) {
            res.json(false);
            return;
        }
        res.json(req.session.user.admin);
    })
}