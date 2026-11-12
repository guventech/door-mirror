export const levels = ["Low", "Mid", "High"] as const;
export type Level = (typeof levels)[number];
export type PartId = (typeof parts)[number]["id"];

export const parts = [
  {
    id: "housing",
    name: "Housing",
    level: "Low",
    category: "Structure",
    material: "Weatherable polymer",
    description:
      "A hollow plastic housing protects the mechanism. Ribs and hollow screw posts support the parts inside.",
    idea: "Use colour in the plastic to avoid a separate paint step when the finish and outdoor durability allow it.",
    check:
      "Wall thickness, tool release and outdoor durability still need engineering checks.",
    sources: [],
  },
  {
    id: "cap",
    name: "Cover cap",
    level: "Low",
    category: "Exterior",
    material: "Moulded polymer",
    description:
      "The upper cover gives the mirror its outer finish. Flexible hooks engage matching catches on the housing.",
    idea: "Use releasable clips where they can hold the cover securely. This may remove cover screws and keep repair access.",
    check:
      "Check clip strength, repeated removal and how the mould opens around each hook.",
    sources: [],
  },
  {
    id: "glass",
    name: "Mirror glass",
    level: "Low",
    category: "Optics",
    material: "Coated glass and plastic carrier",
    description:
      "A plastic carrier supports the glass and connects it to the adjuster. A thin heater sits between the glass and the carrier.",
    idea: "Reuse the glass shape and carrier only when the required view, glass curve and mounting points match.",
    check:
      "The flat glass and separated layers here are simplified. They do not prove the required view or a bonded production stack.",
    sources: ["carrier", "optics"],
  },
  {
    id: "heater",
    name: "Heater pad",
    level: "Low",
    category: "Electronics",
    material: "Thin electrical heater",
    description:
      "A thin resistive circuit warms the back of the glass on the carrier. Two terminals complete its electrical connection.",
    idea: "Reuse a heater only when its shape, heat coverage and electrical power match.",
    check:
      "Check glass temperature, electrical resistance and the adhesive. The visible circuit is enlarged for clarity.",
    sources: ["carrier"],
  },
  {
    id: "actuator",
    name: "Glass adjuster",
    level: "Low",
    category: "Mechanism",
    material: "Geared motor module",
    description:
      "In the Low specification the glass tilt is electric. Two small geared drives connect the carrier to its support bracket.",
    idea: "Reuse the same adjuster when its tilt range, load capacity and mounting points suit the mirror.",
    check:
      "Check movement clearance, vibration, motor load and the extra wiring it needs. The internal gears are not modelled.",
    sources: ["carrier"],
  },
  {
    id: "base",
    name: "Base and bracket",
    level: "Low",
    category: "Structure",
    material: "Reinforced polymer",
    description:
      "The structural bracket carries the mirror loads into the door. The upright pivot can support a manual fold or breakaway when the power-fold motor is absent.",
    idea: "Consider reinforced plastic instead of metal only after strength and vibration checks. Metal inserts may still be needed.",
    check:
      "Check long-term strength, temperature, moisture and vibration. No structural test has been done on this model.",
    sources: [],
  },
  {
    id: "gasket",
    name: "Door gasket",
    level: "Low",
    category: "Sealing",
    material: "Flexible elastomer",
    description:
      "A soft gasket seals the base against the door when the joint compresses it. Openings allow the mounting points and wiring to pass through.",
    idea: "Use a simple seal shape with even pressure around it. Keep the fasteners needed to clamp the base to the door.",
    check:
      "The seal is shown uncompressed. Its material, squeeze and water tightness still need testing.",
    sources: [],
  },
  {
    id: "harness",
    name: "Wiring and connector",
    level: "Low",
    category: "Electronics",
    material: "Wiring and connector",
    description:
      "The wiring supplies the heater, motors, lamps and camera. Flexible loops allow the glass and fold pivot to move.",
    idea: "Use one connector family. Omit wires for absent options and plug unused sealed connector positions.",
    check:
      "Check wire ratings, water sealing and movement. The model does not specify a complete electrical circuit or camera data link.",
    sources: [],
  },
  {
    id: "fasteners",
    name: "Screws and clips",
    level: "Low",
    category: "Assembly",
    material: "Metal and polymer",
    description:
      "Fasteners hold the loaded joints together. Cover clips have a different job from the screws that support the assembly.",
    idea: "Use fewer screw types where possible. Keep screws at loaded joints and make repair points reachable.",
    check:
      "Check tightening load, pull-out strength and access for tools. A clip must suit its own load and repair needs.",
    sources: ["service"],
  },
  {
    id: "foldMotor",
    name: "Power-fold motor",
    level: "Mid",
    category: "Mechanism",
    material: "Replaceable geared module",
    description:
      "A geared motor folds the mirror around the upright base pivot. It needs harness pins, a connector and vehicle control logic beyond the Low specification.",
    idea: "Make the drive a removable module with reachable screws and a plug. This can avoid replacing the whole mirror when the drive fails.",
    check:
      "Check holding force, manual release, repair access and the added wiring. The gears and release mechanism are simplified.",
    sources: ["fold"],
  },
  {
    id: "turnSignal",
    name: "Turn-signal lamp",
    level: "Mid",
    category: "Lighting",
    material: "Sealed lamp module",
    description:
      "An enclosed LED module sends light through a lens and light guide. Turn signalling is a regulated lighting function on public roads.",
    idea: "Share a lamp only when its mounting space and required light pattern suit each mirror. Do not treat the lamp as optional for legal use.",
    check:
      "Check sealing, visibility and optical performance against the applicable lighting rules. This model has no tested light distribution.",
    sources: ["signal"],
  },
  {
    id: "puddleLamp",
    name: "Puddle lamp",
    level: "High",
    category: "Lighting",
    material: "Plug-in lamp module",
    description:
      "This small lamp lights the ground below the door. Its lens faces down through an opening in the housing and needs its own harness feed.",
    idea: "Use one mounting pocket for a lamp or a sealed cover. Check that the cover keeps water out.",
    check:
      "Check ground coverage, drainage, seal versions and the extra connector pins.",
    sources: ["puddle"],
  },
  {
    id: "blindSpot",
    name: "Blind-spot indicator",
    level: "High",
    category: "Lighting",
    material: "Light guide and indicator",
    description:
      "This in-mirror light shows a warning from the vehicle. The detecting sensor sits elsewhere on the vehicle and is not part of this assembly.",
    idea: "Reserve space and wiring for an optional warning light. It still needs a separate vehicle detection system.",
    check:
      "Check the viewing angle, brightness and electrical interface. This version uses a small window in the housing.",
    sources: [],
  },
  {
    id: "camera",
    name: "Side camera",
    level: "High",
    category: "Electronics",
    material: "Sealed camera module",
    description:
      "A wide-angle camera in the housing views the area beside the car for near-range or surround systems. It does not replace the mirror glass.",
    idea: "Reuse the camera pocket only when the view, seal and aiming accuracy suit the system.",
    check:
      "The vehicle may need camera alignment after replacement. Optics, sealing, data link, software and calibration are not validated here.",
    sources: ["cameraSeal"],
  },
  {
    id: "autoDim",
    name: "Auto-dimming glass",
    level: "High",
    category: "Optics",
    material: "Electrically dimming glass assembly",
    description:
      "Electricity changes an active layer so the mirror reflects less glare. The colour change here represents a different glass assembly with control electronics and wiring.",
    idea: "Keep dimming optional. The same outer shape can still require different glass layers, edge seals, harness pins and control logic.",
    check:
      "A darker material in this viewer does not model the internal optical layers or the control system.",
    sources: ["dimming"],
  },
] as const;

