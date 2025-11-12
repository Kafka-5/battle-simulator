import { Action } from "./action";

export type FighterType = "wizard" | "warrior" | "knight";

export interface IFighter {
  id: string;
  name: string;
  type: FighterType;
  hp: number;
  maxHp: number;

  // act should perform the action's effect (attack/heal) and return the Action
  act(opponent: IFighter, chosenAction: Action["action"]): Promise<Action>;
}
