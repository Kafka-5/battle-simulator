import { Action } from "../../models/action";
import { FighterType } from "../types/fighterType";

// fighter Structure
export interface IFighter {
  id: string;
  name: string;
  type: FighterType;
  hp: number;
  maxHp: number;

  //   asynchronous atack and healing
  act(opponent: IFighter, chosenAction: Action["action"]): Promise<Action>;
}
