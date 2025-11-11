import "reflect-metadata";
import Router from "@koa/router";
import { TYPES } from "../types/type.js";
import { AuthController } from "../controllers/AuthController.js";
import { injectable, inject } from "inversify";

@injectable()
export class AuthRoutes {
    public router: Router;
    constructor(@inject(TYPES.AuthController) private readonly authController: AuthController){
        this.router = new Router({prefix: "/auth"});

        this.router.post("/register", this.authController.register.bind(this.authController));
        this.router.post("/login", this.authController.login.bind(this.authController));
    }
}
