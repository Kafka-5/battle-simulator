import { IFighter } from "../components/interfaces/IFighter";
import { Action } from "../models/action";
import { IBattleResult } from "../components/interfaces/IBattleResult";

// controling the lifecycle
export class BattleArena {
  private log: Action[] = [];

  constructor(private fighterA: IFighter, private fighterB: IFighter) {}

  // signle turn buisness logic and recording output
  async takeTurn(
    attacker: IFighter,
    defender: IFighter,
    chosenAction: Action["action"]
  ): Promise<Action> {
    const action = await attacker.act(defender, chosenAction);
    this.log.push(action);
    return action;
  }

  // game over scenario
  isOver(): boolean {
    return this.fighterA.hp <= 0 || this.fighterB.hp <= 0;
  }

  // deciding the loser and winner
  getWinnerLoser(): { winner: IFighter | null; loser: IFighter | null } {
    if (this.fighterA.hp > 0 && this.fighterB.hp <= 0)
      return { winner: this.fighterA, loser: this.fighterB };
    if (this.fighterB.hp > 0 && this.fighterA.hp <= 0)
      return { winner: this.fighterB, loser: this.fighterA };
    return { winner: null, loser: null };
  }

  // final output
  getLog(): Action[] {
    return this.log;
  }
}
