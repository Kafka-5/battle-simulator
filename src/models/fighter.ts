import { IFighter } from "../components/interfaces/IFighter";
import { FighterType } from "../components/types/fighterType";
import { delay } from "../utils/delay";
import { Action } from "./action";

const TYPE_STATS: Record<
  FighterType,
  { attack: number; heal: number; delayMs: number }
> = {
  wizard: { attack: 8, heal: 20, delayMs: 700 },
  warrior: { attack: 20, heal: 6, delayMs: 500 },
  knight: { attack: 12, heal: 12, delayMs: 600 },
};

export class Fighter implements IFighter {
  constructor(
    public id: string,
    public name: string,
    public type: FighterType,
    public hp: number = 100,
    public maxHp: number = 100
  ) {}

  async act(
    opponent: IFighter,
    chosenAction: Action["action"]
  ): Promise<Action> {
    const stats = TYPE_STATS[this.type];
    await delay(stats.delayMs);

    if (chosenAction === "attack") {
      const amount = stats.attack;
      opponent.hp = Math.max(opponent.hp - amount, 0);
      return { actorId: this.id, action: chosenAction, amount };
    } else {
      const amount = stats.heal;
      this.hp = Math.min(this.maxHp, this.hp + amount);
      return { actorId: this.id, action: chosenAction, amount };
    }
  }
}
