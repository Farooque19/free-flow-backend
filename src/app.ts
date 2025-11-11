import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import cors from "@koa/cors";
import { container } from "./config/inversify.config.js";
import { AuthRoutes } from "./routes/AuthRoutes.js";
import {TYPES} from "./types/type.js";

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "Freelancer app is running.";
});

app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const authRoutes = container.get<AuthRoutes>(TYPES.AuthRoutes);
app.use(authRoutes.router.routes()).use(authRoutes.router.allowedMethods());

export default app;
