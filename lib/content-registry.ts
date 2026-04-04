export type ContentType = "text" | "image" | "video";

export type ContentEntry = {
  element_id: string;
  label: string;
  content_type: ContentType;
  default_value: string;
};

export const CONTENT_REGISTRY: ContentEntry[] = [
  {
    element_id: "hero.eyebrow",
    label: "Hero — eyebrow (small line)",
    content_type: "text",
    default_value: "Retreat",
  },
  {
    element_id: "hero.date",
    label: "Hero — date / location line",
    content_type: "text",
    default_value: "2026 · Sevara",
  },
  {
    element_id: "hero.title",
    label: "Hero — main title",
    content_type: "text",
    default_value: "SEVARA RETREAT",
  },
  {
    element_id: "hero.subtitle",
    label: "Hero — subtitle",
    content_type: "text",
    default_value:
      "Your start into a slower rhythm: movement, stillness, and nourishing space — in an intimate retreat for a small circle of guests.",
  },
  {
    element_id: "hero.video",
    label: "Hero — background video URL",
    content_type: "video",
    default_value: "",
  },
  {
    element_id: "hero.poster",
    label: "Hero — video poster image URL",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "intro.body",
    label: "Lead — first paragraph (full width)",
    content_type: "text",
    default_value:
      "Learn to land in your body again, build rituals that hold you, and leave with a quiet confidence — in a retreat designed for depth, not noise.",
  },
  {
    element_id: "quote.title",
    label: "Emphasis band — title",
    content_type: "text",
    default_value: "Why now?",
  },
  {
    element_id: "quote.body",
    label: "Emphasis band — body",
    content_type: "text",
    default_value:
      "Wellness is no longer a trend — it is a requirement. What worked as a quick fix does not hold in 2026. Sevara is where you trade hustle for clarity: authentic rest, honest conversation, and practices you can take home.",
  },
  {
    element_id: "included.title",
    label: "Included — section title",
    content_type: "text",
    default_value: "WHAT'S INCLUDED",
  },
  {
    element_id: "included.body",
    label: "Included — list (one item per line)",
    content_type: "text",
    default_value:
      "Five nights in our retreat house\nFull board: breakfast, lunch, dinner\nDaily movement & breath sessions\nWorkshops on nervous system & boundaries\n1:1 coaching touchpoints\nEvening circles & integration\nProfessional photo moments\nWellness kit & journal\nAccess to gardens & quiet spaces",
  },
  {
    element_id: "narrative.title",
    label: "Editorial — title",
    content_type: "text",
    default_value: "WHY GUESTS CHOOSE SEVARA",
  },
  {
    element_id: "narrative.body",
    label: "Editorial — body",
    content_type: "text",
    default_value:
      "Many of us know we need rest — but not how to begin. Sevara removes the noise: you are held in structure gentle enough to soften. You are not here to perform; you are here to return. Over five days we combine embodiment, honest dialogue, and space to integrate — so you fly home with more than photos: you leave with a felt sense of what comes next.",
  },
  {
    element_id: "retreat.image",
    label: "Editorial — side image",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "bridge.title",
    label: "Bridge band — title",
    content_type: "text",
    default_value: "THE SETTING",
  },
  {
    element_id: "bridge.body",
    label: "Bridge band — body",
    content_type: "text",
    default_value:
      "Light-filled rooms, linen, and unhurried mornings. The house is designed as a container: soft edges, honest materials, and room to breathe.",
  },
  {
    element_id: "accommodation.title",
    label: "Gallery — title",
    content_type: "text",
    default_value: "MALLORCA · THE HOUSE",
  },
  {
    element_id: "accommodation.body",
    label: "Gallery — intro",
    content_type: "text",
    default_value:
      "Indoor and outdoor spaces for stillness, conversation, and golden-hour light — your backdrop for the week.",
  },
  {
    element_id: "accommodation.bento_1",
    label: "Gallery — image 1",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "accommodation.bento_2",
    label: "Gallery — image 2",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "accommodation.bento_3",
    label: "Gallery — image 3",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "extras.title",
    label: "Takeaways — title",
    content_type: "text",
    default_value: "WHAT YOU TAKE HOME",
  },
  {
    element_id: "extras.body",
    label: "Takeaways — intro",
    content_type: "text",
    default_value:
      "Tangible rituals, nervous-system tools, and content you can reuse — plus the feeling: I know what I am doing now.",
  },
  {
    element_id: "extras.bento_1",
    label: "Takeaways — tile image 1",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "extras.bento_2",
    label: "Takeaways — tile image 2",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "extras.bento_3",
    label: "Takeaways — tile image 3",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "extras.bento_4",
    label: "Takeaways — tile image 4",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "outcome.1.title",
    label: "Outcome 1 — title",
    content_type: "text",
    default_value: "Nervous system clarity",
  },
  {
    element_id: "outcome.1.body",
    label: "Outcome 1 — body",
    content_type: "text",
    default_value:
      "Practices you can repeat at home — breath, movement, and boundaries that fit real life.",
  },
  {
    element_id: "outcome.2.title",
    label: "Outcome 2 — title",
    content_type: "text",
    default_value: "Portfolio of presence",
  },
  {
    element_id: "outcome.2.body",
    label: "Outcome 2 — body",
    content_type: "text",
    default_value:
      "Photos and notes that document your week — proof of the shift, not just the trip.",
  },
  {
    element_id: "outcome.3.title",
    label: "Outcome 3 — title",
    content_type: "text",
    default_value: "Integration plan",
  },
  {
    element_id: "outcome.3.body",
    label: "Outcome 3 — body",
    content_type: "text",
    default_value:
      "A simple roadmap for the first 30 days after you land — so the retreat continues.",
  },
  {
    element_id: "hosts.title",
    label: "Hosts — title",
    content_type: "text",
    default_value: "WHO WE ARE",
  },
  {
    element_id: "hosts.body",
    label: "Hosts — body",
    content_type: "text",
    default_value:
      "We are facilitators, hosts, and practitioners — coming from embodied work and honest conversation. Sevara is not about performance: it is about quality, clarity, and care. Our goal is not volume — it is that you leave bookable to yourself: confident, rested, and ready.",
  },
  {
    element_id: "booking.title",
    label: "Booking — title",
    content_type: "text",
    default_value: "BOOKING",
  },
  {
    element_id: "booking.body",
    label: "Booking — body",
    content_type: "text",
    default_value:
      "Small groups only — each guest receives individual attention. Request your spot; we reply with next steps.",
  },
  {
    element_id: "booking.cta",
    label: "Booking — button",
    content_type: "text",
    default_value: "COUNT ME IN",
  },
  {
    element_id: "closing.line",
    label: "Closing — line above footer",
    content_type: "text",
    default_value: "SEE YOU THERE",
  },
  {
    element_id: "footer.tagline",
    label: "Footer — tagline",
    content_type: "text",
    default_value: "Sevara Retreat",
  },
  {
    element_id: "footer.email",
    label: "Footer — email",
    content_type: "text",
    default_value: "hello@sevara-retreat.com",
  },
];

export function defaultContentMap(): Record<string, string> {
  return Object.fromEntries(
    CONTENT_REGISTRY.map((e) => [e.element_id, e.default_value])
  );
}
