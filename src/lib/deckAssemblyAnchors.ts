/**
 * Where each part sits in the frame, per frame, as a fraction of the canvas
 * (0–1 from the top-left). Measured from the rendered frames themselves by
 * classifying pixels by colour and taking each part's centroid, so the
 * annotations point at what is actually on screen rather than at guessed
 * coordinates. Once a part is mostly covered by later parts (the trim under
 * the membrane), the anchor follows the largest still-visible patch of it
 * instead, weighted toward where the anchor already was so it doesn't jump
 * between slivers. Regenerate if the sequence is re-rendered.
 *
 * Indexed [part][frame], in the same order as PARTS in UltraSystem.
 */
export const PART_ANCHORS: [number, number][][] = [
  // Deck substrate
  [[0.477,0.532],[0.477,0.532],[0.476,0.532],[0.476,0.532],[0.476,0.532],[0.475,0.536],[0.471,0.568],[0.473,0.613],[0.477,0.689],[0.504,0.600],[0.524,0.500],[0.541,0.365],[0.536,0.367],[0.533,0.367],[0.539,0.362],[0.547,0.356],[0.558,0.352],[0.560,0.355],[0.562,0.358],[0.572,0.432],[0.593,0.566],[0.611,0.688],[0.611,0.734],[0.599,0.720],[0.587,0.716],[0.576,0.714],[0.564,0.706],[0.548,0.701],[0.535,0.697],[0.526,0.696],[0.526,0.691],[0.533,0.679],[0.536,0.673],[0.524,0.669],[0.506,0.672],[0.492,0.670],[0.492,0.667],[0.504,0.663],[0.517,0.659],[0.530,0.657]],
  // Edge trim — tracks the grey snap-on flange, which slides in from the
  // bottom-left corner at frame 31 (the annotation is hidden before then, so
  // the earlier entries just hold its entry position). Its colour is measured
  // in both states: neutral grey and the yellow snap-fit flash.
  [[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.097,0.879],[0.143,0.833],[0.224,0.756],[0.268,0.715],[0.283,0.699],[0.279,0.694],[0.277,0.693],[0.277,0.694],[0.276,0.695],[0.276,0.696]],
  // Vinyl membrane
  [[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.642,0.187],[0.635,0.198],[0.621,0.221],[0.595,0.255],[0.563,0.291],[0.530,0.321],[0.507,0.341],[0.490,0.358],[0.472,0.380],[0.455,0.407],[0.444,0.423],[0.440,0.426],[0.438,0.423],[0.436,0.420],[0.433,0.418],[0.433,0.409],[0.435,0.400],[0.436,0.390],[0.435,0.373],[0.434,0.372],[0.432,0.372],[0.431,0.385],[0.430,0.386]],
];

/**
 * First frame each part is substantially on screen. Unlike the previous
 * exploded-view render, the parts arrive mid-sequence, so their annotations
 * fade in here rather than pointing at empty canvas. The edge trim is the
 * snap-on flange near the end — not the dark base layer that arrives earlier.
 */
export const PART_APPEARS = [0, 30, 18];
