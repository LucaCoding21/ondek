/**
 * Post bodies, brought over from the articles published on
 * ondekvinylworx.com and kept close to the source. Editorial changes are
 * limited to: em dashes replaced (the site sets none), the trailing
 * "visit us / leave a comment" sign-offs dropped, and the phone and email
 * left to the contact page rather than repeated mid-article.
 */
export type PostBlock =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

export const POST_BODIES: Record<string, PostBlock[]> = {
  "how-to-clean-and-maintain-a-vinyl-deck": [
    {
      kind: "p",
      text: "A vinyl decking membrane is about as low maintenance as outdoor surfaces get. A few minutes each season and one walkaround a year is the whole routine.",
    },
    { kind: "h2", text: "Annual vinyl deck inspection" },
    {
      kind: "p",
      text: "Once a year, ideally in the spring before you start using the deck again, do a quick walkthrough and check two things.",
    },
    {
      kind: "p",
      text: "First, look at every spot where sealant was applied. That includes anywhere the vinyl decking membrane meets the building, posts, columns, vents, or drains. These areas expand and contract with the seasons, and over time the sealant can crack and break the seal. If you spot cracking, get it re-sealed before water finds its way underneath.",
    },
    {
      kind: "p",
      text: "Second, check the seams. It is not common for seams to open up, especially if your deck was installed using a proper heat-welded seam system, but it is worth confirming once a year. If you catch a problem early, the repair is simple. If you let it go, water gets in and that is when real damage starts.",
    },
    { kind: "h2", text: "How to clean your vinyl deck" },
    {
      kind: "p",
      text: "Your vinyl deck should be cleaned at least three to four times per year. If you live in an area with heavy pollen, tree debris, or acid rain, do it more often.",
    },
    {
      kind: "p",
      text: "The process is straightforward. Start by mixing warm water with a mild dish soap in a bucket. Then use a stiff broom or soft brush on a stick to scrub the surface in circular motions, which loosens dirt from the textured surface of the membrane. Once you have scrubbed the whole deck, rinse it down with a standard garden hose. That is it. No special cleaners needed for routine cleaning.",
    },
    {
      kind: "p",
      text: "If you want to use a pressure washer, keep the setting at 1000 PSI maximum and hold the nozzle at least 12 inches from the surface. Stay away from seams, railing attachments, and any caulked areas. After pressure washing, do a visual check of the membrane to make sure nothing was disturbed.",
    },
    { kind: "h2", text: "How to remove tough stains" },
    {
      kind: "p",
      text: "Different stains need different treatments. Here is what works for the most common ones.",
    },
    {
      kind: "ul",
      items: [
        "Food and drink stains (ketchup, coffee, tea): start with diluted soapy water and a soft brush. If that does not work, try a spray cleaner such as Fantastik or diluted Cascade powdered dishwasher detergent. Leave it on for a few minutes only, then rinse thoroughly and dry.",
        "Grease, tar, and motor oil: scrape or wipe off the excess first, then use Fantastik or diluted Cascade. Rinse and dry. For stubborn residue, follow the cleaning agent manufacturer's instructions.",
        "Mildew and wet leaf stains: mix one tablespoon of vinegar with one quart of water. Apply, rinse, and dry. Follow up with soapy water if needed.",
        "Latex paint: clean with diluted soapy water first, then Fantastik or Cascade if needed.",
        "Rust: apply Naval Jelly directly to the stain, rinse with water, and dry.",
      ],
    },
    {
      kind: "p",
      text: "Always test your cleaning method on a small, hidden area of the vinyl deck first, and never clean in direct hot sunlight. Never use undiluted bleach, acetone, turpentine, or lacquer thinner on your vinyl deck membrane. These will strip the print, UV inhibitors, and protective topcoat right off the surface.",
    },
    { kind: "h2", text: "What to avoid" },
    {
      kind: "ul",
      items: [
        "Rubber-backed mats are not compatible with PVC. Use non-rubber backed mats at doorways and high-traffic areas instead.",
        "Dragging heavy furniture can scuff or tear the membrane. Always lift, do not drag.",
        "Suntan lotion and permanent markers contain dyes that can cause permanent staining on vinyl. Clean any spills immediately.",
        "Harsh chemicals such as powdered abrasives, steel wool, industrial cleaners, and undiluted bleach will damage the protective coating.",
      ],
    },
    { kind: "h2", text: "Winter care" },
    {
      kind: "p",
      text: "Vinyl deck membranes are engineered to handle harsh winters. Snow removal is fine with a plastic-edged shovel. Avoid metal shovels that could gouge the surface.",
    },
    {
      kind: "p",
      text: "Be careful with de-icing products like rock salt, kitty litter, or chemical snow melters. Not all of these have been tested on PVC membranes, and some can cause premature fading or discolouration. If you do use them, clean the deck thoroughly with soap and water before the spring sun arrives. Warm sunlight can bake leftover chemical residue into the vinyl, causing permanent marks.",
    },
    { kind: "h2", text: "Keeping it looking its best" },
    {
      kind: "p",
      text: "The beauty of a vinyl decking membrane is that it gives you a waterproof, durable deck surface without the constant upkeep that wood demands. A few minutes of cleaning each season and a quick annual inspection is all it takes to keep your deck in top shape for years.",
    },
  ],

  "ultra-edge": [
    {
      kind: "p",
      text: "A screw-free edge system engineered for long-term performance, and the part of the deck where most surfaces start to fail.",
    },
    { kind: "h2", text: "What makes Ultra Edge different" },
    {
      kind: "ul",
      items: [
        "Positive, screw-free connection: a secure mechanical connection with no screws needed.",
        "Snap-fit Ultra Clip and Ultra Flashing: the Ultra Clip snaps onto the Ultra Flashing for a clean, lasting fit.",
        "A tidy edge that holds its look season after season.",
      ],
    },
    { kind: "h2", text: "How a typical edge clip compares" },
    {
      kind: "p",
      text: "A conventional edge clip may rely on screws for attachment. Pulling and detachment can occur with seasonal hot and cold weather, and clips can fall off after repeated expansion and contraction.",
    },
    {
      kind: "p",
      text: "Ultra Edge is designed around that movement instead: a positive, screw-free mechanical connection, with the clip snapping onto the flashing so the edge stays secure and clean through the seasons.",
    },
  ],

  "ultra-seam": [
    {
      kind: "p",
      text: "Seam technology engineered for stronger welds and long-term waterproof performance, for the runs where one width of vinyl will not cover the deck.",
    },
    { kind: "h2", text: "What makes Ultra Seam different" },
    {
      kind: "ul",
      items: [
        "Clean selvage edge: no fleece remnants, so no seam contamination.",
        "The backing stops short of the edge of the vinyl, keeping fleece out of the weld.",
        "A watertight seam that welds true vinyl to vinyl, PVC to PVC.",
      ],
    },
    { kind: "h2", text: "How a typical seam compares" },
    {
      kind: "p",
      text: "A conventional seam carries a higher risk of contamination. Fleece remnants can compromise seam integrity, which means less confidence in long-term waterproof performance.",
    },
    { kind: "h2", text: "Seam strength" },
    {
      kind: "p",
      text: "In independent testing, the PVC-to-PVC welded seam proved stronger than the vinyl membrane itself.",
    },
  ],

  "under-deck-living-space": [
    {
      kind: "p",
      text: "Transform your outdoor deck into a multifunctional extension of your home. By waterproofing your deck, you not only protect your investment but also unlock the potential for a vibrant under-deck patio, doubling your home's entertainment space and blending indoor comfort with the beauty of outdoor living.",
    },
    { kind: "h2", text: "Increase your livable space" },
    {
      kind: "p",
      text: "With OnDek, you can expand your home's footprint, using the area beneath your raised deck as a creative outdoor setting ideal for gatherings, offering sheltered comfort from the elements. This newfound space invites the outdoors in, complete with the amenities you love, from entertainment systems and outdoor kitchens to cozy fireplaces.",
    },
    { kind: "h2", text: "Outdoor living regardless of the weather" },
    {
      kind: "p",
      text: "Our waterproofing solutions make for a seamless transition between indoor and outdoor living, making it easier to host and entertain without the constant back-and-forth. Imagine a space where everything you need is already there, protected and ready for use, whatever the weather.",
    },
    { kind: "h2", text: "Use the space year-round" },
    {
      kind: "p",
      text: "With features like integrated lighting, heating options, and versatile dining setups, your under-deck patio becomes a haven of enjoyment, extending your entertaining into the evenings and across all seasons.",
    },
    { kind: "h2", text: "A deck that does more" },
    {
      kind: "p",
      text: "Choose OnDek Vinyl Worx for a deck that goes beyond a traditional outdoor space, offering a blend of style, functionality, and lasting protection, so your outdoor living area becomes a cherished extension of your home.",
    },
  ],

  "become-an-installer": [
    {
      kind: "p",
      text: "While it is possible for homeowners to DIY many projects, a professional installer is necessary for OnDek Vinyl Worx. For professionals who want to offer high-quality vinyl decking to their customers, there is no comparison. So how do you become an installer?",
    },
    { kind: "h2", text: "What we expect from an installer" },
    {
      kind: "p",
      text: "An OnDek installer must be comfortable working on balconies, decks, rooftop decks, and more. Because our vinyl decking requires a specific installation process, it is installed only by authorized, trained installation experts. But it is about more than skill level.",
    },
    {
      kind: "p",
      text: "To become an installer you need both the right skill set and a customer-service-oriented attitude. A commitment to excellence is a must, as you are representing both your business and ours. Integrity and craftsmanship are the expectations.",
    },
    { kind: "h2", text: "Becoming an expert installer" },
    {
      kind: "p",
      text: "Because we work on a strictly professional level, an installer must spend time learning the product itself and how to install it properly. In-depth training equips you with the know-how to install the covering with ease.",
    },
    {
      kind: "p",
      text: "Keep in mind that our training does not replace professional certification in your field. You should be licensed in the state or province in which you work, and procure permits when and where they are needed.",
    },
    { kind: "h2", text: "What the training covers" },
    {
      kind: "p",
      text: "Installers already understand that a vinyl deck covering is permanent, low maintenance, and waterproof. OnDek has specific guidelines for installation based on the product and materials used.",
    },
    {
      kind: "p",
      text: "The membrane adheres to either plywood or concrete substrate. Training covers a successful finished product whether you use our specially formulated solvent-based contact adhesive or a latex option. You will also learn how to use a hot air gun to fuse the vinyl decking sections with a thermal bond, the technique that gives the membrane its waterproof seal.",
    },
    { kind: "h2", text: "Next steps" },
    {
      kind: "p",
      text: "You can attend in-person training at one of our two locations, either Aldergrove, British Columbia, or Wellsville, Ohio. If that is not a viable option, get in touch: online training is available in specific circumstances.",
    },
  ],

  "floors-or-roofing": [
    {
      kind: "p",
      text: "OnDek Vinyl Worx deck membrane is both a flooring material and a roofing material. When you install a deck over your yard, water is a minimal worry. But water leaks become a major concern when you install an elevated deck over your roof or another part of your home. Once water gets under an elevated deck, the house below suffers rot, mold, and discolouration.",
    },
    { kind: "h2", text: "What a vinyl deck membrane is" },
    {
      kind: "p",
      text: "Vinyl deck membranes are made of polyvinyl chloride. They are usually made as rolled stock with a polyester backing to help them stick to a base.",
    },
    {
      kind: "p",
      text: "When more than one sheet is required, installers heat weld a waterproof seam that prevents elevated decks from leaking. The installer overlaps the two rolls by one inch, then uses a waterproof heat weld to connect the two sheets.",
    },
    {
      kind: "p",
      text: "Vinyl decking can be used in place of planks. With a range of standard and customizable designs, the membrane creates a distinctive look that is easy to maintain, ADA-compliant, and eco-friendly. It also protects everything below it.",
    },
    { kind: "h2", text: "Can you use it on a roof?" },
    {
      kind: "p",
      text: "Yes, and especially on flat roofs that are prone to leaking. Before installing a vinyl deck membrane on a roof, speak to a roofing expert to evaluate the product and the roof.",
    },
    {
      kind: "p",
      text: "The alternative is the traditional way of covering a flat roof: tar and gravel, or torch-down systems. With vinyl deck membranes, no open flame is necessary, and the roofing project can be completed in one day depending on the size of the roof.",
    },
    { kind: "h2", text: "Why use it on a roof" },
    {
      kind: "p",
      text: "Using a vinyl deck membrane on a flat roof lets people use that roof as a deck, even if that was not the original intention. The material is weather-resistant and designed to last through temperatures ranging from -40°F to 176°F (-40°C to 80°C). You can even shovel snow off it.",
    },
    {
      kind: "p",
      text: "Vinyl membranes can be installed over various surfaces, and they can last significantly longer than traditional flat-roofing products. As long as you take care of the membrane, you can expect it to last for many years.",
    },
  ],

  "leaks-around-railing-posts": [
    {
      kind: "p",
      text: "Why do some vinyl decking membranes leak around railing posts? Three causes are responsible for almost all leak issues.",
    },
    { kind: "h2", text: "Poor installation" },
    {
      kind: "p",
      text: "The number one cause of leaks in tricky areas like railing posts is an inferior installation. Vinyl decking is a specialized product that requires careful installation by an experienced professional.",
    },
    {
      kind: "p",
      text: "Water will always seek a weak point to intrude through, which means seams, and anywhere the vinyl terminates against non-vinyl material, are vulnerable. Improper flashing along the rail posts will eventually result in leakage, weakening the underlying structure over time. These areas are the most critical in an installation, as they direct water away from the posts and from anywhere the vinyl meets another material.",
    },
    {
      kind: "p",
      text: "With OnDek detailing vinyl, one side of the product has no backing, which allows for complete waterproofing and a seal free of contamination.",
    },
    { kind: "h2", text: "Adhesive failure" },
    {
      kind: "p",
      text: "It is possible for the products used to secure the membrane to fail over its lifespan. Places where the product terminates are always the most likely to experience adhesive failure. If the material is lifting off the surface or bubbling up, that is a tell-tale sign the glue has let go and water has gotten under it. In many cases, problem areas can be re-sealed, which should prevent any further leaks.",
    },
    { kind: "h2", text: "Product damage" },
    {
      kind: "p",
      text: "Beyond expected wear and tear, the product can be damaged by extreme weather or improper maintenance. If the membrane is gouged or torn, water can intrude underneath, where it runs off towards the deck posts. Damaged areas should be repaired to maintain the waterproof integrity of the material.",
    },
    { kind: "h2", text: "How to prevent leaks around posts" },
    {
      kind: "p",
      text: "The best way to prevent leaks on an elevated deck is to use a quality product and have it installed by a qualified decking contractor. As an owner, you can help: examine the deck regularly and note any water damage, try to isolate the source of a leak, and check the seams and endpoints for any area where the bond appears weak. In many cases a small repair early is all it takes to stop it getting worse.",
    },
  ],

  "wheelchair-ramps-and-other-uses": [
    {
      kind: "p",
      text: "Make your wheelchair ramp a lot safer by reinforcing it with a vinyl deck membrane. As these membranes have grown in popularity, we have had many questions about alternative uses, and most of them are about ramps. For a ramp, vinyl decking provides superior anti-slip performance, waterproof protection for the wooden substructure, and remarkable durability.",
    },
    { kind: "h2", text: "Exceeds ADA slip requirements" },
    {
      kind: "p",
      text: "The vinyl membranes used for decks, patios, and other outdoor areas double as the perfect surface for a ramp. All of our membranes far exceed the slip requirements stipulated in the Americans with Disabilities Act, so whether it is sunny, raining, or snowing, you can enter and exit a home or office building with confidence.",
    },
    { kind: "h2", text: "UV stabilizers and inhibitors" },
    {
      kind: "p",
      text: "The vinyl we use contains specialized UV stabilizers and inhibitors, so even a ramp in full desert sun will not succumb to sun damage. We are confident enough in that protection that it comes with a 5 year warranty on appearance.",
    },
    { kind: "h2", text: "Acrylic topcoat" },
    {
      kind: "p",
      text: "Ramps take a beating. While the base materials withstand long-term wear, we added an acrylic topcoat for additional protection, which is also what allows the product to tolerate light commercial use.",
    },
    { kind: "h2", text: "Protects the substructure" },
    {
      kind: "p",
      text: "Vinyl on a ramp protects the wooden substructure below. It blocks the sunlight that would otherwise rot the lumber over time, and it waterproofs the structure. Finding out in real time that a ramp's construction has rotted away is both frustrating and dangerous, which is why the waterproofing carries a 15 year warranty.",
    },
    { kind: "h2", text: "Other uses" },
    {
      kind: "p",
      text: "Our contractors have used the membrane to protect plenty of other things:",
    },
    {
      kind: "ul",
      items: [
        "Dog houses",
        "Outdoor furniture",
        "Planter boxes",
        "Garage floors",
        "Treehouses",
        "Bathrooms",
        "Bleacher seats",
      ],
    },
  ],

  "furniture-damage": [
    { kind: "h2", text: "How the membrane is installed" },
    {
      kind: "p",
      text: "Vinyl for decking becomes the floor of the patio, roof deck, or walkway. Installers use an adhesive to hold the membrane in place, and make waterproof seams by overlapping the material one inch. Using a hot air gun and a silicone roller, the seam is welded and becomes waterproof.",
    },
    { kind: "h2", text: "Living on it" },
    {
      kind: "p",
      text: "Once installed, vinyl decking membranes are easy to maintain. The decking is slip-resistant and meets standards set by the Americans with Disabilities Act, and you can use it as soon as it is installed. Since most decks are for entertaining and outdoor living, people put furniture on them, and they wonder whether that furniture will damage the membrane.",
    },
    {
      kind: "p",
      text: "Like any flooring material, there is a chance that furniture with a sharp edge could damage it. Consider how the membrane stands up to snow shoveling in the winter: there is nothing wrong with shoveling snow off it, as long as the shovel does not have a sharp edge. A too-sharp shovel or abrasive metal could tear the PVC. The same is true of furniture edges.",
    },
    { kind: "h3", text: "Invest in protective furniture pads" },
    {
      kind: "p",
      text: "The best choice is to put glider feet on your furniture. These pads come in a variety of sizes and prevent the feet from scratching or cutting the membrane. You can also look for furniture with rounded feet.",
    },
    {
      kind: "p",
      text: "Since many people eat together on their decks, protectors on the furniture feet let people move chairs in and out from the table easily, and keep the decking in one piece. Feet covers are inexpensive and attach to the bottoms of furniture legs with an adhesive. Some come with stretchy caps that cover the base of the leg with a felt foot on the bottom.",
    },
    { kind: "h3", text: "Do not forget about wheels" },
    {
      kind: "p",
      text: "Another way to protect the membrane is outdoor furniture with wheels. Rollers will not damage the decking, as there is nothing to catch on it. If your furniture does not have castors, you can buy them in bulk and add them to the bottoms of tables and chairs. Castors also let you move furniture around easily. Just be sure they all have locking mechanisms.",
    },
    {
      kind: "p",
      text: "Like the flooring you install inside, taking care of your outdoor flooring will keep the deck, walkway, or patio looking good for many years.",
    },
  ],
};
