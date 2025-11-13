import "reflect-metadata";
import Router from "@koa/router";
import { TYPES } from "../types/type.js";
import { AuthController } from "../controllers/AuthController.js";
import { injectable, inject } from "inversify";
import type { SessionController } from "../controllers/SessionController.js";
import { UserController } from "../controllers/UserController.js";

@injectable()
export class AuthRoutes {
    public router: Router;
    constructor(@inject(TYPES.UserController) private readonly authController: AuthController, @inject(TYPES.SessionController) private userController: UserController){
        this.router = new Router();

        this.router.post("/register", this.authController.register.bind(this.authController));
        this.router.post("/login", this.authController.login.bind(this.authController));
        this.router.post("/logout", this.userController.logOut.bind(this.userController));
    }
}
