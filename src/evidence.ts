// Public references support the technique, not this model's production readiness.
export const evidence = {
  carrier: {
    title: "Published mirror assembly",
    kind: "Published design",
    url: "https://patents.google.com/patent/US11691567B2/en",
    supports:
      "Describes glass, a heater and a backing plate attached to an adjuster.",
  },
  optics: {
    title: "Mirror optics test procedure",
    kind: "Technical test reference",
    url: "https://www.nhtsa.gov/sites/nhtsa.gov/files/documents/tp-111-v01-final_tag.pdf",
    supports:
      "Shows why the required view and glass curvature must be checked. This historical procedure is not a current compliance assessment.",
  },

  service: {
    title: "Serviceable mirror modules",
    kind: "Published design",
    url: "https://patents.google.com/patent/US6416208B2/en",
    supports:
      "Describes removable fasteners and separately serviceable mirror modules.",
  },
  fold: {
    title: "Fold drive and pivot layout",
    kind: "Published design",
    url: "https://patents.google.com/patent/WO2022226525A1/en",
    supports: "Describes a motor, reduction gearing and the mirror pivot.",
  },
  signal: {
    title: "Mirror signal lamp construction",
    kind: "Published design",
    url: "https://patents.google.com/patent/US20220348133A1/en",
    supports: "Describes a lamp housing, lens, light guide and circuit board.",
  },
  puddle: {
    title: "Ground lighting module",
    kind: "Published design",
    url: "https://patents.google.com/patent/US11970115B2/en",
    supports:
      "Describes protected exterior lighting directed toward the ground.",
  },

  cameraSeal: {
    title: "Sealed vehicle camera construction",
    kind: "Published design",
    url: "https://patents.google.com/patent/US8792003B2/en",
    supports: "Describes the lens barrel, enclosure and watertight interfaces.",
  },

  dimming: {
    title: "Electrically dimming mirror layers",
    kind: "Published design",
    url: "https://patents.google.com/patent/US9669764B2/en",
    supports:
      "Describes active optical layers, electrical connections and sealed glass construction.",
  },
} as const;
export type EvidenceId = keyof typeof evidence;
