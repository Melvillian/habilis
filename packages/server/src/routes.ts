import Router from "koa-router";
import {getDatabase, EventTable} from "./db";
import {CardCreationEvent, Card} from "@habilis/core/"


const router = new Router();


router.post("/api/v1/card", async (ctx, next) => {
  // TODO (melvillian) validate this instead of blindly trusting. 
  const createCardEvent = ctx.request.body as CardCreationEvent;
  const card: Card = reducer(createCardEvent);
  await insertCardAndEvents(createCardEvent, Card)
  ctx.body = await getDatabase().select().from(EventTable);

  await next();
});

const reducer = async (event: CardCreationEvent): Promise<Card> => {
  // TODO: implement reducer logic
  return new Promise((resolve) => {
    resolve({
      id: event.cardId,
      type: event.cardType,
      text: event.cardText
    });
  });
}

router.get("/healthz", async (ctx, next) => {
  ctx.body = "OK";

  await next();
});

export default router;