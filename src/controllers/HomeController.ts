import "reflect-metadata";
import { injectable } from "inversify";
import type { Context } from "koa";
import { OK_STATUS } from "../constants/constants.js";

@injectable()
export class HomeController {
    async homePage(ctx: Context): Promise<void>{
        ctx.body = "Welcome to home page.";
        ctx.status = OK_STATUS;
    }

    async userPage(ctx: Context): Promise<void> {
        ctx.body = "Welcome to user page.";
        ctx.status = OK_STATUS;
    }
}