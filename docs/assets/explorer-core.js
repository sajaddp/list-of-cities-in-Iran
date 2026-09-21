/* Shared pure explorer functions. This file is also loaded by Node tests. */
(function (root, factory) {
  const api = factory();
  root.ExplorerCore = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const labels = {
    province: "استان / Province", county: "شهرستان / County", district: "بخش / District",
    rural: "دهستان / Rural District", city: "شهر / City", "urban-zone": "ناحیه شهری / Urban Zone", village: "آبادی / Village"
  };
  const publicFields = {
    province: ["id", "name", "slug", "tel_prefix"],
    county: ["id", "name", "slug", "province_id"],
    district: ["id", "name", "slug", "province_id", "county_id"],
    rural: ["id", "name", "slug", "province_id", "county_id", "district_id"],
    city: ["id", "name", "slug", "province_id", "county_id", "district_id"],
    "urban-zone": ["type", "id", "name", "slug", "province_id", "county_id", "district_id", "city_id"],
    village: ["id", "name", "slug", "province_id", "county_id", "district_id", "rural_id", "coderec", "village_code", "mapped_rural_code"]
  };
  const parentSteps = {
    province: [["id", "province"]], county: [["province_id", "province"], ["id", "county"]],
    district: [["province_id", "province"], ["county_id", "county"], ["id", "district"]],
    rural: [["province_id", "province"], ["county_id", "county"], ["district_id", "district"], ["id", "rural"]],
    city: [["province_id", "province"], ["county_id", "county"], ["district_id", "district"], ["id", "city"]],
    "urban-zone": [["province_id", "province"], ["county_id", "county"], ["district_id", "district"], ["city_id", "city"], ["id", "urban-zone"]],
    village: [["province_id", "province"], ["county_id", "county"], ["district_id", "district"], ["rural_id", "rural"], ["id", "village"]]
  };
  const sharedSemantics = [
    "county = شهرستان; an administrative division.",
    "city = شهر; an urban settlement.",
    "county and city are different entity types.",
    "same name does not mean the same entity."
  ];
  function semanticsFor(record) {
    return record.type === "urban-zone"
      ? ["urban zone = ناحیه شهری; not a real city.", "city_id identifies the parent real city in cities-filtered.", "county = شهرستان; an administrative division.", "county and city are different entity types.", "same name does not mean the same entity."]
      : sharedSemantics;
  }
  function normalizeSearch(value) {
    return String(value || "").normalize("NFC").replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[\s\u200c]+/g, " ").trim().toLocaleLowerCase("fa-IR");
  }
  function isFilterCompatible(record, filter) {
    if (!record) return false;
    return filter === "all" ? record.type !== "village" : record.type === filter;
  }
  function changeFilterState(state, filter) {
    return {
      filter,
      selected: isFilterCompatible(state.selected, filter) ? state.selected : null,
      activeIndex: -1
    };
  }
  function canUseSelected(record, state) {
    return state.selected === record && isFilterCompatible(record, state.filter);
  }
  function clearSearchState(state) {
    return { ...state, query: "", selected: null, activeIndex: -1 };
  }
  function moveActiveResult(activeIndex, key, resultCount) {
    if (key === "ArrowDown" && activeIndex < resultCount - 1) return activeIndex + 1;
    if (key === "ArrowUp" && activeIndex > 0) return activeIndex - 1;
    return activeIndex;
  }
  function searchRecords(records, query, type, limit) {
    const normalized = normalizeSearch(query);
    if (!normalized) return [];
    return records.filter((record) => !type || type === "all" || record.type === type).map((record) => {
      const name = normalizeSearch(record.name);
      const rank = name === normalized ? 0 : name.startsWith(normalized) ? 1 : name.includes(normalized) ? 2 : -1;
      return { record, rank };
    }).filter((item) => item.rank >= 0).sort((a, b) => a.rank - b.rank || String(a.record.name).localeCompare(String(b.record.name), "fa") || String(a.record.id).localeCompare(String(b.record.id), "en", { numeric: true })).slice(0, limit || 50).map((item) => item.record);
  }
  function key(type, id) { return type + ":" + String(id); }
  function indexRecords(records) { return new Map(records.map((record) => [key(record.type, record.id), record])); }
  function breadcrumb(record, index) {
    return parentSteps[record.type].map(([field, type]) => index.get(key(type, record[field]))).filter(Boolean);
  }
  function breadcrumbText(record, index) { return breadcrumb(record, index).map((item) => item.name).join(" › "); }
  function publicRecord(record) {
    return Object.fromEntries(publicFields[record.type].map((field) => [field, Object.prototype.hasOwnProperty.call(record, field) ? record[field] : null]));
  }
  function formatAiContext(record, index, meta) {
    const ancestors = breadcrumb(record, index).slice(0, -1);
    const lines = [
      "# list-of-cities-in-Iran Explorer Context",
      "project: list-of-cities-in-Iran",
      "repository: https://github.com/sajaddp/list-of-cities-in-Iran",
      "maintainer: Sajad Dehshiri",
      "schema: 1",
      "source_year: " + meta.sourceYear,
      "dataset_version: " + meta.datasetVersion,
      "selected_entity: " + record.type,
      "selected_entity_label: " + labels[record.type],
      "",
      "semantics:",
      ...semanticsFor(record).map((item) => "- " + item),
      "",
      "ancestor_context:"
    ];
    if (ancestors.length) ancestors.forEach((ancestor) => lines.push("- " + labels[ancestor.type] + ": " + JSON.stringify(publicRecord(ancestor))));
    else lines.push("- none (selected entity is a province)");
    lines.push("", "selected_record:", JSON.stringify(publicRecord(record), null, 2));
    return lines.join("\n") + "\n";
  }
  return { labels, sharedSemantics, normalizeSearch, isFilterCompatible, changeFilterState, canUseSelected, clearSearchState, moveActiveResult, searchRecords, indexRecords, breadcrumb, breadcrumbText, publicRecord, formatAiContext };
});
