/**
 * The generation prompt. Model-agnostic: it describes the two input images
 * positionally ("Image 1", "Image 2"), which every multi-image editing API
 * can satisfy. Change it here and both Custom Mode and the stock-combo
 * script pick it up.
 *
 * v2: the original prompt told the model to lay the pattern along the
 * existing board lines, which produced wood planks re-textured in vinyl.
 * OnDek vinyl is a continuous waterproof membrane installed OVER the deck
 * boards, so the boards and their gaps must disappear entirely.
 *
 * v3: stairs are now explicitly excluded. The prompt never mentioned them,
 * so the model guessed (sometimes treads only, sometimes everything).
 * Real installs leave stairs as wood, and stairs are where the model most
 * often invents geometry, so they stay untouched.
 *
 * v4: woodgrain vinyls joined the lineup, and the v3 wording ("no board
 * lines or plank joints may remain visible") erased their printed planks
 * along with the photo's real boards — Ipe rendered as flat brown carpet.
 * The ban now targets the photo's original floor only, and the swatch's
 * own printed pattern (planks, chevrons, woodgrain, speckle) is called
 * out as something to reproduce.
 *
 * v5: scale. The reference used to be an 800px square crop of the pattern,
 * so the model had no idea how big a plank was and never saw a chevron's
 * full repeat (Ipe rendered as ~12" boards, Boardwalk/Hansberry repeated
 * their spine every crop-width). The reference is now the full roll-width
 * strip, and the prompt says what it is: one roll, 6 feet along the long
 * edge, per the owners. The model can now size the pattern against the
 * deck's own railing and furniture.
 *
 * v6: "6 feet" alone was a coin flip: about half the woodgrain renders
 * still fitted one strip to the whole deck (a single chevron spine across
 * the deck, foot-wide planks). Two more anchors: every design carries its
 * own measured numbers (plank width, spine spacing, how many planks a
 * 12 ft deck shows), spliced in by buildGenerationPrompt(), and the prompt
 * names real-world sizes the model can read off any photo (door width,
 * railing height, lounger length).
 *
 * v6.1: the v6 "small sample, repeated many times" language pulled the
 * membrane onto stair treads and risers (3 of 3 custom renders on a
 * deck with steps), which v3 had stopped. The scale sentence now says
 * "across the deck floor only" and the stairs rule is harder: no
 * membrane on any step, the sheet stops at the top edge of the stairs.
 */
const SCALE_ANCHORS =
  "For scale, use what is in the photo: an exterior door is about 36 inches (0.9 m) wide, a railing is 36 to 42 inches (1 m) tall, a lounge chair is about 6 feet (1.8 m) long. Image 2 is a small sample, not the whole floor: a typical deck floor is two to four roll widths across and shows the pattern repeated many times, across the deck floor only.";

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
export const GENERATION_PROMPT = `Image 1 is a photo of a deck. Image 2 is a section of vinyl decking membrane exactly one roll wide: the long edge of Image 2 is 6 feet (1.8 m) of real membrane, so every plank width, chevron, and speckle in it is shown at true scale. Vinyl decking is a continuous waterproof sheet that gets installed on top of the existing deck floor, completely covering it. Replace ONLY the deck floor surface in Image 1 with a single continuous sheet of the vinyl membrane from Image 2, as it would look after professional installation. The original deck boards, their gaps, seams, and grain must be completely hidden under the new membrane — nothing of the photo's own floor surface may show through anywhere. The new floor reads as one continuous printed sheet carrying the swatch's exact pattern: every plank line, chevron, woodgrain, or speckle on the new floor comes from the swatch's printed design and only from it, reproduced faithfully at its real-world scale. Size the pattern on the deck from that 6 foot reference: judge the deck's real dimensions from its railing, furniture, and doors, and lay the pattern so plank widths and chevron spacing are the same real size they are in Image 2. {SCALE} Continue the pattern across the whole floor the way a roll would: the same repeat at the same scale everywhere, with no enlarged, shrunken, or extra copies of any element. Everything else must stay exactly as it is: railing, house, furniture, plants, sky, shadows, and camera angle. Stairs, steps, stair treads, and stair risers are NOT part of the deck floor and must receive no membrane at all: every step stays exactly as it appears in the photo, its original wood and colour untouched, and the new sheet stops cleanly at the top edge of the stairs. Keep the deck's existing geometry and perspective exactly — the new surface lies on the same floor plane, follows the same vanishing point and angle as the original floor, and ends at the same edges; do not flatten the surface, do not introduce a second vanishing point, and do not extend the deck beyond its current edges. Match the swatch's pattern to its real-world scale, even and consistent, receding naturally with distance. Preserve the original lighting: sunlight, shadows cast onto the deck, and reflections stay in the same places, now falling on the new membrane. Reproduce the swatch's color and printed pattern faithfully. Do not add, remove, or move any objects. Output a photorealistic image that looks like the same photo taken after the vinyl membrane was installed.`;
