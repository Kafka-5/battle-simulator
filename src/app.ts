#!/usr/bin/env node
import * as readline from "readline";
import { createFighter } from "./models/fighterTypes";
import { FighterType } from "./models/fighter";
import { BattleArena } from "./services/battleArena";
import { Action } from "./models/action";

function ask(question: string, rl: readline.Interface): Promise<string> {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer)));
}

function normalizeType(input: string): FighterType | null {
  const v = input.trim().toLowerCase();
  if (v === "wizard" || v === "w") return "wizard";
  if (v === "warrior" || v === "r") return "warrior";
  if (v === "knight" || v === "k") return "knight";
  return null;
}

function normalizeAction(input: string): Action["action"] | null {
  const v = input.trim().toLowerCase();
  if (v === "attack" || v === "a") return "attack";
  if (v === "heal" || v === "h") return "heal";
  return null;
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log("🎮 Welcome to the Turn-Based Battle Simulator!\n");

  // === Player A setup ===
  let aType: FighterType | null = null;
  while (!aType) {
    const t = await ask("Player A: Choose fighter type (wizard/w, warrior/r, knight/k): ", rl);
    aType = normalizeType(t);
    if (!aType) console.log("❌ Invalid type. Try again.");
  }
  const aName = await ask("Player A: Enter display name (or press Enter for default): ", rl);
  const fighterA = createFighter("A", aType, aName);

  // === Player B setup ===
  let bType: FighterType | null = null;
  while (!bType) {
    const t = await ask("Player B: Choose fighter type (wizard/w, warrior/r, knight/k): ", rl);
    bType = normalizeType(t);
    if (!bType) console.log("❌ Invalid type. Try again.");
  }
  const bName = await ask("Player B: Enter display name (or press Enter for default): ", rl);
  const fighterB = createFighter("B", bType, bName);

  console.log("\n✅ Fighters Ready:");
  console.log(`${fighterA.id} - ${fighterA.name} (${fighterA.type}) HP: ${fighterA.hp}`);
  console.log(`${fighterB.id} - ${fighterB.name} (${fighterB.type}) HP: ${fighterB.hp}\n`);

  // toss to decide who goes first
  let attacker = Math.random() < 0.5 ? fighterA : fighterB;
  let defender = attacker === fighterA ? fighterB : fighterA;
  console.log(`🪙 Toss Result: ${attacker.name} (${attacker.id}) goes first!\n`);

  const arena = new BattleArena(fighterA, fighterB);
  let rounds = 0;

  while (!arena.isOver()) {
    rounds++;
    console.log(`--- Round ${rounds} ---`);
    console.log(`${attacker.name} HP: ${attacker.hp} | ${defender.name} HP: ${defender.hp}`);

    let chosen: Action["action"] | null = null;
    while (!chosen) {
      const ans = await ask(`${attacker.name} (${attacker.id}) — choose action (attack/a, heal/h): `, rl);
      chosen = normalizeAction(ans);
      if (!chosen) console.log("❌ Invalid action. Enter 'attack' or 'heal'.");
    }

    const action = await arena.takeTurn(attacker, defender, chosen);

    if (action.action === "attack") {
      console.log(`⚔️ ${attacker.name} attacked ${defender.name} for ${action.amount} damage!`);
      console.log(`❤️ ${defender.name} HP is now ${defender.hp}\n`);
    } else {
      console.log(`✨ ${attacker.name} healed for ${action.amount}.`);
      console.log(`❤️ ${attacker.name} HP is now ${attacker.hp}\n`);
    }

    if (arena.isOver()) break;
    [attacker, defender] = [defender, attacker];
  }

  // === Result ===
  const { winner } = arena.getWinnerLoser();
  console.log(`\n🏁 Battle Over!`);
  console.log(`🏆 Winner: ${winner ? winner.name : "No one (Draw)"}\n`);

  console.table(
    arena.getLog().map((a, i) => ({
      Totalturns: i,
      actorId: `'${a.actorId}'`,
      action: `'${a.action}'`,
      amount: a.amount,
    }))
  );

  rl.close();
}

main().catch((e) => {
  console.error("Unexpected Error:", e);
  process.exit(1);
});
