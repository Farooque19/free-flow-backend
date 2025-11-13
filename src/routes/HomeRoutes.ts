import "reflect-metadata";
import { injectable, inject } from "inversify";
import { HomeController } from "../controllers/HomeController.js";
import passport from "koa-passport";
import Router from "koa-router";
import { TYPES } from "../types/type.js";

@injectable()
export class HomeRoutes {
  public router = new Router();
  constructor(
    @inject(TYPES.HomeController)
    private readonly homeController: HomeController
  ) {
    this.router.get(
      "/",
      passport.authenticate("jwt", { session: false }),
      this.homeController.homePage
    );
    this.router.get(
      "/user",
      passport.authenticate("jwt", { session: false }),
      this.homeController.userPage
    );
  }
}
