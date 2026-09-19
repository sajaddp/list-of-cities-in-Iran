# List of Cities in Iran

Generated, versioned datasets for Iran's administrative divisions. The administrative source is the committed 1404 workbook in [`offical/list.xlsx`](offical/list.xlsx); generated output lives in [`dist/`](dist/).

## Which file should I use?

Choose the entity your application models. Every recommended dataset is available as JSON, CSV, and XLSX under `dist/json/`, `dist/csv/`, and `dist/xlsx/`.

| Need | Recommended dataset |
| --- | --- |
| Provinces / استان‌ها | [`provinces.*`](dist/json/provinces.json) |
| Counties / شهرستان‌ها | [`counties.*`](dist/json/counties.json) |
| Cities — mainstream use / شهرها | [`cities-filtered.*`](dist/json/cities-filtered.json) |
| Cities — complete source view | [`cities.*`](dist/json/cities.json) |
| Districts / بخش‌ها | [`districts.*`](dist/json/districts.json) |
| Rural districts / دهستان‌ها | [`rurals.*`](dist/json/rurals.json) |
| Villages / آبادی‌ها | [`villages.*`](dist/json/villages.json) |
| Complete hierarchy | [`all.*`](dist/json/all.json) |

Use the [manifest](dist/manifest.json) for generated paths, current row counts, versions, derivation, and provenance. Use the [JSON Schema](dist/schema.json) to validate fields, types, and strict record shapes.

## City and County are different

**City = شهر. County = شهرستان.** They are different entity types; do not infer a type from a name. If an application needs a شهرستان, use `counties.*`. If it needs a شهر, use a city dataset.

For example, the same visible name can refer to two different entities:

```text
استان کرمان
└── شهرستان رفسنجان
    └── ...
        └── شهر رفسنجان
```

`county_id`, `province_id`, and `district_id` are ancestry fields, not optional display details. They are the safe way to disambiguate records.

## City datasets

`cities.*` is the complete city projection generated from the current canonical source contract. Use it when complete fidelity to the repository's city data is required.

`cities-filtered.*` is a convenience, derived dataset for mainstream use. It is generated from `cities.*` by the current rule: **exclude cities whose current-name filter slug includes `-` or `_`**. It is not a separate official classification. Its generated row count is in [`dist/manifest.json`](dist/manifest.json).

## Contract and provenance

The [manifest](dist/manifest.json) is the machine-readable inventory: dataset and schema versions, source year, SHA-256, paths, row counts, derivation status, coordinate enrichment, and provenance source IDs.

The [JSON Schema](dist/schema.json) is the validation contract. It defines required fields, numeric IDs, ancestry, strict additional-property policy, and the separate coordinate dataset schemas. README intentionally does not duplicate it.

Administrative semantics come from [`offical/coderec.md`](offical/coderec.md). V2 continuity is documented in [`compat/v2-public-contract.json`](compat/v2-public-contract.json) and [`compat/v2-rural-migration-overrides.json`](compat/v2-rural-migration-overrides.json).

## LLM Context

These compact, self-contained header + TSV files are meant to be copied or piped into an AI tool. They are context files, not training datasets:

- [`dist/llm/provinces.txt`](dist/llm/provinces.txt)
- [`dist/llm/counties.txt`](dist/llm/counties.txt)
- [`dist/llm/cities-filtered.txt`](dist/llm/cities-filtered.txt)
- [`dist/llm/cities.txt`](dist/llm/cities.txt)

Each file declares its scope, source year, row count, columns, TSV representation rules, and the City/County distinction. For example:

```sh
cat dist/llm/counties.txt
```

Agent-oriented navigation is also available at [`docs/llms.txt`](docs/llms.txt).

## Coordinate enrichment

Coordinate files are separate enrichment datasets, not fields added to the official administrative datasets:

- [`province-capitals.*`](dist/json/province-capitals.json): coordinates of each **province capital**.
- [`county-centers.*`](dist/json/county-centers.json): coordinates of each **county administrative center / seat**.

They use WGS84 decimal latitude/longitude. They do **not** represent province/county polygon centroids, bounding-box centers, or legal boundaries. Coordinate records include `source_id`; resolve it through the manifest and [`enrichment/coordinates/sources.json`](enrichment/coordinates/sources.json). The current coordinate enrichment is explicitly derived/non-official and its build input is committed for an offline deterministic build.

The Ministry of Interior remains the authoritative source for legal or authoritative geographic coordinates. This repository is not suitable for legal reference.

## Build and verify

```sh
cd tools
npm ci
npm test
npm run build
npm run verify
```

The build consumes only committed source files, produces JSON/CSV/XLSX parity, and is deterministic. See [`CONTRIBUTING.md`](CONTRIBUTING.md) before changing source or compatibility contracts.

## License

The repository is licensed under [GPL-3.0](LICENSE). The Persian translation is available in [LICENSE-FA.md](LICENSE-FA.md); the English license controls if they differ.

Made with ❤ by [Sajad Dehshiri](https://sajaddehshiri.ir)
