import { Attachment } from "./habilisEvent.js";

export enum CardType {
  Cloze = "cloze",
  QA = "qa",
}

export interface Card {
  id: string;
  lastEventId: string;
  // the creation time in milliseconds, determined by when it is inserted into the database
  createdAtTimestampMillis: Date;
  // The user that created the card
  userId: string;
  type: CardType;
  isDeleted: boolean;
  // A string that uses the "{{...}}" template to represent the a 'qa' or 'cloze' type card. Let's look
  // at some examples of the two types of cards to understand what `cardText` will look like:
  // 
  // Example qa card: 
  //   cardText: "In 2016 how many gigatons of greenhouse gasses were emitted worldwide? {{52 gigatons}}"
  //
  // Example cloze card:
  //   cardText: "{{52 gigatons}} of greenhouse gasses were emitted in the year {{2016}}"
  //
  // At runtime on the frontend, a card will be created for each template within a card text
  cardText: string;
  // For each of the {{...}} templates in the cardText, this array will contain the scheduling
  // info for that card face
  schedulingInfo: {
    lastRepetitionTimestampMillis: Date;
    dueTimestampMillis: Date;
    intervalMillis: number;
  }[];
  // Any video/audio/images associated with the card
  // TODO: we need to figure out how to arrange the attachments on the card, right now we
  // have no way to know how the user would want the attachments organized and displayed
  // to them when they review
  attachments: Attachment[];
  
}