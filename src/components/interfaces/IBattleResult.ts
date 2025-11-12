import { IFighter } from "./IFighter";
import { Action } from "../../models/action";

// Output record generation
export interface IBattleResult {
  winner: IFighter | null;
  loser: IFighter | null;
  log: Action[];
  rounds: number;
}
