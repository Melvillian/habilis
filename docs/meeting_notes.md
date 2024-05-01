# Meeting Notes

## April 18, 2024

Will and Alex talk, they decide

- probably gonna use Svelte and Typescript because that's what we already know
  and they have sufficient features for what we wanna do.
- unknown whether we plan to do a rewrite or not, but all things being equal
  it'd be nice
- next step is architecture doc with user flows
- talked about having a daily standup

## April 29, 2024

Talking about pros and cons of event stores

Talking about how to make it so that cards that are related to other cards get
queued up when

We talked about ways that event stores + LLM's wouldn't work well, and we
couldn't find any showstoppers

Ending decision on the use of an event store model was that it's good enough for
this MVP, and if a long the way we discover problems with it it won't be that
bad because it's an MVP.

Task: we need to research BullMQ and make sure it can a) store job tasks in
redis b) read/write data into Postgres c) can be run in a docker file for easy
infra setup d)
