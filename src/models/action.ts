import { ActionType } from "../enums/actionType";

// Record maintainence
export interface Action {
  actorId: string;
  action: ActionType;
  amount: number;
}
