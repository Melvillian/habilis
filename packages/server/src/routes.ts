import Router from "koa-router";
import {getDatabase, EventTable} from "./db";


const router = new Router();


router.get("/", async (ctx, next) => {
  ctx.body = await getDatabase().select().from(EventTable);

  await next();
});

router.get("/healthz", async (ctx, next) => {
  ctx.body = "OK";

  await next();
});

export default router;