import { CardType } from './habilisCard.js';

export enum HabilisEventType {
  CardCreation = "cardCreation",
}

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
  // this may be null prior to insertion in the database, after which it'll contain the timestamp the DB gives to it
  createdAtTimestampMillis: string | null;
  // this will be a random UUID determined by the creator of the event
  cardId: string;
}

// See the `Card` type in `habilisCard.ts` for an explanation of each field
export interface CardCreationEvent extends EventBase {
  type: HabilisEventType.CardCreation;
  userId: string;
  cardType: CardType;
  cardText: string;
  attachments: Attachment[] | null;
}

// A simple helper function for making a CardCreationEvent
// TODO: we don't yet have a concept of Users, which is why I'm defaulting to the "TODO" for now
export const createCardCreationEvent = (cardType: CardType, cardText: string, attachments: Attachment[] | null, userId: string = "TODO"): CardCreationEvent => {
  return {
    cardId: crypto.randomUUID(),
    createdAtTimestampMillis: null,
    id: crypto.randomUUID(),
    type: HabilisEventType.CardCreation,
    userId,
    cardType,
    cardText,
    attachments
  }
}