import Router from "koa-router";

const router = new Router();

router.get("/", (ctx, next) => {
  ctx.body = "It's Working!";

  next();
});

router.get("/healthz", (ctx, next) => {
  ctx.body = "OK";

  next();
});

export default router;