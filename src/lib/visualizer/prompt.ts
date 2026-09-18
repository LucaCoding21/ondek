/**
 * The generation prompt. Model-agnostic: it describes the two input images
 * positionally ("Image 1", "Image 2"), which every multi-image editing API
 * can satisfy. Change it here and both Custom Mode and the stock-combo
 * script pick it up.
 *
 * History, kept short (the full reasoning lives in git for v2 to v6.2):
 *   v2   the membrane covers the deck boards; it is not laid along them.
 *   v3   stairs get no membrane (real installs leave them as wood).
 *   v4   the "no plank lines" ban targets the photo's floor only, so the
 *        woodgrains keep their printed planks.
 *   v5   the reference is the full roll-width strip, stated as 6 feet.
 *   v6   per-design measured hints ({SCALE}) plus real-world anchors
 *        (door, railing, lounger); v6.1 re-scoped them to the deck floor
 *        after they pulled membrane onto stairs; v6.2 dropped "even and
 *        consistent", which was averaging chevron boards together.
 *   v7   rewritten as a numbered brief at about half the length. Seven
 *        versions of accretion had the scale instruction stated three
 *        times and the colour instruction twice. Benchmarked against v6.2
 *        on the backyard photo (Hansberry, Boardwalk, Ipe, granite, and a
 *        deck with stairs): no difference in scale, structure, stairs, or
 *        speckle, so the shorter one ships. The scale problem itself was
 *        not a prompt problem at all: see Vinyl.renderQuality.
 */

/**
 * Real-world sizes the model can read off almost any deck photo. Kept
 * separate from the template so the design hint slots in before it.
 */
const SCALE_ANCHORS =
  "Read the deck's size from the photo: an exterior door is about 36 inches (0.9 m) wide, a railing is 36 to 42 inches (1 m) tall with its pickets about 4 inches (10 cm) apart, a lounge chair is about 6 feet (1.8 m) long.";

/** The tuned prompt with the design's own measured sizes spliced in */
export function buildGenerationPrompt(scaleHint?: string): string {
  return GENERATION_PROMPT.replace(
    "{SCALE}",
    [scaleHint, SCALE_ANCHORS].filter(Boolean).join(" "),
  );
}

/** Template. Callers should use buildGenerationPrompt(); the bare
 *  template still works as a fallback because {SCALE} sits inside a
 *  sentence that reads fine without it. */
export const GENERATION_PROMPT = `Image 1 is a photo of a deck. Image 2 is a flat sample of printed vinyl decking membrane shown at true scale: its long edge is exactly 6 feet (1.8 m) of real membrane, about the length of a lounge chair or two door widths. It is a small sample; a deck floor is usually two to four sample widths across, so the sample repeats many times over the floor.

Task: show the deck in Image 1 after this membrane has been professionally installed over its floor, and change nothing else.

1. Coverage: the membrane is one continuous waterproof sheet laid over the deck floor. The photo's own boards, gaps and grain vanish completely under it. The sheet ends exactly where the deck floor ends, on the same floor plane, with the same perspective and vanishing point.
2. Pattern: the new floor shows only Image 2's printed design, repeated edge to edge at the same scale everywhere, like wallpaper: the same boards, joints, colours and repeat as in Image 2, every board as distinct from its neighbours as it is there. Do not invent, enlarge, shrink, or blend any element.
3. Scale: lay the pattern at real size. {SCALE}
4. Stairs: steps, treads and risers get no membrane and keep their original wood. The sheet stops cleanly at the top edge of the stairs.
5. Everything else stays exactly as in Image 1: railing, house, furniture, plants, sky, camera angle, and the original sunlight, shadows and reflections, now falling on the new surface.

Output the same photo, photorealistic, after installation.`;
