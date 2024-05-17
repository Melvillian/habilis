import Router from "koa-router";
import {createPersistentStore } from "./db";
import { createCardReducer } from "./reducers.ts";
import type {CardCreationEvent, Card} from "@habilis/core/"


const router = new Router();

// setup our connection to the database (or in-memory store if we're not in production)
const nodeEnv = process.env.NODE_ENV || "development";
const persistentStore = createPersistentStore(nodeEnv);


router.post("/api/v1/card", async (ctx) => {
  // TODO (melvillian) validate this instead of blindly trusting. 
  const createCardEvent = ctx.request.body as CardCreationEvent;
  const card: Card = createCardReducer(createCardEvent);
  const insertedCards = await persistentStore.insertCardsAndEvents([card], [createCardEvent])

  ctx.body = insertedCards;
});

router.get("/healthz", async (ctx) => {
  ctx.body = "OK";
});

export default router;