import type {CardCreationEvent, Card} from "@habilis/core/"

const templateRegex = /{{.*?}}/g;

/**
 * A simple reducer that maps a CardCreationEvent to a Card
 */
export const createCardReducer = (event: CardCreationEvent): Card => {
  return {
    id: event.cardId,
    lastEventId: event.id,
    createdAtTimestampMillis: event.createdAtTimestampMillis,
    userId: event.userId,
    type: event.cardType,
    isDeleted: false,
    cardText: event.cardText,
    schedulingInfo: createSchedulingInfoFromCardText(event, event.cardText),
    attachments: event.attachments || []
  } as Card;
}

// Uses the count of template characters in the cardText to determine how many schedlingInfo entries to create.
// Each schedulingInfo is the same, since they were all created at the same time.
const createSchedulingInfoFromCardText = (event: CardCreationEvent, cardText: string): Card["schedulingInfo"] => {
  const matches = cardText.match(templateRegex);
  const count = matches ? matches.length : 0;
  const schedulingInfo: Card["schedulingInfo"] = [];
  
  for (let i = 0; i < count; i++) {
    schedulingInfo.push({
      lastRepetitionTimestampMillis: event.createdAtTimestampMillis,
      dueTimestampMillis: event.createdAtTimestampMillis,
      intervalMillis: 0
    })
  }
  return schedulingInfo;
}