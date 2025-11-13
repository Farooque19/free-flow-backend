import "reflect-metadata";
import { inject, injectable } from "inversify";
import Router from "koa-router";
import { SessionController } from "../controllers/SessionController.js";
import { TYPES } from "../types/type.js";

@injectable()
export class TokenRoutes {
  public router = new Router();

  constructor(
    @inject(TYPES.SessionController)
    private readonly sessionController: SessionController
  ) {
    this.router.post(
      "/token",
      this.sessionController.getAccessToken.bind(this.sessionController)
    );
  }
}
