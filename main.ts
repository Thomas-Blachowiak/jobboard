import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import { sessionSecret } from "./secrets.json";
import { port, domain } from "./env.json";
import { sequelize } from "./dataModels/database";
import { applicationCrud } from "./api/application";
import { companyCrud } from "./api/company";
import { offerCrud } from "./api/offer";
import { userCrud } from "./api/user";
import { loginApi } from "./api/login";
import config from "./vite.config";

const app = express();

/**
 * For a single express server to run everything, some workarounds are needed
 * if we want to preserve developement tools like hotreloading react tools. 
 * 
 * Check if the a production build should be used, 
 * or we enable cors in order to let clients from consume the api
 */
const distExist = !! Array.from(
  new Bun.Glob('dist').scanSync({ onlyFiles: false })
)[0];

// parsing body for every request
app.use(bodyParser.json());
// adding the session middleware
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

// if a production build is ready to go, serve it
if (distExist) {
  app.use(express.static('dist')); 
}
// else we enable cors for all origins in order for clients from dev server to consume the api
else {
  app.use(cors({
    origin: `http://${domain}:${config.server?.port}`,
    credentials: true
  }));
}


await sequelize.sync({alter: !distExist});

/**
 * API routing stuff to be added to the app here
 */
loginApi(app);
applicationCrud(app);
companyCrud(app);
offerCrud(app);

userCrud(app);


app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
