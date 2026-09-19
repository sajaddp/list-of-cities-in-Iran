/** Keeps official punctuation and spacing; only V2 Arabic/Persian variants change. */
export function normalizePersianText(value: string): string {
  return value.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ۀ/g, "ه")
    .replace(/۰/g, "0").replace(/١/g, "1").replace(/٢/g, "2").replace(/٣/g, "3").replace(/٤/g, "4")
    .replace(/٥/g, "5").replace(/٦/g, "6").replace(/٧/g, "7").replace(/٨/g, "8").replace(/٩/g, "9").trim();
}

/** Compatibility-only key; public source names and slugs remain unchanged. */
export function normalizeMigrationName(value: string): string { return normalizePersianText(value).replace(/[\s\u200B\u200C]+/g, ""); }
// Deliberately unchanged from V2's public slug behavior.
export function generateSlug(value: string): string {
  return value.replace(/[\u200C\u200B]/g, "").toLowerCase().replace(/\s+/g, "-").replace(/[-]+/g, "-").replace(/[^\w\-آ-ی\u0600-\u06FF]+/g, "");
}
