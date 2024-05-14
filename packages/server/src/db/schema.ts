import { jsonb, text, boolean, integer, timestamp, uuid, pgEnum, pgTable, index} from "drizzle-orm/pg-core"

export const cardTypeEnum = pgEnum("card_type", ["cloze", "qa"]);

type attachmentsJSONType = {
  attachmentRef: string,
  mimeType: string,
}

export const CardTable = pgTable("cards", {
  id: uuid("id").primaryKey(),
  lastEventId: uuid("last_event_id").references(() => EventTable.id).notNull(),
  createdAtTimestampMillis: timestamp("created_at_timestamp_millis", { withTimezone: true}).defaultNow(),
  userId: uuid("user_id").references(() => UserTable.id).notNull(),
  type: cardTypeEnum("type").notNull(),

  isDeleted: boolean("is_deleted").$default(() => false),
  lastRepetitionTimestampMillis: timestamp("last_repetition_timestamp_millis", { withTimezone: true}).notNull().array(),
  dueTimestampMillis: timestamp("due_timestamp_millis", { withTimezone: true}).notNull().array(),
  intervalMillis: integer("interval_millis").notNull().array(),
  cardText: text("card_text").notNull(),
  attachments: jsonb("attachments").$type<attachmentsJSONType>().array(),
}, (table) => {
  return {
    lastEventIdIdx: index("last_event_id_idx").on(table.lastEventId),
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
  createdAtTimestampMillis: timestamp("created_at_timestamp_millis", { withTimezone: true}).defaultNow(),
}, (table) => {
  return {
    emailIdx: index("email_idx").on(table.email)
  }
})
