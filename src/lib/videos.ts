export type OndekVideo = {
  title: string;
  /** Only the two featured UltraFlash videos carry one, same as the source */
  blurb?: string;
  youtubeId?: string;
  vimeoId?: string;
};

/** Every video and title here is taken 1:1 from the published videos page
 *  (ondekvinylworx.com/resources/videos/, scraped 2026-08-03) — nothing is
 *  added or dropped. The two featured UltraFlash videos lead there too. */
export const FEATURED_VIDEOS: OndekVideo[] = [
  {
    title: "The OnDek UltraFlash",
    blurb:
      "The UltraFlash system consists of two primary parts: the 2\" x 2\" coated steel and a tan or grey PVC UltraClip. It solves major problems found with traditional flashing.",
    youtubeId: "JjsHp3Z1ICQ",
  },
  {
    title: "Ultra Flash Installation Demonstration",
    blurb:
      "Watch as we install the Ultra Flash with a high-quality, ultra-clean look.",
    vimeoId: "523945589",
  },
];

export const LIBRARY_VIDEOS: OndekVideo[] = [
  { title: "Will Ice Ruin My Decking?", youtubeId: "iu6wDc4oR70" },
  { title: "What is Vinyl Decking Membrane?", youtubeId: "Y6pn56a1amY" },
  { title: "Vinyl Decking Pet Resistant", youtubeId: "xM6nRLZdhbE" },
  {
    title: "What Maintenance is Required for Vinyl Decking",
    youtubeId: "yAtV1t1b2Ew",
  },
  {
    title: "Where Your Vinyl Decking Will Most Likely Leak?",
    youtubeId: "hRoESgn2sPs",
  },
  {
    title: "Will Vinyl Decking Leak Around the Railing Post?",
    youtubeId: "zQ3jd_3NCuM",
  },
  {
    title: "Won't My Seams Leak with Vinyl Decking?",
    youtubeId: "z_0iX7sdiUI",
  },
  {
    title: "What Kind of Railings Work Best with Vinyl Decking?",
    youtubeId: "BomeF8Y8iTo",
  },
  {
    title: "Can I Use Vinyl Decking if I Have Drains on My Deck?",
    youtubeId: "ZnGnY7UL6II",
  },
  { title: "Does Vinyl Decking Need Slopes?", youtubeId: "CgDg31E85lc" },
  { title: "What Kind of Vinyl Decking Can be Used?", youtubeId: "fCYwPjgcMcg" },
  { title: "Does Vinyl Decking Hold Heat?", youtubeId: "Gnsy-oYTUp4" },
  { title: "How Long Does Vinyl Decking Last?", youtubeId: "MXxvYrX7TQ8" },
  {
    title: "Can Vinyl Decking be Installed on Concrete?",
    youtubeId: "6oMPfIHhADQ",
  },
  { title: "How Does Vinyl Decking Get Installed?", youtubeId: "nlUqxTSV0oU" },
  { title: "What Causes Damage to my Vinyl Deck?", youtubeId: "6HK2sQgA3n8" },
  {
    title: "Can I Install Waterproof Decking Myself?",
    youtubeId: "tZZLlFdNn8s",
  },
  { title: "How Do I Clean my Vinyl Decking?", youtubeId: "Qqrpt-RNLlk" },
  {
    title: "Can You Put Vinyl Decking on Existing Decks?",
    youtubeId: "tf98zWnMl1A",
  },
  {
    title: "Seven Things You Must Know Before Waterproofing a Deck",
    youtubeId: "uijkdsCPnPM",
  },
  {
    title: "Top Mistakes Made by Vinyl Decking Installers",
    youtubeId: "QH_WmNgVgTM",
  },
];

export const VIDEO_COUNT = FEATURED_VIDEOS.length + LIBRARY_VIDEOS.length;

/** Privacy-enhanced embeds: youtube-nocookie, and dnt=1 on Vimeo */
export function videoEmbedSrc(video: OndekVideo): string {
  if (video.youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`;
  }
  return `https://player.vimeo.com/video/${video.vimeoId}?autoplay=1&dnt=1`;
}

/** YouTube publishes static thumbnails; Vimeo doesn't without an API call,
 *  so Vimeo cards fall back to a dark tile */
export function videoThumb(video: OndekVideo): string | null {
  return video.youtubeId
    ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
    : null;
}
