export type ContentType = "text" | "image" | "video";

export type ContentEntry = {
  element_id: string;
  label: string;
  content_type: ContentType;
  default_value: string;
};

export const CONTENT_REGISTRY: ContentEntry[] = [
  {
    element_id: "hero.title",
    label: "Hero — title",
    content_type: "text",
    default_value: "SEVARA RETREAT",
  },
  {
    element_id: "hero.subtitle",
    label: "Hero — subtitle",
    content_type: "text",
    default_value: "Space to breathe. Time to come home to yourself.",
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
    element_id: "retreat.title",
    label: "Retreat — title",
    content_type: "text",
    default_value: "THE RETREAT",
  },
  {
    element_id: "retreat.body",
    label: "Retreat — body",
    content_type: "text",
    default_value:
      "A calm rhythm of movement, stillness, and nourishing food. Days are unhurried; evenings are soft. You arrive as you are and leave lighter.",
  },
  {
    element_id: "retreat.image",
    label: "Retreat — image",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "accommodation.title",
    label: "Accommodation — title",
    content_type: "text",
    default_value: "ACCOMMODATION",
  },
  {
    element_id: "accommodation.body",
    label: "Accommodation — body",
    content_type: "text",
    default_value:
      "Thoughtful rooms with natural light, crisp linens, and quiet details. Rest is part of the practice.",
  },
  {
    element_id: "accommodation.bento_1",
    label: "Accommodation — bento image 1",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "accommodation.bento_2",
    label: "Accommodation — bento image 2",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "accommodation.bento_3",
    label: "Accommodation — bento image 3",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "extras.title",
    label: "Extras — title (Was du noch mitnimmst)",
    content_type: "text",
    default_value: "WAS DU NOCH MITNIMMST",
  },
  {
    element_id: "extras.body",
    label: "Extras — body",
    content_type: "text",
    default_value:
      "Small rituals and takeaways: journal prompts, herbal tea, guided breath, and space to integrate what shifted.",
  },
  {
    element_id: "extras.bento_1",
    label: "Extras — bento tile 1 image",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "extras.bento_2",
    label: "Extras — bento tile 2 image",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "extras.bento_3",
    label: "Extras — bento tile 3 image",
    content_type: "image",
    default_value: "",
  },
  {
    element_id: "extras.bento_4",
    label: "Extras — bento tile 4 image",
    content_type: "image",
    default_value: "",
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
      "Reserve your place. We keep groups intentionally small so the experience stays intimate.",
  },
  {
    element_id: "booking.cta",
    label: "Booking — button label",
    content_type: "text",
    default_value: "REQUEST A SPOT",
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
