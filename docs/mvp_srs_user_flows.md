# MVP SRS User Flows

These are the User Flows we need to implement for the MVP of our cloud-based SRS
tool. This is meant to replace our existing Anki usage, so all of the flows
below have been chosen to solve the problems faced by the creators (Alex &
Will).

The goal here is to build a tool that will replace our existing Anki usage.

## User Flows

- [ ] DB schema for a Entities
- [ ] putEntities
- [ ] getEntities
- [ ] listEntities

- [ ] DB schema for Events
- [ ] putEvents
- [ ] getEvents
- [ ] listEvents

- [ ] DB schema for a User
- [ ] Create a User
  - [ ] id, email_address, login_info
- [ ] Update a User

- [ ] Review a Task
  - [ ] Frontend for viewing and interacting with a task, and creating resulting
        Event

- [ ] Turn an existing Anki Deck into a Habilis Deck
  - [ ] dataclass to store deck + card data extracted from an Anki sqlite DB
  - [ ] glue code to take the data extracted from Anki and create a Habilis Deck
        (this is already mostly in Orbit's `anki-import`)

- [ ] Automatic Card creation from a given knowledge database. This will be some
      ETL process similar to what Will & Alex have already created (Babotree as
      well as https://github.com/Melvillian/notion_2_anki_card) Plugins:
  - [ ] Notion
  - [ ] Readwise/Memex
  - [ ] Obsidian
  - [ ] Svelte frontend for connecting knowledge databases
    - [ ] Accepts a user's API key which should only have read permissions
    - [ ] User DB schema for storing this API key
    - [ ] Import DB schema for keeping track of what has been imported (i.e.
          Notion block IDs)

- [ ] In-app LLM chat that tutors you on topic of your current card
  - [ ] LLM topic detection
  - [ ] Chat UI
    - [ ] Chat System Prompt
    - [ ] Create a Chat
    - [ ] View a Chat
    - [ ] Update a Chat
  - [ ] backend system for storing chats
    - [ ] DB schema
