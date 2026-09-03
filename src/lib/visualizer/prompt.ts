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
 */
export const GENERATION_PROMPT = `Image 1 is a photo of a deck. Image 2 is a swatch of vinyl decking membrane. Vinyl decking is a continuous waterproof sheet that gets installed on top of the existing deck floor, completely covering it. Replace ONLY the deck floor surface in Image 1 with a single continuous sheet of the vinyl membrane from Image 2, as it would look after professional installation. The original deck boards, their gaps, seams, and grain must be completely hidden under the new membrane — no board lines or plank joints may remain visible anywhere on the floor. The new floor reads as one smooth, unbroken surface carrying the swatch's exact color, speckle, and texture. Everything else must stay exactly as it is: railing, house, furniture, plants, sky, shadows, and camera angle. Stairs, steps, and stair risers are NOT part of the deck floor: leave any stairs and their treads and risers exactly as they appear in the photo, unchanged. Keep the deck's existing geometry and perspective exactly — the new surface lies on the same floor plane, follows the same vanishing point and angle as the original floor, and ends at the same edges; do not flatten the surface, do not introduce a second vanishing point, and do not extend the deck beyond its current edges. Match the swatch's texture to its real-world scale, fine and even, receding naturally with distance. Preserve the original lighting: sunlight, shadows cast onto the deck, and reflections stay in the same places, now falling on the new membrane. Reproduce the swatch's color and texture faithfully. Do not add, remove, or move any objects. Output a photorealistic image that looks like the same photo taken after the vinyl membrane was installed.`;
