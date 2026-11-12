// Public references support the technique, not this model's production readiness.
export const evidence = {
  moulding: {
    title: "Plastic part design guide",
    kind: "Manufacturing guidance",
    url: "https://www.protolabs.com/resources/guides-and-trend-reports/injection-molding-guide-process-design-tips-materials/",
    supports: "Explains wall thickness, ribs, screw posts and mould release.",
  },
  colour: {
    title: "Weatherable mirror plastics",
    kind: "Material application",
    url: "https://www.ineos.com/businesses/ineos-styrolution/industries/automotive/exterior/",
    supports: "Describes unpainted, weather-resistant mirror components.",
  },
  snaps: {
    title: "Moulded clip design guide",
    kind: "Manufacturing guidance",
    url: "https://www.protolabs.com/resources/design-tips/5-ways-to-master-complex-features-in-injection-molded-parts/",
    supports: "Explains snap features and the tooling needed to release them.",
  },
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
  heater: {
    title: "Mirror heater construction",
    kind: "Current product offering",
    url: "https://www.backerhti.com/industry-sectors/automotive",
    supports:
      "Describes thin foil mirror heaters and glass temperature limits.",
  },
  adjuster: {
    title: "Mirror drive modules",
    kind: "Current product offering",
    url: "https://www.motioncontrols.com/products",
    supports: "Shows separate glass-adjustment and power-fold drive families.",
  },
  bracket: {
    title: "Reinforced plastic mirror brackets",
    kind: "Material application",
    url: "https://plastics-rubber.basf.com/southamerica/en/performance_polymers/industries/pp_automotive/applications/application_exterior",
    supports:
      "Describes reinforced plastic in mirror brackets and bases as a metal-replacement approach.",
  },
  seal: {
    title: "Gasket compression guidance",
    kind: "Manufacturing guidance",
    url: "https://discover.parker.com/edge-bonded-integral-seal-technology",
    supports: "Explains controlled compression at a sealing joint.",
  },
  connector: {
    title: "Unused connector cavity plugs",
    kind: "Current product offering",
    url: "https://www.te.com/en/product-CAT-J58-NCP.html",
    supports:
      "Shows sealing plugs for unused positions in compatible connectors.",
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
  detection: {
    title: "Blind-spot warning system",
    kind: "Current system description",
    url: "https://www.bosch-mobility.com/en/solutions/assistance-systems/blind-spot-detection/",
    supports:
      "Separates vehicle detection sensors from the warning light in the mirror.",
  },
  camera: {
    title: "Wide-angle vehicle cameras",
    kind: "Current product offering",
    url: "https://www.bosch-mobility.com/en/solutions/camera/near-range-camera/",
    supports: "Describes the viewing field of near-range vehicle cameras.",
  },
  cameraSeal: {
    title: "Sealed vehicle camera construction",
    kind: "Published design",
    url: "https://patents.google.com/patent/US8792003B2/en",
    supports: "Describes the lens barrel, enclosure and watertight interfaces.",
  },
  cameraSetup: {
    title: "Surround-view camera setup",
    kind: "System product information",
    url: "https://continental-automotive.scene7.com/is/content/ContiAutomotiveProd/Continental-ProViu-2ndGen_-Productinformationpdf?cdh=attachment",
    supports:
      "Describes calibration in a multi-camera vehicle system. This does not specify the setup process for this illustrative mirror.",
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
