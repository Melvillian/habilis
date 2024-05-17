import { type NodePgDatabase } from "drizzle-orm/node-postgres";
import { inArray } from "drizzle-orm";

import { type NewDbEvent, type SelectDbEvent, type NewDbCard, EventTable, CardTable, dbEventToHabilisEvent, habilisEventToDbEvent, cardToNewDbCard, dbCardToCard } from "./schema";
import { type HabilisEvent, type Card} from "@habilis/core/"
import { getDatabase } from "./openDBConnection";

export interface PersistentStore {

  getEvents(ids: string[]): Promise<HabilisEvent[]>;

  insertCardsAndEvents(cards: Card[], events: HabilisEvent[]): Promise<Card[]>;
}

class PostgresPersistentStore implements PersistentStore {
  private _db: NodePgDatabase;

  constructor(db: NodePgDatabase) {
    this._db = db;
  }

  async getEvents(ids: string[]): Promise<HabilisEvent[]> {
    const events: SelectDbEvent[] = await this._db.select().from(EventTable).where(inArray(EventTable.id, ids));
    return events.map(event => dbEventToHabilisEvent(event));
  }

  async insertCardsAndEvents(cards: Card[], events: HabilisEvent[]): Promise<Card[]> {
    const dbEvents: NewDbEvent[] = events.map(event => habilisEventToDbEvent(event));
    const dbCards: NewDbCard[] = cards.map(card => cardToNewDbCard(card));

    return (await this._db.transaction(async (transaction) => {
      await transaction.insert(EventTable).values(dbEvents);
      const insertedCards: NewDbCard[] = await transaction.insert(CardTable).values(dbCards).returning();
      return insertedCards;

    })).map(dbCard => dbCardToCard(dbCard));
  }
}

// A simple in-memory store for testing.
class InMemoryPersistentStore implements PersistentStore {
  private _events: HabilisEvent[] = [];
  private _cards: Card[] = [];

  async getEvents(ids: string[]): Promise<HabilisEvent[]> {
    return Promise.resolve(this._events.filter(event => ids.includes(event.id)));
  }

  async insertCardsAndEvents(cards: Card[], events: HabilisEvent[]): Promise<Card[]> {
    this._events.push(...events);
    this._cards.push(...cards);
    return Promise.resolve(cards);
  }

  /** THESE FUNCTIONS BELOW SHOULD BE USED IN TESTS */

  getEventsInMemory(): HabilisEvent[] {
    return this._events;
  }

  getCardsInMemory(): Card[] {
    return this._cards;
  }
}


export const createPersistentStore = (env: string): PersistentStore => {
  if (env === "production") {
    return new PostgresPersistentStore(getDatabase());
  } else {
    return new InMemoryPersistentStore();
  }
}