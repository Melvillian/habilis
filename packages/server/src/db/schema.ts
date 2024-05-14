import { bigserial, jsonb, text, boolean, serial, timestamp, uuid, pgEnum, pgTable, index} from "drizzle-orm/pg-core"

export const cardTypeEnum = pgEnum("card_type", ["cloze", "qa"]);

type attachmentsJSONType = {
  attachmentRef: string,
  mimeType: string,
}

export const CardTable = pgTable("cards", {
  id: serial("id").primaryKey(),
  lastEventId: bigserial("last_event_id", { mode: "bigint"}).references(() => EventTable.id).notNull(),
  createdAtTimestampMillis: timestamp("created_at_timestamp_millis", { withTimezone: true}).defaultNow(),
  userId: uuid("user_id").references(() => UserTable.id).notNull(),

  isDeleted: boolean("is_deleted"),
  lastRepetitionTimestampMillis: timestamp("last_repetition_timestamp_millis", { withTimezone: true}).notNull().array(),
  dueTimestampMillis: timestamp("due_timestamp_millis", { withTimezone: true}).notNull().array(),
  cardText: text("card_text").notNull(),
  textComponents: text("text_components").notNull().array(),
  attachments: jsonb("attachments").$type<attachmentsJSONType>().array(),
}, (table) => {
  return {
    lastEventIdIdx: index("last_event_id_idx").on(table.lastEventId),
    userIdIdx: index("user_id_idx").on(table.userId),
    dueTimestampMillisIds: index("due_timestamp_millis_idx").on(table.dueTimestampMillis),
  }
});


export const EventTable = pgTable("events", {
  id: bigserial("id", { mode: "bigint"}).primaryKey(),
  createdAtTimestampMillis: timestamp("created_at_timestamp_millis", { withTimezone: true }).notNull().defaultNow(),
  cardId: serial("card_id").notNull(),

  // stores various fields of the different event types. See all of the types
  // that inherit from EventBase inpackages/core/src/event.ts for all of the
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
