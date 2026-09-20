(function () {
  const core = window.ExplorerCore;
  const query = document.getElementById("query"), results = document.getElementById("results"), detail = document.getElementById("detail");
  const loadState = document.getElementById("load-state"), searchNote = document.getElementById("search-note"), villageButton = document.getElementById("search-villages");
  const filters = Array.from(document.querySelectorAll(".filter"));
  let meta, coreRecords = [], villageRecords = null, filter = "all", selected = null, activeIndex = -1;
  let index = new Map();
  const make = (tag, text) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = text; return element; };
  const setIndex = () => { index = core.indexRecords(villageRecords ? coreRecords.concat(villageRecords) : coreRecords); };
  const clearDetail = () => { selected = null; detail.replaceChildren(make("h3", "جزئیات رکورد"), make("p", "یک نتیجه را انتخاب کنید.")); detail.querySelector("p").className = "muted"; };
  const showError = (message) => { loadState.textContent = message; loadState.className = "status"; };
  function renderMetadata() {
    const target = document.getElementById("metadata-content"); target.replaceChildren();
    const items = [
      "سال منبع: " + meta.sourceYear, "نسخهٔ داده: " + meta.datasetVersion,
      "استان: " + meta.counts.provinces, "شهرستان: " + meta.counts.counties,
      "شهر: " + meta.counts.cities, "آبادی: " + meta.counts.villages
    ];
    items.forEach((value) => target.append(make("p", value)));
    [["مخزن", meta.repository.url], ["manifest", meta.repository.manifest], ["schema", meta.repository.schema], ["provenance", meta.repository.provenance]].forEach(([label, href]) => { const link = make("a", label); link.href = href; target.append(link); });
  }
  function renderResults() {
    results.replaceChildren(); villageButton.hidden = true;
    const text = query.value;
    const records = filter === "village" ? (villageRecords || []) : coreRecords;
    const matches = core.searchRecords(records, text, filter, 50);
    if (!text.trim()) { results.append(make("li", "برای شروع، نام یک مکان را وارد کنید.")); return; }
    if (!matches.length) {
      results.append(make("li", filter === "village" ? "آبادی منطبق پیدا نشد." : "نتیجه‌ای در دادهٔ رایج پیدا نشد."));
      if (filter !== "village" && villageRecords === null) villageButton.hidden = false;
      return;
    }
    matches.forEach((record, resultIndex) => {
      const item = make("li"), button = make("button"); button.type = "button"; button.className = "result";
      const name = make("strong", record.name); const badge = make("span", core.labels[record.type]); badge.className = "badge " + record.type;
      const crumb = make("span", core.breadcrumbText(record, index)); crumb.className = "crumb";
      button.append(name, badge, crumb); button.addEventListener("click", () => { activeIndex = resultIndex; renderDetail(record); }); item.append(button); results.append(item);
    });
  }
  function fieldList(record) {
    const list = make("dl");
    [["شناسهٔ عمومی / Public ID", record.id], ["slug", record.slug], ["نوع / Type", core.labels[record.type]]].forEach(([label, value]) => { list.append(make("dt", label), make("dd", String(value))); });
    const parentFields = [["province_id", "province_id"], ["county_id", "county_id"], ["district_id", "district_id"], ["rural_id", "rural_id"], ["coderec", "coderec"], ["village_code", "village_code"], ["mapped_rural_code", "mapped_rural_code"]];
    parentFields.filter(([field]) => Object.prototype.hasOwnProperty.call(record, field)).forEach(([field, label]) => list.append(make("dt", label), make("dd", String(record[field] === null ? "null" : record[field]))));
    return list;
  }
  async function copy(text, label) {
    const status = detail.querySelector(".status");
    try { if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("Clipboard API unavailable"); await navigator.clipboard.writeText(text); status.textContent = label + " در کلیپ‌بورد کپی شد."; }
    catch (_) { status.textContent = "کپی ناموفق بود؛ دسترسی کلیپ‌بورد را بررسی کنید."; }
  }
  function renderDetail(record) {
    selected = record; detail.replaceChildren(); detail.append(make("h3", record.name));
    const badge = make("span", core.labels[record.type]); badge.className = "badge " + record.type; detail.append(badge);
    const crumb = make("p", core.breadcrumbText(record, index)); crumb.className = "breadcrumb"; detail.append(crumb, fieldList(record));
    if (record.center) {
      const section = make("section"); section.className = "coordinates"; section.append(make("h4", "مختصات مرکز"));
      const lines = [record.center.label + ": " + record.center.name, "latitude: " + record.center.latitude, "longitude: " + record.center.longitude, "provenance: " + record.center.provenance + " (" + record.center.source_id + ")", "provenance status: " + record.center.provenance_status];
      lines.forEach((line) => section.append(make("p", line))); detail.append(section);
    }
    const actions = make("div"); actions.className = "detail-actions";
    const copyIfActive = (content, label) => {
      if (!core.canUseSelected(record, { filter, selected })) return;
      copy(content, label);
    };
    const jsonButton = make("button", "Copy JSON"); jsonButton.type = "button"; jsonButton.addEventListener("click", () => copyIfActive(JSON.stringify(core.publicRecord(record), null, 2) + "\n", "JSON"));
    const aiButton = make("button", "Copy for AI"); aiButton.type = "button"; aiButton.addEventListener("click", () => copyIfActive(core.formatAiContext(record, index, meta), "AI context"));
    actions.append(jsonButton, aiButton); detail.append(actions); const status = make("p", ""); status.className = "status"; status.setAttribute("aria-live", "polite"); detail.append(status);
  }
  async function loadVillages() {
    if (villageRecords) return true;
    searchNote.textContent = "در حال بارگیری فهرست آبادی‌ها…";
    try { const response = await fetch("data/search-villages.json"); if (!response.ok) throw new Error("HTTP " + response.status); villageRecords = await response.json(); setIndex(); searchNote.textContent = "فهرست آبادی‌ها برای این نشست بارگیری شد."; return true; }
    catch (_) { searchNote.textContent = "بارگیری فهرست آبادی‌ها ناموفق بود؛ جست‌وجوی دادهٔ رایج همچنان فعال است."; return false; }
  }
  async function chooseFilter(next) {
    if (next === "village" && !(await loadVillages())) return;
    const nextState = core.changeFilterState({ filter, selected, activeIndex }, next);
    filter = nextState.filter; activeIndex = nextState.activeIndex;
    if (nextState.selected !== selected) clearDetail();
    selected = nextState.selected;
    filters.forEach((button) => { const active = button.dataset.filter === filter; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
    renderResults();
  }
  filters.forEach((button) => button.addEventListener("click", () => chooseFilter(button.dataset.filter)));
  villageButton.addEventListener("click", async () => { if (await loadVillages()) chooseFilter("village"); });
  query.addEventListener("input", () => { activeIndex = -1; renderResults(); });
  function dismissSearch() {
    const state = core.clearSearchState({ query: query.value, selected, activeIndex });
    query.value = state.query; selected = state.selected; activeIndex = state.activeIndex;
    clearDetail(); renderResults(); query.focus();
  }
  query.addEventListener("keydown", (event) => { if (event.key === "ArrowDown") { const first = results.querySelector("button"); if (first) { event.preventDefault(); activeIndex = 0; first.focus(); } } else if (event.key === "Enter") { const first = results.querySelector("button"); if (first) { event.preventDefault(); activeIndex = 0; first.click(); } } else if (event.key === "Escape") { event.preventDefault(); dismissSearch(); } });
  results.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); dismissSearch(); return; }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const buttons = Array.from(results.querySelectorAll("button")); const position = buttons.indexOf(document.activeElement);
    activeIndex = core.moveActiveResult(position, event.key, buttons.length);
    const next = buttons[activeIndex]; if (next && activeIndex !== position) { event.preventDefault(); next.focus(); }
  });
  Promise.all([fetch("data/explorer-meta.json"), fetch("data/search-core.json")]).then(async ([metaResponse, coreResponse]) => { if (!metaResponse.ok || !coreResponse.ok) throw new Error("Static data request failed"); meta = await metaResponse.json(); coreRecords = await coreResponse.json(); setIndex(); query.disabled = false; loadState.textContent = "جست‌وجوی دادهٔ رایج آماده است."; renderMetadata(); renderResults(); }).catch(() => { showError("بارگیری دادهٔ کاوشگر ناموفق بود. پیوندهای دریافت مستقیم پایین صفحه همچنان در دسترس‌اند."); document.getElementById("metadata-content").replaceChildren(make("p", "فراداده بارگیری نشد؛ برای دریافت فایل‌ها از پیوندهای مستقیم استفاده کنید.")); });
})();
