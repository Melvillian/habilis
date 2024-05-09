import { bigserial, jsonb, text, boolean, serial, timestamp, uuid, pgEnum, pgTable, index} from "drizzle-orm/pg-core"
import { sql } from 'drizzle-orm'

// See packages/core/src/entity.ts for a description of entities and their types
export const entityTypeEnum = pgEnum("entity_type", ["task", "attachment_reference"]);

// The potential types of attachmentReferences
export const mimeTypeEnum = pgEnum("mime_type", ["image/png", "image/jpeg", "image/svg+xml"]);

// Represents information about where a particular entity originated, such as from a particular website, or
// chapter of a book
type provenanceJSONType = {
  identifier: string,
  url: string,
  title: string,
  selectors: object
};

// Represents info about the task's content, like the text that will be showed to the user in Cloze or QA tasks
type specJSONType = {
  type: string,
  content: { 
    type: string,
    body: {
      text: string,
      attachments: string[]
    },
    components: {
      order: number,
      ranges: {
        startIndex: number,
        length: number,
        hint: string
      }[]
    }[]
  }
};

// Represents scheduling information about a task, so we know when to show it to a user
type componentStateJSONType = {
  createdAtTimestampMillis: number,
  lastRepetitionTimestampMillis: number,
  dueTimestampMillis: number,
  intervalMillis: number
}[]

export const EntityTable = pgTable("entities", {
  id: serial("id").primaryKey(),
  entityType: entityTypeEnum("entity_type").notNull(),
  lastEventId: bigserial("last_event_id", { mode: "bigint"}).references(() => EventTable.id).notNull(),
  createdAtTimestampMillis: timestamp("created_at_timestamp_millis", { withTimezone: true}).defaultNow(),
  lastEventTimestampMillis: timestamp("last_event_timestamp_millis", { withTimezone: true}).notNull(),
  userId: uuid("user_id").references(() => UserTable.id).notNull(),

  // these are only for entities that are tasks
  isDeleted: boolean("is_deleted"),
  provenance: jsonb("provenance").$type<provenanceJSONType>(),
  spec: jsonb("spec").$type<specJSONType>(),
  componentStates: jsonb("component_states").$type<componentStateJSONType>(),

  // these are only for entities that are attachmentReferences
  mimeType: mimeTypeEnum("mime_type"),
}, (table) => {
  return {
    lastEventTimestampIdx: index("last_event_timestamp_idx").on(table.lastEventTimestampMillis),
    userIdIdx: index("user_id_idx").on(table.userId),
  }
});


export const EventTable = pgTable("events", {
  id: bigserial("id", { mode: "bigint"}).primaryKey(),
  timestampMillis: timestamp("timestamp_millis", { withTimezone: true}).notNull().defaultNow(),
  entityId: serial("entity_id").notNull(),

  // stores various fields of the different event types. See all of the types
  // that inherit from EventBase inpackages/core/src/event.ts for all of the
  // fields that gets stored in this column
  subfields: jsonb("subfields").notNull(),
}, (table) => {
  return {
    entityIdIdx: index("entity_id_idx").on(table.entityId),
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
    emailIdx: index("email_idx").on(table.email).using(sql``)
  }
})
