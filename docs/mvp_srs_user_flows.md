# MVP SRS User Flows

These are the User Flows we need to implement for the MVP of our cloud-based SRS
tool. This is meant to replace our existing Anki usage, so all of the flows
below have been chosen to solve the problems faced by the creators (Alex &
Will).

The goal here is to build a tool that will replace our existing Anki usage.

## User Flows

- [ ] DB schema for a Deck
- [ ] Create a Deck
  - [ ] Name
- [ ] View 1 Deck
- [ ] View N Decks
  - [ ] should be able to view all of a Deck's Cards, as well as Deck attributes
- [ ] Delete a Deck
- [ ] Update a Deck
  - [ ] Deck Name

- [ ] DB schema for a Card
- [ ] Create a Card
  - [ ] id, card_type (cloze, front-back, etc...), text, hidden_text
- [ ] View 1 Card
- [ ] View N Cards
- [ ] Delete a Card
- [ ] Update a Card
  - [ ] card_type (cloze, front-back, etc...), text, hidden_text

- [ ] DB schema for a User
- [ ] Create a User
  - [ ] id, email_address, login_info
- [ ] Update a User

- [ ] Review a Card in a Deck
  - [ ] DB schema for a Review of a given Card-User pair
  - [ ] Create a Review
  - [ ] Review 1 Review (this will be the majority of the work, because this
        will be the review system)
  - [ ] Review N Reviews
  - [ ] Delete a Review
  - [ ] View a Review
    - [ ] id, user_id, card_id, last_edited, num_reviewed, learning_rate

- [ ] Turn an existing Anki Deck into a Habilis Deck
  - [ ] dataclass to store deck + card data extracted from an Anki sqlite DB
  - [ ] glue code to take the data extracted from Anki and create a Habilis Deck

- [ ] Automatic Card creation from a given knowledge database. This will be some
      ETL process similar to what Will & Alex have already created (Babotree as
      well as https://github.com/Melvillian/notion_2_anki_card)
  - [ ] Notion
  - [ ] Readwise/Memex
  - [ ] Obsidian

- [ ] In-app LLM chat that tutors you on topic of your current card
  - [ ] LLM topic detection
  - [ ] LLM Card RAG
  - [ ] chat UI
  - [ ] backend system for storing chats
    - [ ] Redis schema
