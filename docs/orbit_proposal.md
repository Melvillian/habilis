## Proposal

I think we should use the majority of the logic in Andy Matuschak’s `orbit`
repo, because there exists enough cleanly-separated logic in the various
packages (which I go into greater depth in the “📦 Description of What, Why, and
How to use each package’s functions” toggle list below) for us to save several
months of development time. Andy has built a well-coded, well-thought-out
eventstore-based Typescript monorepo for storing and manipulating card data that
can be used for SRS.

The main packages I **do not** think we should use are the primary controllers
of the monorepo, namely the `app/` and `backend/` repos. These implement the
client-server architecture for the Orbit system. Instead, we should implement
our own frontend (using Svelte) and backend (using express + Typescript) to
implement a cloud-based SRS system that we can ingest our Notion + Markdown
notes into.

The next steps should be

1. to agree on these steps forward
2. choose which DB + logging + monitoring technologies we want to use for our
   backend + frontend
3. familiarize ourselves with the types and event store model used by Orbit
4. start implementing the frontend and backends

I’ve updated the User Flows and Architecture docs
[for Will’s review here](https://github.com/Melvillian/habilis/pulls).

<details>
<summary>📒 General Notes About Orbit</summary>

1. The 2 most important types in Orbit are the `Entity` and the `Event.`

   1. `Entity` s are either a `Task` (which you can think of as a QA or Cloze
      card) or an `Attachment` (which is a video/image/audio file stored on disk
      that gets referenced by a `Task`)
   2. `Event`s represent changes that occur in the system. There are events for
      all the types of changes that can occur to different `Entity`s. You can
      see all the different types of changes that `Event`s track
      [by looking here](https://github.com/andymatuschak/orbit/blob/889fc74ffb10be36447937bfe93e2c5d56b72b4c/packages/core/src/event.ts#L9)

2. Orbit is built around an
   [event store](https://en.wikipedia.org/wiki/Event_store), so events happen
   related to remembering cards, CRUD operations on cards, and users getting
   created. Then a piece of logic called a “reducer” takes an array of these
   events and computes the result of all those events happening in sequence. The
   end result is stored as an “entity”, which _I think_ is a general superclass
   of any data model in Orbit
3. The reason Andy chose to use an eventstore model is that it allows the user
   to easily work offline; the user does some studying offline, which generates
   a bunch of events which then get reduced locally. Then when the user comes
   back online the events get reduced on the server
4. I've spent 4-5 hours looking over the Orbit code and my suggestion after
   doing that, taking into account your findings with the licenses, is that we
   should write our own app + backend code but use the other packages that are
   covered under the super permissive Apache license. Here's my reasoning:
5. The `app/` and `backend/` libraries are difficult to understand, primarily
   because this is where all the other packages are imported used together. It's
   where the controller (think MVC) logic happens. They also make use of a ton
   of dependencies we have no experience in (expo, firebase, sentry,
   react-native-web (though that is used in some Apache-licensed packages as
   well), mailjet and bigquery). Learning to work with and around these
   dependencies is going to be the biggest source of friction, I predict
6. `packages/app` when run with `bun run web` (after getting `backend` setup)
   generates the page located at https://withorbit.com/
   1. `packages/app` can run on web, iOS, and Android

</details>

<details>
<summary>❓ Open Questions </summary>

1. What do I have to run to get the card creation and card review logic working?

   The card review scheduling logic exists within
   `packages/core/src/schedulers/spacedRepetitionScheduler.ts`. Orbit uses
   `Task`s to represent cards, and stores the card state in a
   `Task.componentStates: TaskComponentState`
   [which you can find here](https://github.com/andymatuschak/orbit/blob/889fc74ffb10be36447937bfe93e2c5d56b72b4c/packages/core/src/entities/task.ts#L17)

2. How easy is it to figure out how this repo works?

Besides the `app` and `backend` packages it is not that hard. Those 2 packages
are confusing because they use a lot of dependencies that are foreign to Will
and Alex, plus they pull together a lot of the other packages

3. How easy is it to modify this repo?

Dunno

4. How well tested is it?

   Right off the bat, not very well tested… when I run the backend server and
   then run `bun test` in the project root I get:

   ```jsx
   71 pass
   59 fail
   1100 expect() calls
   Ran 130 tests across 22 files. [8.29s]
   ```

   I think if I put in some time to understand how to get firebase config and
   the test environment working then these tests would mostly pass, though.

5. What is the software stack used? How foreign is it? How complex is it?

   `app/` and `backend/` packages contain most of the complexity of tools (see
   the Software Stack toggle list below). Otherwise its mostly pure Typescript,
   or dependencies with widespread usage like `sqlite`, `react`, and
   `indexeddb`,

</details>

<details>

<summary>🥞 The Software Stack</summary>

**Note:**

1. If a line has a ~~strikethrough~~ it, then it’s part of a package I don’t
   think we’ll be using. So you can rest easy knowing we won’t have to learn it!

- Typescript
- sqlite
- markdown
- ~~Expo (for building the React app and using `react-native` on mobile
  devices)~~
- Bun (for building and running packages), it also works well better than `npm`
  when working with monorepos like Orbit’s
- ~~Firebase (for app and Firestore hosting, authentication, cloud functions)~~
- ~~Sentry (for on-device error logging and reporting)~~
- ~~react-native-web~~
- Express
- ~~mailjet (for email notifications)~~
- ~~BigQuery (for logs and analytics)~~

</details>

<details>

<summary>📦 Description of What, Why, and How to use each package’s functions</summary>

**Note:**

1. It is best to read the following section by first running
   `git clone git@github.com:andymatuschak/orbit.git` locally and opening up the
   `packages/` directory in your code editor.
2. packages with a `~~strikethrough~~` are packages I believe we don’t need, and
   we can ignore

   <details>
    <summary>`anki-import`</summary>

   - uses HTML-parsing and `sqlite` to extract the cards from a `.apkg` Anki
     file (which is an `sqlite` db) and convert it to an array of `Events`
     representing the SRS actions like `TaskIngestEvent` and
     `TaskRepetitionEvent` .
   - This can be used to generate extract data from Anki and put it in a class
     that conforms to our DB model
   - The functions to use are `createImportPlan` and `readAnkiCollectionPackage`
   - **NOTE**: Andy says this isn’t production-ready, so this requires more test
     writing
   - Alex note: I tried to use `createImportplan` on my own `.apkg` and it kept
     giving me errors like
     `Please update to the latest Anki version, then import the .colpkg/.apkg file again`
     however when i used some random `.apkg` I found on the Internet it
     deciphers it fine using `anki-reader`. So i think this logic will be easy
     to re-implement, but there’s some immediate problem with my own anki deck
     😞

   </details>
    <details>
    <summary>`api`</summary>

   - A bunch of type declarations for the API router. **Honestly this all seems
     over-engineered** and we can probably write are own, more legible code for
     this and scrap this
   - Uses the `core` Orbit types as well as a JSON schema validator library
     `ajv` to create various validated interfaces
   - The main objects to use are `OrbitAPI` and `OrbitAPIValidator`
   - `api-client`
   - Uses `core` and `api` libraries to create a validated API interface to
     actual orbit-related functions, such as `listEvents2`, `putEvents2`,
     `getAttachment2`, and, `ingestAttachmentsFromURLs2`
   - The difference between `api` and `api-client` is that `api` client is doing
     non-orbit-related HTTP validation stuff, whereas `api-client` is actually
     defining an API spec for objects related to Orbit (such as `Events`
     `Tasks`, and `Attachments`)
   - An attachment is some video or audio file associated with an Anki card

   </details>

   <details>
    <summary>`core`</summary>

   1. Implements the main types for the eventstore model core to Orbit. Those
      types are
      1. `Task`
      2. `Event`
      3. `Entity` (which is one of `Task` or `AttachmentReference`
   2. Implements reducers that take an array of `Event`s and apply them all to
      get some final `Entity`
   3. has the scheduling + review logic core to SRS

   </details>
    <details>
    <summary>`~~embedded-support~~`</summary>

   A very thin package that holds only `interface`s and `enum`s. This can be
   ignored because it’s only used in `app` and `web-components` which we aren’t
   going to use

   </details>

   <details>
   <summary>`ingester` + `interpreter`</summary>

   - These packages do the work of interpreting Markdown notes and then
     ingesting them into a local Orbit database. Right now it only works for for
     QA cards and cloze cards that look like this:

     QA:

     ```markdown
     Q. What’s the initial-registration gotcha for service workers’ control of web
     pages?

     A. They won’t control the web page which registered them until it’s refreshed,
     unless that client is specifically claimed.
     ```

     Cloze:

     ```markdown
     Once activated, a service worker {performs one-time startup computation}, then
     transitions to {idle}. From that state, it’ll handle {fetch or message events}
     until it eventually terminates.
     ```

   - We _might_ want to use this code as inspiration or directly to help ingest
     users notes into our tool, but it might be worth implementing this
     ourselves. We can wait and see
   - The core logic of `interpreter` is in
     `packages/interpreter/src/interpreters/markdown/MarkdownInterpreter.ts` and
     its `interpret` function
   - The core logic of the `ingester` is in `packages/ingester/src/ingest.ts`
     and its `ingestSources` function, which uses an `OrbitStore` from the
     `store-shared/` package

   </details>

   <details>
    <summary>`store-shared`</summary>

   - Implements an abstract interface `OrbitStore` which can be used to
     interface with underlying DB implementations of which there are 2:

   1. `store-fs` uses sqlite and should be used by NodeJS and React Native (i.e.
      mobile) implementations)
   2. `store-web` uses IndexedDB and should be used by web browsers
   3. Here are the important classes:
      1. **`Database`** class:
         - This class provides methods for storing and querying events and the
           entities generated from those events.
         - Important methods:
         - `putEvents`: Stores a list of events and returns the updated
           entities.
         - `getEvents`: Retrieves events by their IDs.
         - `getEntities`: Retrieves entities by their IDs.
         - `listEvents`: Lists events based on a query.
         - `listEntities`: Lists entities based on a query.
         - `getMetadataValues`: Reads small, top-level metadata values.
         - `setMetadataValues`: Writes small, top-level metadata values.
      2. **`AttachmentStore`** interface:
         - This interface defines methods for storing and retrieving attachments
           (binary data) associated with entities.
         - Important methods:
         - `storeAttachment`: Stores an attachment and associates it with an ID.
         - `getURLForStoredAttachment`: Retrieves the local URL for a stored
           attachment.
         - `getAttachment`: Retrieves the contents and MIME type of a stored
           attachment.
      3. **`DatabaseBackend`** interface:
         - This interface defines the low-level operations that a database
           backend implementation must provide.
         - It is used by the `Database` class to interact with the underlying
           data storage.
      4. **`OrbitStore`** interface:
         - This interface combines
           the `Database` and `AttachmentStore` interfaces, providing a unified
           interface for working with both user data and attachments.
      5. **Database query types**:
         - `DatabaseEventQuery`: Defines options for querying events.
         - `DatabaseEntityQuery`: Defines options for querying entities.
         - `DatabaseQueryPredicate`: Defines predicates for filtering query
           results.
      6. **Utility functions**:
         - `encodeDataURL`: Encodes binary data as a data URL.
         - `runDatabaseTests`: Provides a set of tests for verifying the
           correctness of a `Database` implementation.

   </details>
    <details>
    <summary>`~~store-fs~~`</summary>

   - I don’t think we’ll need this in the beginning since we’ll be storing data
     on the server, but this could be nice for when we want to make our data
     exportable in a way that doesn’t tie their data to our database
   - Uses `sqlite` to store events + entities to store Attachments
   - most of the logic is in `packages/store-fs/src/sqlite.ts`
   - The entire DB exists at some file-location (unless you create an in-memory
     DB, in which case it doesn’t even touch disk and only exists in memory)

   </details>
    <details>
    <summary>`store-web`</summary>

   - same thing as `store-fs`, but it uses a library called `dexie` which wraps
     the native-to-the-browser-IndexedDB
   - this might be useful, if we wanted to make our webapp progressive and
     useable offline. That might be a good feature, but time will tell

   </details>

   <details>
    <summary>`sync`</summary>

   - Syncs deck data between some `OrbitStore` (either `store-fs` or `store-web`
     and the Orbit server (which uses Firestore).
   - Even though we might choose a different backend than Firestore, we can
     re-use this to helps users sync their local notes + anki decks with our DB

   </details>
    <details>
    <summary>`~~ui~~`</summary>

   - Used by `app` to implement the look and feel of the app.
   - We will probably not use this since we’re going to use svelte

   </details>
    <details>
    <summary>`~~web-components~~`</summary>

   - Implements the iframe logic for embedding user’s card prompts into blog
     posts
   - We can probably ignore this since we don’t want this functionality
   </details>

</details>
