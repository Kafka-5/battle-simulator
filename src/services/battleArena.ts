import { IFighter } from "../models/fighter";
import { Action } from "../models/action";

export interface BattleResult {
  winner: IFighter | null;
  loser: IFighter | null;
  log: Action[];
  rounds: number;
}

export class BattleArena {
  private log: Action[] = [];

  constructor(private fighterA: IFighter, private fighterB: IFighter) {}

  async takeTurn(attacker: IFighter, defender: IFighter, chosenAction: Action["action"]): Promise<Action> {
    const action = await attacker.act(defender, chosenAction);
    this.log.push(action);
    return action;
  }

  isOver(): boolean {
    return this.fighterA.hp <= 0 || this.fighterB.hp <= 0;
  }

  getWinnerLoser(): { winner: IFighter | null; loser: IFighter | null } {
    if (this.fighterA.hp > 0 && this.fighterB.hp <= 0) return { winner: this.fighterA, loser: this.fighterB };
    if (this.fighterB.hp > 0 && this.fighterA.hp <= 0) return { winner: this.fighterB, loser: this.fighterA };
    return { winner: null, loser: null };
  }

  getLog(): Action[] {
    return this.log;
  }
}
