import { describe, expect, it } from "vitest";
import { introDialogue } from "./dialogues";

describe("introDialogue", () => {
  it("contains the full Paul and Kyle intro before puzzle 1", () => {
    expect(introDialogue).toHaveLength(16);
    expect(introDialogue[0]).toEqual({ speaker: "Paul", text: "Kyle." });
    expect(introDialogue.at(-1)).toEqual({ speaker: "Kyle", text: "Marché conclu !" });
  });
});
