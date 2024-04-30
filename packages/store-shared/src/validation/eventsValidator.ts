import { Event } from "@habilis/core";

type Events = Event[];

export type EventsValidatorError = {
  errors: { message: string }[];
};

export interface EventsValidator {
  validateEvents(events: Events): EventsValidatorError | true;
}
