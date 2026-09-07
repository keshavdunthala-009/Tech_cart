import { Smartphone, Laptop, Snowflake, Tv, Gamepad2, Tablet } from "lucide-react";

// Static mirror of the `categories` resource in db.json, used for instant
// navbar rendering without waiting on a network request. The Home page and
// admin panel still fetch the live list from json-server via categoryApi.
export const CATEGORIES = [
  { id: "mobiles", name: "Mobiles", slug: "mobiles" },
  { id: "laptops", name: "Laptops", slug: "laptops" },
  { id: "acs", name: "ACs", slug: "acs" },
  { id: "tvs", name: "TVs", slug: "tvs" },
  { id: "game-consoles", name: "Game Consoles", slug: "game-consoles" },
  { id: "tabs", name: "Tabs", slug: "tabs" },
];

// Icons are resolved by slug (not read off the category object) so they stay
// consistent whether a category came from the static list above or from a
// live API fetch (db.json still carries a plain-text `icon` field that's
// only used as a fallback if a slug isn't recognised here).
export const CATEGORY_ICONS = {
  mobiles: Smartphone,
  laptops: Laptop,
  acs: Snowflake,
  tvs: Tv,
  "game-consoles": Gamepad2,
  tabs: Tablet,
};

export function getCategoryIcon(slug) {
  return CATEGORY_ICONS[slug] || Smartphone;
}
