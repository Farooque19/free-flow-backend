import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import cors from "@koa/cors";

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = { message: "Freelance app is running." };
});

app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

export default app;
