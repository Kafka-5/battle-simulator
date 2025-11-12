import { Fighter } from "./fighter";
import { FighterType } from "../components/types/fighterType";

// creation for the fighter
export function createFighter(id: string, type: FighterType, name?: string) {
  const displayName =
    name?.trim() || `${type[0].toUpperCase() + type.slice(1)}-${id}`;
  return new Fighter(id, displayName, type);
}
