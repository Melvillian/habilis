import { CardType } from './habilisCard.js';

export enum HabilisEventType {
  CardCreation = "cardCreation",
}

export type HabilisEvent = CardCreationEvent; // TODO add more types as we make more

// We store attachments in S3, so this Attachment type holds the URL reference
// to an S3 file
export type Attachment = {
  attachmentRef: string;
  mimeType: string;
}

// These are the fields all events share
export interface EventBase {
  id: string;
  type: HabilisEventType;
  // this will be the UTC datetime of the client that created the event, it should not be used for Event ordering, since it is not guaranteed to be in sync with the server's time
  createdAtTimestampMillis: Date;
  // this will be a random UUID determined by the creator of the event
  cardId: string;
  // a monotonically increasing bigint that is used to order events. It could be null when the event is created
  // by the client and hasn't yet been inserted into the DB where it will be assigned a sequenceID
  // note that there may be gaps in between consecutive inserted events, but it is guaranteed to be unique.
  // see https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-SERIAL for more info on how
  // this works
  sequenceId: bigint | null;
}

// See the `Card` type in `habilisCard.ts` for an explanation of each field

export interface CardCreationEventFields {
  userId: string;
  cardType: CardType;
  cardText: string;
  attachments: Attachment[] | null;
}
export interface CardCreationEvent extends EventBase, CardCreationEventFields {
  type: HabilisEventType.CardCreation;
}

// A simple helper function for making a CardCreationEvent
// TODO: we don't yet have a concept of Users, which is why I'm defaulting to the "TODO" for now
export const createCardCreationEvent = (cardType: CardType, cardText: string, userId: string = "TODO", attachments: Attachment[] | null = null): CardCreationEvent => {
  return {
    cardId: crypto.randomUUID(),
    createdAtTimestampMillis: new Date(),
    id: crypto.randomUUID(),
    type: HabilisEventType.CardCreation,
    userId,
    cardType,
    cardText,
    attachments,
    sequenceId: null,
  }
}