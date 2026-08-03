/**
 * The edge-profile blueprint, as paths. Coordinates were measured off the
 * original ultra-blueprint.png at its native 1448×1086, so anything drawing
 * these should use that viewBox.
 *
 * Ordered the way you would draw it by hand — silhouette, then the faces, then
 * the membrane wrapping the corner, then the trim last. That order is what
 * makes a staggered trace read as sketching rather than as everything fading
 * up at once, so keep it if you add lines.
 *
 * Shared by the Ultra system section (traces on scroll) and the dealer hero
 * (traces once on load).
 */
export const EDGE_BLUEPRINT_VIEWBOX = "0 0 1448 1086";

export const EDGE_BLUEPRINT_LINES = [
  // Top face, back two edges. Opens with the rounded corner the left face
  // turns through, so the stroke starts where the vertical will pick it up.
  "M 159 341 Q 159 320 180 316 L 831 116 L 1363 313",
  // Right silhouette: the slab's cut end
  "M 1363 313 L 1362 410",
  // Near-left edge of the top face, down to the fold
  "M 178 324 L 738 535",
  // Near-right edge of the top face, down to the same fold
  "M 1363 313 L 738 535",
  // Left silhouette
  "M 159 341 L 159 613",
  // Underside of the cut end
  "M 1362 410 L 860 594",
  // The membrane's own cut edge — runs parallel to the near-right edge a
  // sheet-thickness below it, then turns down the corner as the outer face
  "M 1240 364 L 782 528 C 762 536 755 543 755 556 L 757 949",
  // Inner face of the same wrap, off the fold
  "M 738 535 C 745 540 746 545 745 555 L 745 843",
  // The apron hanging past the deck edge
  "M 860 594 L 859 905 L 757 949",
  // Trim: top edge, then the hook it turns at the far end
  "M 159 613 L 736 831 C 746 838 745 852 737 861 C 732 867 727 869 722 870",
  // Trim: the rounded return at the near end, then its underside
  "M 159 613 C 141 618 136 632 140 645 C 144 657 150 661 162 663 L 723 872",
];
