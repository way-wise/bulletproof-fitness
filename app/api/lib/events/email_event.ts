import { EventEmitter } from "events";

export const emailEvents = new EventEmitter();

export enum EmailEventType {
  VERIFY_EMAIL = "verify-email",
}
