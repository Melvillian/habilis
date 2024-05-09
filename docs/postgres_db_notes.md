# Notes on How we Setup Postgres to use Orbit datatypes

- It's interesting to note that no where in the Orbit codebase do they define a schema for their DB. Instead, I think the way Andy made it work is that the types are enforced using the types defined in the `core/` package, and then the types have multiple backends (sqlite, indexeddb, firestore) so the `core/` types deserialize all the data from the multitude of backends

- To create and apply a migration: in the `server/` package, melvillian used `bun db:generate` which took the schema defined in `server/src/db/schema.ts` and created the initial migration file in `server/drizzle/migrations/`. Then melvillian ran `bun db:migrate` to apply the migration to the database.

- To make any queries to the DB (SELECT, UPDATE, DELETE), simply import the `db` object from `server/src/db/index.ts`, as well as any PG table definition you need and use it according to the [docs](https://orm.drizzle.team/docs/select).

```ts
// this example is from the src/routes.ts file
import { db, EventTable } from "./db";

router.get("/", async (ctx, next) => {
  await db.select().from(EventTable);

  await next();
});
```

## Useful videos and articles to read:

- [Drizzle Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints): shows how to define PRIMARY KEYs, FOREIGN KEY, and create indexes
- [Learn Drizzle in 60 Minutes](https://www.youtube.com/watch?v=7-NZ0MlPpJA)
- [Learn Drizzle ORM in 13 minutes](https://www.youtube.com/watch?v=hIYNOiZXQ7Y&t=274s): shows how to define a schema, setup, execute migrations, seed a test database, and how drizzle `relations` work.

```

```
