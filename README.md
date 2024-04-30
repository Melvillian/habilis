# Habilis

🧠🔨 Tools for Thought 🧠🔨

## Orbit Fork Notice

Early on in the lifecycle of this project we chose to fork the majority of the
Apache-licensed code from
[Andy Matuschak's Orbit repo](https://github.com/andymatuschak/orbit). Andy has
a solid well-written codebase perfect for many different flavors of SRS
software, and since his code is permissively licensed we decided to fork it
rather than try to re-invent the wheel.

Our codebase differs from Andy's in that Orbit's `app/` and `backend/` packages
have been re-written from scratch to better match the needs of our project.
Instead, we have the `web-frontend/` and `server/` packages which are the
primary focus of our work.

## Packages

This is Habilis' mono-repo, comprising many modular packages. You'll want to run
`bun install` in the root to install dependencies before doing anything else.
(We use [Bun](https://bun.sh) as our package manager and script runner.) From
there, `bun run build` will build all the packages, and `bun test` will run all
the tests.

See the table below for an overview of this monorepo's packages, and see Readme
files in individual package folders for details on each package.

| Package               | Description                                          | Node | Browser | License        |
| --------------------- | ---------------------------------------------------- | ---- | ------- | -------------- |
| `web-frontend`        | Habilis web frontend written in Svelte               |      | ✅      | TODO           |
| `server`              | Habilis backend server that uses Postgres as its DB  | ✅   |         | TODO / BUSL1.1 |
| `api`                 | Interface definitions for Habilis' REST API          | ✅   | ✅      | APL2           |
| `api-client`          | Client implementation of Habilis API                 | ✅   | ✅      | APL2           |
| `core`                | Core data structures and operations                  | ✅   | ✅      | APL2           |
| `store-shared`        | Core types and functions for Habilis' data store     | ✅   | ✅      | APL2           |
| `store-fs`            | Data store implementation for on-disk file format    | ✅   |         | APL2           |
| `store-web`           | Data store implementation for browsers via IndexedDB |      | ✅      | APL2           |
| `sync`                | Syncs Habilis data stores (e.g. to central server)   | ✅   | ✅      | APL2           |
| _Auxiliary packages:_ |                                                      |      |         |                |
| `anki-import`         | Implements Anki .apkg import                         | ✅   |         | APL2           |
| `docs`                | Habilis' documentation site                          |      | ✅      | APL2           |
| `sample-data`         | Sample Habilis data for tests                        | ✅   |         | APL2           |

## Acknowledgements

We acknowledge [Andy Matuschak](https://andymatuschak.org) for his work on
[Orbit](https://github.com/andymatuschak/orbit) and his many writings which have
inspired us to try to build better SRS tools for the world.
