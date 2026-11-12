import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parts,
  activeParts,
  levelForPart,
  positionAt,
  selectionAtLevel,
} from "../src/parts.ts";
import { evidence } from "../src/evidence.ts";

test("specifications add the exact optional content cumulatively", () => {
  assert.deepEqual(
    activeParts("Low").map((p) => p.id),
    [
      "housing",
      "cap",
      "glass",
      "heater",
      "actuator",
      "base",
      "gasket",
      "harness",
      "fasteners",
    ],
  );
  assert.deepEqual(
    activeParts("Mid")
      .filter((p) => p.level === "Mid")
      .map((p) => p.id),
    ["foldMotor", "turnSignal"],
  );
  assert.deepEqual(
    activeParts("High")
      .filter((p) => p.level === "High")
      .map((p) => p.id),
    ["puddleLamp", "blindSpot", "camera", "autoDim"],
  );
  assert.equal(activeParts("High").length, 15);
});
test("a lower specification clears only incompatible selections", () => {
  assert.equal(selectionAtLevel("camera", "Low"), null);
  assert.equal(selectionAtLevel("foldMotor", "Mid"), "foldMotor");
  assert.equal(selectionAtLevel("glass", "Low"), "glass");
  assert.equal(selectionAtLevel(null, "High"), null);
  assert.equal(levelForPart("autoDim"), "High");
});
test("explosion recomputes from rest without accumulating drift and clamps bounds", () => {
  const rest = [1, 2, 3] as const,
    offset = [-2, 4, 5] as const;
  assert.deepEqual(positionAt(rest, offset, 0.5), [0, 4, 5.5]);
  for (let i = 0; i < 100; i++) {
    positionAt(rest, offset, 1);
    assert.deepEqual(positionAt(rest, offset, 0), rest);
  }
  assert.deepEqual(positionAt(rest, offset, 4), [-1, 6, 8]);
  assert.deepEqual(positionAt(rest, offset, -1), rest);
});
test("public captions stay qualitative and use short plain punctuation", () => {
  for (const part of parts) {
    for (const text of [part.idea, part.description, part.check])
      assert.doesNotMatch(text, /[\u2014;]|\d|[%$€]/);
    assert.ok(part.idea.length > 40);
  }
  assert.equal(new Set(parts.map((p) => p.id)).size, parts.length);
});

test("every insight has limits and all retained evidence uses neutral hosts", () => {
  for (const part of parts) {
    assert.ok(part.description.length > 30 && part.check.length > 30);
    for (const source of part.sources) {
      assert.equal(new URL(evidence[source].url).protocol, "https:");
      assert.ok(
        ["patents.google.com", "www.nhtsa.gov"].includes(
          new URL(evidence[source].url).hostname,
        ),
      );
    }
  }
});