export function activeParts(level: Level) {
  return parts.filter((p) => levels.indexOf(p.level) <= levels.indexOf(level));
}
export function levelForPart(id: PartId): Level {
  return parts.find((p) => p.id === id)!.level;
}
export function selectionAtLevel(
  id: PartId | null,
  level: Level,
): PartId | null {
  return id && levels.indexOf(levelForPart(id)) <= levels.indexOf(level)
    ? id
    : null;
}
export function badge(level: Level) {
  if (level === "Low") return "In Low spec";
  return `Added at ${level}`;
}
export function inactiveLabel() {
  return "Not in this spec";
}
export function positionAt(
  rest: readonly number[],
  offset: readonly number[],
  amount: number,
  path?: readonly { at: number; offset: readonly number[] }[],
  finish = 1,
) {
  const t = Math.max(0, Math.min(1, amount));
  if (path?.length) {
    const next = path.findIndex((key) => key.at >= t);
    if (next === 0) return rest.map((value, i) => value + path[0].offset[i]);
    const end = path[next < 0 ? path.length - 1 : next];
    const start = path[Math.max(0, (next < 0 ? path.length - 1 : next) - 1)];
    const fraction = Math.min(1, (t - start.at) / (end.at - start.at));
    return rest.map(
      (value, i) =>
        value + start.offset[i] + (end.offset[i] - start.offset[i]) * fraction,
    );
  }
  return rest.map((value, i) => value + offset[i] * Math.min(1, t / finish));
}
