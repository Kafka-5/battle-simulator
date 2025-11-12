import { IFighter, FighterType } from "./fighter";
import { Action } from "./action";

/**
 * Attack and heal power based on fighter type.
 * You can adjust these values anytime.
 */
const TYPE_STATS: Record<FighterType, { attack: number; heal: number; delayMs: number }> = {
  wizard: { attack: 8, heal: 20, delayMs: 700 },
  warrior: { attack: 20, heal: 6, delayMs: 500 },
  knight: { attack: 12, heal: 12, delayMs: 600 },
};

function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

export class Fighter implements IFighter {
  constructor(
    public id: string,
    public name: string,
    public type: FighterType,
    public hp: number = 100,
    public maxHp: number = 100
  ) {}

  async act(opponent: IFighter, chosenAction: Action["action"]): Promise<Action> {
    const stats = TYPE_STATS[this.type];
    await delay(stats.delayMs);

    if (chosenAction === "attack") {
      const amount = stats.attack;
      opponent.hp = Math.max(opponent.hp - amount, 0);
      return { actorId: this.id, action: "attack", amount };
    } else {
      const amount = stats.heal;
      this.hp = Math.min(this.maxHp, this.hp + amount);
      return { actorId: this.id, action: "heal", amount };
    }
  }
}

/** Helper factory to create fighter */
export function createFighter(id: string, type: FighterType, name?: string) {
  const display = name && name.trim().length > 0 ? name.trim() : `${type[0].toUpperCase() + type.slice(1)}-${id}`;
  return new Fighter(id, display, type);
}
