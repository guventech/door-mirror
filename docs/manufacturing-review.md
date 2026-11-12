# Manufacturing review of the generic door mirror

Reviewed 12 November 2026. Scope: the 15 logical entries in `src/parts.ts` and the original procedural illustration in `scripts/model.mjs`. This is an evidence review of the starting model, not a tooling release or certification of subsequently edited geometry. No proprietary teardown or supplier geometry was copied.

## What the evidence establishes

The component families are representative of exterior mirrors. The starting geometry omits important connections. A useful interior has a load path from door mounting to bracket, adjuster and glass carrier. A hollow shell is expected. Empty space alone is not a fault, since the glass needs room to tilt and the wiring needs room to flex. Filling it with arbitrary solids would obscure the engineering story. A published mirror assembly describes a moulded backing plate supporting the glass, a heater between glass and plate, and the opposite face attaching to the adjuster. [Mirror assembly, US11691567B2, description of reflective element and backing plate](https://patents.google.com/patent/US11691567B2/en).

Evidence labels below separate **documented technique**, **illustration correction** and **conditional cost idea**. Patents establish that an architecture was disclosed. They do not establish production adoption, freedom to operate or validity of this original geometry. Manufacturer product pages establish offered capabilities, not a validated bill of materials for this model. All proposed savings remain qualitative hypotheses.

## Review and proposed public copy

### 1. Housing

**Documented technique:** injection moulding uses controlled wall thickness, draft for release and cored bosses. Thick intersections can cause sink and voids. Ribs can stiffen a wall without making the whole wall thick. [Protolabs, Injection Molding Guide, design and bosses sections](https://www.protolabs.com/resources/guides-and-trend-reports/injection-molding-guide-process-design-tips-materials/).

**Illustration correction:** give the shell visible inner and outer walls and an open glass aperture. Connect ribs and hollow screw bosses to real mounting areas. Avoid a broad solid internal plate that masks the interior. Draw release and gate positions remain unvalidated. **Conditional cost idea:** moulded colour can remove painting when appearance and weathering requirements permit it. A reachable primary manufacturer page explicitly identifies UV-stabilised ASA for unpainted mirror components. [INEOS Styrolution, Exterior, Rear view mirrors section](https://www.ineos.com/businesses/ineos-styrolution/industries/automotive/exterior/). A separate resin manufacturer describes colourants, moulding and unpainted weatherable mirror housings. [Polymer Resources, PC/ASA Resin, additives and application questions](https://prlresins.com/products/pc-asa-resin/). Together these support the process option, not every colour or resin replacing every painted finish. Both pages were successfully opened during this review.

**Suggested caption:** “A hollow moulded shell protects the mechanism. Ribs and screw posts support the parts inside. Moulded colour can avoid painting when the finish allows it.”

### 2. Cover cap

**Documented technique:** moulded snap features can join covers, but a retaining hook is an undercut and needs an appropriate tool opening or mould action. [Protolabs, Designing Complex Injection Molding Features, clips and snap fits](https://www.protolabs.com/resources/design-tips/5-ways-to-master-complex-features-in-injection-molded-parts/).

**Illustration correction:** show flexible hook tabs, matching catches and an accessible release path, rather than solid blocks with no engagement. Check cap clearance against the housing. **Conditional cost idea:** clips can remove cover screws, subject to retention, fatigue and repair requirements.

**Suggested caption:** “Clips can hold the cover without separate screws. Give them a release point so the cover can be removed for repair. Use moulded colour where the finish allows it.”

### 3. Mirror glass and carrier

**Documented technique:** glass can be bonded to a backing plate that attaches to an adjuster. That plate may be flat or curved and may be open or ribbed. [Exterior mirror assembly process, US20120033314A1, backing plate definition and assembly description](https://patents.google.com/patent/US20120033314A1/en).

**Illustration correction:** add the omitted moulded carrier within the existing glass group, preserving the identity contract. Keep the heater between glass and carrier. Leave tilt clearance at the rim. The flat illustrative plate does not establish field of view. **Conditional cost idea:** sharing an outline is possible only if field of view, curvature, edge safety, packaging and applicable market requirements agree. US test procedures distinguish unit magnification and convex mirrors and test curvature and mounting stability. An identical outline does not mean identical optical specification. [NHTSA, FMVSS 111 laboratory test procedure, rearview mirror requirements and convex mirror tests](https://www.nhtsa.gov/sites/nhtsa.gov/files/documents/tp-111-v01-final_tag.pdf). This is a historical test procedure, not a claim of current worldwide compliance.

**Suggested caption:** “A plastic carrier holds the glass on the adjuster. Share the outline only where the required view and glass curvature match.”

### 4. Heater pad

**Documented technique:** thin etched foil heaters are used behind exterior mirror glass. Heating power is selected around permitted glass temperature. Printed films are another possible technology, so the current printed-film label should not imply that it is the only production route. [Backer HTI, automotive mirror heater offering](https://www.backerhti.com/industry-sectors/automotive), [automotive heating brochure, rear-view mirror section](https://www.backerhti.com/download/18.38bad3eb169a92599272ca/1554279084452/Automotive.pdf).

**Illustration correction:** disconnected stripes with one terminal do not depict a complete electrical heater. Show two terminals joined through a continuous resistive meander, or a properly busbar-fed resistive area. Keep it thin and bonded behind glass. **Conditional cost idea:** a common outline needs thermal coverage, voltage, resistance, temperature and adhesive validation, not outline matching alone.

**Suggested caption:** “A thin electrical heater warms the back of the glass. Share its shape only when heat coverage and power needs match.”

### 5. Glass adjuster

**Documented technique:** a disclosed mirror mechanism uses two motors, transmission and spindles to tilt the plate about a ball joint on two axes. [EP1128986B1, paragraph 0020](https://patentimages.storage.googleapis.com/ec/c5/cc/3e71ca608622be/EP1128986B1.pdf). Current manufacturers offer separate glass and power-fold actuator families. [Motion Controls, side-view mirror products](https://www.motioncontrols.com/products).

**Illustration correction:** retain a compact enclosed module, but make the carrier coupling, housing mounts and two-axis motion understandable. Internal working gears need not all be visible. **Conditional cost idea:** reuse depends on glass mass, tilt range, vibration stability, torque, noise and electrical interface. A manual version is a different architecture, not an interchangeable motor omission.

**Suggested caption:** “Two small geared drives tilt the glass. Reuse an adjuster when its travel, strength and mountings suit the design.”

### 6. Base and bracket

**Documented technique:** high stiffness reinforced thermoplastics are offered specifically to replace metal exterior mirror bases or brackets. The reachable regional manufacturer page explicitly names mirror brackets, shells and bases, and PBT/polyamide metal replacement. [BASF, Exterior Automotive Applications, Mirror parts section](https://plastics-rubber.basf.com/southamerica/en/performance_polymers/industries/pp_automotive/applications/application_exterior). Independent of that material offering, an award organiser records an actual cast aluminium to glass-reinforced polyamide mirror bracket conversion and the need for material choice, rib optimisation and mirror displacement analysis. Its project-specific savings must not be transferred to this exhibit. [Society of Plastics Engineers, 2021 Innovation Awards, printed page 11, Lightweight Structural Mirror Housing Bracket](https://speautomotive.com/wp-content/uploads/2021/11/IAGGuide21_Winners.pdf). Both sources were successfully opened. The previously cited Asia-Pacific page returned 404 and is superseded here.

**Illustration correction:** distinguish exterior base trim from the structural bracket within the same group. Show ribs, attachment holes and a clear connection to the adjuster. **Conditional cost idea:** metal replacement requires stiffness, creep, temperature, moisture, fatigue and vibration validation. Inserts or metal reinforcement may still be needed. Corrosion resistance of the polymer does not remove corrosion concerns from metal inserts and fasteners.

**Suggested caption:** “The bracket carries the mirror loads into the door. Reinforced plastic can replace metal when stiffness and long-term strength are proven.”

### 7. Door gasket

**Documented technique:** an elastomer seal needs a designed squeeze between mating surfaces. Material, geometry and compression must be matched. [Parker, Edge-Bonded Gasket Sealing Technology, compression ratio](https://discover.parker.com/edge-bonded-integral-seal-technology). Compression set reduces the ability to recover after loading. [Parker O-Ring Handbook, section 2.4.11](https://www.parker.com/content/dam/Parker-com/Literature/O-Ring-Division-Literature/ORD-5700.pdf).

**Illustration correction:** show a thin shaped sealing flange with mounting and harness openings. A solid rectangular rubber block is misleading. **Conditional cost idea:** clips may locate a gasket but do not inherently provide structural retention or stable sealing compression. Remove the claim that snapping together the base, gasket and cover removes assembly screws.

**Suggested caption:** “A soft gasket seals the base against the door. Control its compression so it seals without being crushed.”

### 8. Wiring and connector

**Documented technique:** common connectors can support variants with unused positions, but unused cavities in a sealed connector need matching cavity plugs. [TE Connectivity, connector cavity plug product and optional circuit guidance](https://www.te.com/en/product-CAT-J58-NCP.html). LIN is used for body functions including mirrors. [NXP, Local Interconnect Network explanation](https://community.nxp.com/t5/NXP-Tech-Blog/101-Local-Interconnect-Network-LIN/bc-p/1743973). Mirror controllers combine logic, interfaces and motor drivers. [Elmos, Mirror Control description and features](https://www.elmos.live/english/application/automotive/body-convenience/comfort/mirror-control.html?cHash=8a86ab7f08e210c49c7041fc70b34726&tx_pmproducts_listbyapplication%5Baction%5D=showProduct&tx_pmproducts_listbyapplication%5Bcontroller%5D=Product&tx_pmproducts_listbyapplication%5Bproduct%5D=109).

**Illustration correction:** route branches to the actual loads, retain strain relief and allow movement at the fold and glass adjuster. Optional branches are omitted wires, not loose open ends. **Conditional cost idea:** network control can reduce some point-to-point signal wires but adds electronics and still needs power, ground and load wiring. Neither CAN nor LIN is a free wire-count reduction. Camera video also needs its defined interface.

**Suggested caption:** “Use one connector family across the range. Leave out wires for absent options and seal unused connector positions. Shared control electronics may reduce wiring on richer versions.”

### 9. Screws and clips

**Documented technique:** disclosed mirror modules use removable fasteners or clips for service, while welded or bonded enclosures are replaced as units. [US6416208B2, description of module 416 and housing portions 442 and 444](https://patents.google.com/patent/US6416208B2/en).

**Illustration correction:** align screw shanks, bores and seating faces. Show reachable tool access and cover catch release. **Conditional cost idea:** standardising screw types can simplify assembly. Removing every screw can harm repairability or load retention. This exhibit does not validate joint torque or pull-out strength.

**Suggested caption:** “Use clips for removable covers and screws for loaded joints. Keep repair points reachable and use fewer screw types where possible.”

### 10. Power-fold motor

**Documented technique:** disclosed fold modules combine a motor and reduction gearing with a pivot post, holding surfaces and resilient elements. [WO2022226525A1, paragraphs 0051 to 0054](https://patents.google.com/patent/WO2022226525A1/en). Another disclosed design provides a clutch for manual override. [US6929372B2, claims 1 to 8](https://patents.google.com/patent/US6929372B2/en).

**Illustration correction:** align the hinge with a roughly upright folding axis at the base, not the glass normal. Show the motor/gearcase connected to that pivot. Low still needs a supporting pivot or fixed mount when the optional motor is absent. **Conditional cost idea:** replaceability is an intentional service design choice. It requires access, detachable wiring and spare-module availability.

**Suggested caption:** “A geared motor folds the mirror around its base pivot. A removable module can make repair easier if its screws and plug stay accessible.”

### 11. Turn-signal lamp

**Documented technique:** mirror signals use a lens, light guide, LEDs and PCB. A disclosed conventional design joins the lens perimeter to its housing. [US20220348133A1, background and Figures 1 to 3](https://patents.google.com/patent/US20220348133A1/en).

**Illustration correction:** show an enclosed rear body, lens edge and connector rather than an isolated glowing bar. **Conditional cost idea:** shared modules require matching mounting space, optical visibility and performance. A common lamp is not automatically suitable for both sides or every exterior contour. The optional omission is this product contract, not a claim about legal lighting requirements for a real vehicle.

**Suggested caption:** “A sealed LED module provides the turn signal. Share it only where the mounting space and required light pattern match.”

### 12. Puddle lamp

**Documented technique:** a disclosed exterior light module uses protected electronics and downward ground illumination. [US11970115B2, illumination module and puddle lamp descriptions](https://patents.google.com/patent/US11970115B2/en). A separate puddle module disclosure explicitly has a housing, light source and protective lens. [KR20140003892U, abstract](https://patents.google.com/patent/KR20140003892U/en).

**Illustration correction:** lens faces downward, with a sealed module, plug and actual opening. **Conditional cost idea:** a common pocket can support a lamp or a blank only if the blank seals and the reserved volume is acceptable on the basic version.

**Suggested caption:** “This sealed lamp lights the ground below the door. A shared pocket can take the lamp or a sealed blank.”

### 13. Blind-spot indicator

**Documented technique:** a vehicle detection system drives a warning sign in the mirror. The cited system uses sensors outside the mirror, including rear bumper corner radar. The indicator is not the detector. [Bosch, Blind Spot Detection, operation principle](https://www.bosch-mobility.com/en/solutions/assistance-systems/blind-spot-detection/). A disclosed indicator uses an illumination module visible through a suitable region of the mirror or on a driver-visible housing wall. [US10391932B2, Figure 2 description](https://patents.google.com/patent/US10391932B2/en).

**Illustration correction:** place a small LED/light-guide module behind its display area. Do not imply that an opaque metal coating transmits the warning icon without an appropriate optical window. **Conditional cost idea:** sharing the mount also requires compatibility with glass coating, brightness, viewing angle and wiring.

**Suggested caption:** “This light shows a warning from the vehicle's detection system. A shared mounting space can make the indicator easier to add.”

### 14. Side camera

**Documented technique:** automotive camera construction includes a lens barrel, image sensor, enclosure and watertight interfaces. [US8792003B2, related art and camera device construction](https://patents.google.com/patent/US8792003B2/en). Near-range cameras have wide-angle optics and defined viewing fields. [Bosch, Near-Range Camera, characteristics](https://www.bosch-mobility.com/en/solutions/camera/near-range-camera/). Surround-view systems combine cameras and processing with a calibration process. [Continental, surround-view system product information](https://continental-automotive.scene7.com/is/content/ContiAutomotiveProd/Continental-ProViu-2ndGen_-Productinformationpdf?cdh=attachment).

**Illustration correction:** expose the lens to the intended downward/outward view with no shell blocking it. Show a sealed barrel/body joint and repeatable mounting datums. **Conditional cost idea:** a common pocket and blank save unique tool changes only if field of view, sealing, connector, vibration and calibration needs are satisfied. Do not promise that swapping a camera needs no calibration.

**Suggested caption:** “A sealed wide-angle camera views the area beside the car. Share its mounting pocket only when the view, sealing and calibration needs match.”

### 15. Auto-dimming glass

**Documented technique:** an electrochromic mirror contains electrically active layers, conductive coatings and a sealed construction. Disclosed variants include an electrochromic film and one glass substrate, or a film between two glass substrates. [US9669764B2, Figures 3 and 4 descriptions](https://patents.google.com/patent/US9669764B2/en).

**Illustration correction:** keep `autoDim` as a High state of the existing glass, per contract. Explain that its tint is a visual shorthand for a different optical/electrical stack. Change the material label from “Glass surface option” to “Electrochromic glass assembly”. **Conditional cost idea:** reusing the outline or mounting interface does not make the High element identical in thickness, wiring, seals, coatings or manufacture.

**Suggested caption:** “An electrical layer darkens the glass to reduce glare. Keep this as an option. The outline may be shared, but its layers, seals and wiring differ.”

## Geometry priorities and evidence limits

1. Make the interior legible with a proper shell wall, connected ribs, hollow bosses and a structural bracket. Use those features to explain attachment, not to imply that mould flow or tool release has been checked.
2. Add the glass carrier within the glass group and make the heater circuit visibly complete.
3. Match screws to bores, clips to catches, and modules to real apertures. Give omitted options sealed blanks. Route wiring to loads and through the base with room for motion.
4. Give the fold mechanism a credible pivot and the camera an exposed optical path. Keep the optional lamp modules enclosed.
5. Preserve 14 selectable geometry groups plus the auto-dimming state. The user can inspect subcomponents without creating new logical identities.

These are engineering inferences from the cited architectures and the inspected starting source. The showcase remains an original illustrative model. It has no manufacturing dimensions, specified resin grade, mould design, tolerance analysis, heat map, structural simulation, optical ray trace, photometric test, environmental test or physical build. No claim of producibility, regulation compliance or measured cost reduction is established by this review.

## Follow-up source audit of the revised procedural geometry

Reviewed the working `scripts/model.mjs` after the introduction of `hollowShell`, cored bosses, ribs, glass carrier, two-terminal heater, internal bracket, perforated gasket and upright fold spindle. This is a source inspection at an intermediate working state, not browser measurement or approval of the final regenerated asset. The changes represent the documented architectures more clearly. They do not establish validated DFM.

Priorities communicated to implementation:

1. **Bracket seating:** at the inspected state, bracket holes of radius 0.09 surround posts of maximum radius 0.086. The bracket sits behind the post tips. Without a shoulder or separate seat it reads as passing around the posts rather than being clamped to them. Add understandable supporting faces or explicitly retain this as a simplified attachment. Source: inspected `mounts`, `screwBoss` and `structuralCarrierBracket` definitions. The cited mirror assembly evidence above supports the need for a coherent structural attachment, not these dimensions.
2. **Bonded optical stack:** the carrier, film and glass have illustrative gaps. Do not claim those coordinates depict adhesive thickness or a thermally validated bond. A film with a closed current path and two terminals improves explanation but does not establish resistance, heat distribution or safe power. Source: inspected `glassCarrier`, `heaterFilm` and `heaterResistivePath`, compared with the heater and backing-plate evidence above.
3. **Seal and door clamping:** holes in the gasket are useful but do not show compression stops, mounting studs or an applied clamp load. Say that compression must be controlled, not that the mesh proves it seals. The same applies to option blanks and camera or lamp perimeter seals. Source: inspected `doorSeal` and option blanks, and the Parker guidance above.
4. **Nested shells and ports:** the cap and housing bowls overlap over substantial depth. Check their assembled cross-section visually so two skins do not imply impossible nesting. `hollowShell` creates an illustrative offset from vertex normals and removes triangles by their centroids to create ports. It is not a constant-wall CAD offset, a clean machined tool boundary or proof of tool release. Source: inspected `hollowShell` implementation. The Protolabs guidance above still requires wall, draft and release review.
5. **Tooling details and mechanism limits:** the outer post taper does not provide bore draft, root radii, gate, ejector or parting-line design. Upright pivot geometry does not prove a bearing, detent, clutch or wiring motion envelope. Keep the public wording at representative construction and conditional design ideas. Source: inspected boss and fold definitions, compared with the manufacturing and fold disclosures cited above.

These findings are geometric and explanatory checks. Any subsequent correction should be verified in the built assembly and exploded workflow. No physical prototype, production tool, environmental qualification or hardware validation was performed in this research task.

## Final bounded manufacturing review

Read the revised `scripts/model.mjs`, `src/parts.ts`, `src/evidence.ts`, `src/main.ts` and `tests/geometry.test.ts` on 12 November 2026. Public source publication does not add manufacturing validation. This review used original procedural geometry, public source references and paraphrased findings. It includes no copied supplier geometry, paid teardown data or confidential information.

The revised part cards separate function, cost proposal, engineering checks and evidence. All 15 insights are qualitatively consistent with the documented techniques when read with those limits. There are no numerical cost promises, vehicle/supplier names or glass-maker names in the displayed part descriptions, proposals, checks or evidence labels. The external reference URLs identify their public publishers, which is necessary for attribution. Manufacturer names in this research document identify sources rather than endorse a product or promise savings. The visible copy inspected uses short English sentences without em dashes or semicolons.

The post-tip bracket seats, smaller bores and risers address the earlier floating-bracket concern. The added door flange and studs clarify gasket location. The upper cosmetic cap replaces the earlier interpretation of a second full bowl. Glass carrier, complete heater path, camera sealing cue and option blanks remain representative construction. Flat glass, layer spacing, absent internal gears, seal compression, structural tests and camera calibration are explicitly identified as limitations in the cards. Those stated limitations are not blockers for an illustrative showcase.

Concrete issues reported to implementation at this inspection:

- **Geometry correction needed:** a whole-assembly ray from `(0.12, -0.61, 1)` toward negative Z reached the glass at Z approximately `0.2824` before the signal lens at Z approximately `0.239`. The signal centre is hidden behind the optical stack. This is physical occlusion, not merely untested light distribution. Place the lamp on an exposed exterior surface or below the glass and carrier, then repeat a whole-assembly visibility check. Camera, puddle and warning-window sample rays had exposed optical faces. Unfitted blanks were not interpreted as active modules in this finding.
- **Evidence precision:** the card reference for the carrier claims a heater between glass and plate but points to US20120033314A1. That source clearly establishes backing plate and adjuster attachment. Use [US11691567B2](https://patents.google.com/patent/US11691567B2/en) for the precise heater sandwich claim, or narrow the reference description.
- **Minor copy precision:** the cap is an upper cosmetic cover, so “closes the back” is broader than the geometry. Prefer “The upper cover gives the mirror its outer finish.” Camera alignment is a sensible check, but the camera card would benefit from the [surround-view calibration source](https://continental-automotive.scene7.com/is/content/ContiAutomotiveProd/Continental-ProViu-2ndGen_-Productinformationpdf?cdh=attachment) already documented above.
- **Verification boundary:** the camera geometry test raycasts only the camera group. It proves that the lens leads its own module, not that the housing and other groups leave the optical path clear. The manufacturing review separately sampled the full assembly. Tests for finite normals, sample wall thickness, rooted posts and heater endpoints establish illustration properties, not watertight CAD, resin-specific draft, optical compliance or thermal safety.

No runtime behavior defect was established by the bounded source review. Level rules, inactive-option selection, lazy import and details with evidence remain consistent with the standalone contract in the inspected files. Browser and hardware coverage must be reported by the implementation verification workflow, not inferred from this research review. Later fixes to the issues above supersede these revision-specific findings and require their own verification.

## Implemented corrections after the final review

The intermediate findings above are preserved as an audit trail. In the completed source, the upper cosmetic cap no longer claims to close the entire back. The carrier evidence points to US11691567B2, and camera setup has a separate system reference. The signal lens now faces outward through a side opening instead of sitting behind the glass. Whole-assembly raycasts confirm that the signal and downward camera lens are exposed along their representative viewing directions. These checks establish visible clearance on this illustration, not a measured field of view or tested light distribution.

Bracket seats now rest on the housing post tips, with separate risers under the adjuster mounting lugs. The door seal has matching flange geometry and representative studs. Public copy continues to require seal-compression, strength and manufacturing checks. The cap is an upper/rear cover, leaving the lower optical ports in the lower housing. None of these corrections converts the mesh to production-ready CAD.
