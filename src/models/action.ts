export type ActionType = "attack" | "heal";

export interface Action {
  actorId: string;
  action: ActionType;
  amount: number;
  
}
