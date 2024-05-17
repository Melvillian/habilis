import Koa from "koa";
import { koaBody } from "koa-body";
import koaCompress from "koa-compress";
import rTracer from "cls-rtracer";
import cors from "@koa/cors";
import router from "./routes.ts";

const app = new Koa();

/** ---------------- Middleware ---------------- */

// gives us a ctx.request.body HTTP body object
app.use(koaBody());

// compress response bodies for better performance
app.use(koaCompress())

// add request ID to each request to help trace it across services
app.use(rTracer.koaMiddleware({
  useHeader: true,
  headerName: 'X-Request-Id'
}))

// Allow cross-origin requests
app.use(cors());

app.use(router.routes());


export default app;