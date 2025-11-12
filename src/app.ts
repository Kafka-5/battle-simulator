#!/usr/bin/env node
import * as readline from "readline";
import { createFighter } from "./models/fighterFactory";
import { FighterType } from "./components/types/fighterType";
import { BattleArena } from "./services/battleArena";
import { ActionType } from "./enums/actionType";
import { Action } from "./models/action";

// making user asynchronos */
function ask(question: string, rl: readline.Interface): Promise<string> {
  return new Promise((resolve) =>
    rl.question(question, (answer) => resolve(answer))
  );
}

// deciding the fighterType
function normalizeType(input: string): FighterType | null {
  const v = input.trim().toLowerCase();
  if (v === "wizard" || v === "w") return "wizard";
  if (v === "warrior" || v === "r") return "warrior";
  if (v === "knight" || v === "k") return "knight";
  return null;
}

// deciding the ActionType
function normalizeAction(input: string): Action["action"] | null {
  const v = input.trim().toLowerCase();
  if (v === "attack" || v === "a") return ActionType.ATTACK;
  if (v === "heal" || v === "h") return ActionType.HEAL;
  return null;
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("=== Welcome to the Turn-Based Battle Simulator ===\n");

  // Setup Player A
  let aType: FighterType | null = null;
  while (!aType) {
    const t = await ask(
      "Player A: Choose fighter (wizard/w, warrior/r, knight/k): ",
      rl
    );
    aType = normalizeType(t);
    if (!aType) console.log("Invalid type. Try again.");
  }
  const aName = await ask("Player A: Enter name (optional): ", rl);
  const fighterA = createFighter("A", aType, aName);

  // Setup Player B
  let bType: FighterType | null = null;
  while (!bType) {
    const t = await ask(
      "Player B: Choose fighter (wizard/w, warrior/r, knight/k): ",
      rl
    );
    bType = normalizeType(t);
    if (!bType) console.log("Invalid type. Try again.");
  }
  const bName = await ask("Player B: Enter name (optional): ", rl);
  const fighterB = createFighter("B", bType, bName);

  console.log("\nFighters Ready:");
  console.log(
    `${fighterA.name} (A) - Type: ${fighterA.type}, HP: ${fighterA.hp}`
  );
  console.log(
    `${fighterB.name} (B) - Type: ${fighterB.type}, HP: ${fighterB.hp}\n`
  );

  const arena = new BattleArena(fighterA, fighterB);

  // Toss for first turn
  let attacker = Math.random() < 0.5 ? fighterA : fighterB;
  let defender = attacker === fighterA ? fighterB : fighterA;
  console.log(`Toss Result: ${attacker.name} goes first!\n`);

  let rounds = 0;
  while (!arena.isOver()) {
    rounds++;
    console.log(`--- Round ${rounds} ---`);
    console.log(
      `${attacker.name} HP: ${attacker.hp} | ${defender.name} HP: ${defender.hp}`
    );

    let chosen: Action["action"] | null = null;
    while (!chosen) {
      const ans = await ask(
        `${attacker.name} (${attacker.id}) — choose action (attack/a, heal/h): `,
        rl
      );
      chosen = normalizeAction(ans);
      if (!chosen) console.log("Invalid action. Enter 'attack' or 'heal'.");
    }

    const action = await arena.takeTurn(attacker, defender, chosen);

    if (action.action === ActionType.ATTACK) {
      console.log(
        `${attacker.name} attacked ${defender.name} for ${action.amount} damage!`
      );
    } else {
      console.log(`${attacker.name} healed for ${action.amount}.`);
    }

    console.log(
      `${attacker.name} HP: ${attacker.hp}, ${defender.name} HP: ${defender.hp}\n`
    );

    if (arena.isOver()) break;
    [attacker, defender] = [defender, attacker];
  }

  const { winner } = arena.getWinnerLoser();
  console.log("\n=== Battle Over ===");
  console.log(`Winner: ${winner ? winner.name : "No one (Draw)"}\n`);

  console.table(
    arena.getLog().map((a, i) => ({
      Turn: i + 1,
      Actor: a.actorId,
      Action: a.action,
      Amount: a.amount,
    }))
  );

  rl.close();
}

main().catch((e) => {
  console.error("Unexpected Error:", e);
  process.exit(1);
});
