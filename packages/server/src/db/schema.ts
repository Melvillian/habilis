import { jsonb, text, boolean, bigserial, integer, timestamp, uuid, pgEnum, pgTable, index} from "drizzle-orm/pg-core"
import { type HabilisEvent, HabilisEventType, type Card, type CardCreationEventFields, CardType } from "@habilis/core";

export const cardTypeEnum = pgEnum("card_type", ["cloze", "qa"]);

type attachmentsJSONType = {
  attachmentRef: string,
  mimeType: string,
}

export const CardTable = pgTable("cards", {
  id: uuid("id").primaryKey(),
  lastEventId: uuid("last_event_id").references(() => EventTable.id).notNull(),
  createdAtTimestampMillis: timestamp("created_at_timestamp_millis", { withTimezone: true}).notNull().defaultNow(),
  userId: uuid("user_id").references(() => UserTable.id).notNull(),
  type: cardTypeEnum("type").notNull(),

  isDeleted: boolean("is_deleted").$default(() => false).notNull(),
  lastRepetitionTimestampMillis: timestamp("last_repetition_timestamp_millis", { withTimezone: true}).array().notNull(),
  dueTimestampMillis: timestamp("due_timestamp_millis", { withTimezone: true}).array().notNull(),
  intervalMillis: integer("interval_millis").array().notNull(),
  cardText: text("card_text").notNull(),
  attachments: jsonb("attachments").$type<attachmentsJSONType>().array().notNull(),
}, (table) => {
  return {
    lastEventIdIdx: index("last_event_id_idx").on(table.lastEventId),
    // TODO make this a compound index on userId + dueTimestampMillis, so we can search for all the due cards for a user
    userIdIdx: index("user_id_idx").on(table.userId),
    dueTimestampMillisIds: index("due_timestamp_millis_idx").on(table.dueTimestampMillis),
  }
});

export const eventTypeEnum = pgEnum("type", [
  "cardAdded",
  "cardRemoved",
  "cardUpdated",
  "repetition",
])

export const EventTable = pgTable("events", {
  id: uuid("id").primaryKey(),
  createdAtTimestampMillis: timestamp("created_at_timestamp_millis", { withTimezone: true }).notNull().defaultNow(),
  cardId: uuid("card_id").notNull(),
  type: eventTypeEnum("type").notNull(),
  sequenceId: bigserial("sequence_id", { mode: "bigint"}).notNull(),

  // stores various fields of the different event types. See all of the interfaces
  // that inherit from EventBase in packages/core/src/habilisEvent.ts for all of the
  // fields that gets stored in this column
  subfields: jsonb("subfields").notNull(),
}, (table) => {
  return {
    cardIdIdx: index("card_id_idx").on(table.cardId),
  }
});

export const UserTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAtTimestampMillis: timestamp("created_at_timestamp_millis", { withTimezone: true}).notNull().defaultNow(),
}, (table) => {
  return {
    emailIdx: index("email_idx").on(table.email)
  }
})

export type NewDbEvent = typeof EventTable.$inferInsert;
export type SelectDbEvent = typeof EventTable.$inferSelect;
export type NewDbCard = typeof CardTable.$inferInsert;

export const dbEventToHabilisEvent = (dbEvent: SelectDbEvent): HabilisEvent => {
  switch (dbEvent.type) {
    case "cardAdded":
      const fields: CardCreationEventFields = dbEvent.subfields as CardCreationEventFields;
      return {
        id: dbEvent.id,
        type: HabilisEventType.CardCreation,
        createdAtTimestampMillis: dbEvent.createdAtTimestampMillis,
        cardId: dbEvent.cardId,
        sequenceId: dbEvent.sequenceId,
        ...fields,
      }
    default:
      throw new Error(`Unknown event type: ${dbEvent.type}`);
  }
}

export const habilisEventToDbEvent = (he: HabilisEvent): NewDbEvent => {
  switch (he.type) {
    case HabilisEventType.CardCreation:
      const fields: CardCreationEventFields = he as CardCreationEventFields;
      return {
        id: he.id,
        type: "cardAdded",
        createdAtTimestampMillis: he.createdAtTimestampMillis,
        cardId: he.cardId,
        subfields: fields,
      }
    default:
      throw new Error(`Unknown event type: ${he.type}`);
  }
}

export const cardToNewDbCard = (card: Card): NewDbCard => {
  return {
    id: card.id,
    lastEventId: card.id,
    createdAtTimestampMillis: card.createdAtTimestampMillis,
    userId: card.userId,
    type: card.type,
    isDeleted: card.isDeleted,
    lastRepetitionTimestampMillis: card.schedulingInfo.map(si => si.lastRepetitionTimestampMillis),
    dueTimestampMillis: card.schedulingInfo.map(si => si.dueTimestampMillis),
    intervalMillis: card.schedulingInfo.map(si => si.intervalMillis),
    cardText: card.cardText,
    attachments: card.attachments.map(a => ({
      attachmentRef: a.attachmentRef,
      mimeType: a.mimeType,
    }))
  }
}

export const dbCardToCard = (dbCard: NewDbCard): Card => {
  const schedulingInfo = []
  for (let i = 0; i < dbCard.lastRepetitionTimestampMillis.length; i++) {
    schedulingInfo.push({
      lastRepetitionTimestampMillis: dbCard.lastRepetitionTimestampMillis[i],
      dueTimestampMillis: dbCard.dueTimestampMillis[i],
      intervalMillis: dbCard.intervalMillis[i],
    })
  }
  return {
    id: dbCard.id,
    lastEventId: dbCard.lastEventId,
    createdAtTimestampMillis: dbCard.createdAtTimestampMillis!,
    userId: dbCard.userId,
    type: dbCard.type === "cloze" ? CardType.Cloze : CardType.QA,
    isDeleted: dbCard.isDeleted!,
    schedulingInfo,
    cardText: dbCard.cardText,
    attachments: (dbCard.attachments as attachmentsJSONType[]).map(a => ({
      attachmentRef: a.attachmentRef,
      mimeType: a.mimeType,
    }))
  }
}