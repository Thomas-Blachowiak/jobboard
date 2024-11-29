import {User} from "./dataModels/User";

// Augment express-session with a custom SessionData object
declare module "express-session" {
    interface SessionData {
      user?: User;
    }
  }
  