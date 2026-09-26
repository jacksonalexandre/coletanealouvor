import { describe, expect, it } from "vitest";
import { drawItems, drawPhase, DRAW_DURATION } from "./draw";

describe("projected draw", () => {
  it("only derives timing from immutable predetermined winners and decelerates", () => {
    const winners = ["73", "14", "128"];
    expect(drawPhase(winners, 1000, 1000)).toMatchObject({index:0,revealing:true});
    expect(drawPhase(winners, 1000, 3700)).toMatchObject({index:0,revealing:false});
    expect(drawPhase(winners, 1000, 1000+DRAW_DURATION)).toMatchObject({index:1,revealing:true});
    expect(drawPhase(winners, 1000, 999999)).toMatchObject({index:2,revealing:false});
    const early = drawPhase(winners, 0, 500).tick-drawPhase(winners, 0, 0).tick;
    const late = drawPhase(winners, 0, 2500).tick-drawPhase(winners, 0, 2000).tick;
    expect(early).toBeGreaterThan(late);
    expect(winners).toEqual(["73", "14", "128"]);
  });
  it("exhausts numbers/names without repetition across multiple rounds", () => {
    for(const pool of [["1","2","3","4"],["Ana","Maria","João","Pedro"]]) {
      const first=drawItems(pool,2,true,[]), second=drawItems(pool,2,true,first);
      expect(new Set([...first,...second]).size).toBe(4);
      expect(()=>drawItems(pool,1,true,[...first,...second])).toThrow("Restam 0 opções");
    }
  });
});
