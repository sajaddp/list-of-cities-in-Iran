# تقسیمات کشوری و لیست شهرهای ایران برای برنامه‌نویسان | Iran Administrative Divisions Dataset

[![Validate generated data](https://github.com/sajaddp/list-of-cities-in-Iran/actions/workflows/validate.yml/badge.svg?branch=dev)](https://github.com/sajaddp/list-of-cities-in-Iran/actions/workflows/validate.yml)

داده‌های نسخه‌بندی‌شده و قابل‌دانلودِ تقسیمات کشوری ایران برای استفادهٔ مستقیم در نرم‌افزارها: استان، شهرستان، بخش، دهستان، شهر و آبادی. منبع اداری فعلی، کاربرگ متعهد‌شدهٔ سال ۱۴۰۴ است و خروجی‌های مخزن به‌صورت قطعی از آن تولید می‌شوند؛ خودِ مخزن یک سرویس دولتی یا API نیست.

This repository is a developer-first Iran administrative data source. Download the generated JSON, CSV, or XLSX files directly for **Province / استان**, **County / شهرستان**, **District / بخش**, **Rural District / دهستان**, **City / شهر**, and **Village / آبادی**. Current official source year: **1404**.

راهنمای سریع: [دانلود داده / Data downloads](#data-downloads) · [شهر و شهرستان / City vs County](#city-vs-county) · [ساختار داده / Schema](#data-contract) · [منبع و اعتبار / Provenance](#source-and-provenance) · [هوش مصنوعی / AI](#ai-and-llm-context) · [ساخت و بررسی / Build and verify](#build-and-verify)

## Data downloads

فایل‌ها محصول اصلی این مخزن‌اند. برای دریافت مستقیم، قالب مناسب را از جدول زیر انتخاب کنید؛ همهٔ پیوندها نسبت به مخزن هستند و در fork یا branch شما نیز کار می‌کنند.

| داده / Dataset | JSON | CSV | XLSX |
| --- | --- | --- | --- |
| استان‌ها / Provinces | [JSON](dist/json/provinces.json) | [CSV](dist/csv/provinces.csv) | [XLSX](dist/xlsx/provinces.xlsx) |
| شهرستان‌ها / Counties | [JSON](dist/json/counties.json) | [CSV](dist/csv/counties.csv) | [XLSX](dist/xlsx/counties.xlsx) |
| بخش‌ها / Districts | [JSON](dist/json/districts.json) | [CSV](dist/csv/districts.csv) | [XLSX](dist/xlsx/districts.xlsx) |
| دهستان‌ها / Rural Districts | [JSON](dist/json/rurals.json) | [CSV](dist/csv/rurals.csv) | [XLSX](dist/xlsx/rurals.xlsx) |
| شهرها / Cities (کامل / complete) | [JSON](dist/json/cities.json) | [CSV](dist/csv/cities.csv) | [XLSX](dist/xlsx/cities.xlsx) |
| شهرهای فیلترشده / Filtered Cities (مشتق‌شده / derived) | [JSON](dist/json/cities-filtered.json) | [CSV](dist/csv/cities-filtered.csv) | [XLSX](dist/xlsx/cities-filtered.xlsx) |
| آبادی‌ها / Villages | [JSON](dist/json/villages.json) | [CSV](dist/csv/villages.csv) | [XLSX](dist/xlsx/villages.xlsx) |
| همهٔ داده‌ها / All | [JSON](dist/json/all.json) | [CSV](dist/csv/all.csv) | [XLSX](dist/xlsx/all.xlsx) |

## Dataset summary

این شمارها از [manifest](dist/manifest.json) تولیدشده می‌آیند؛ [verification](dist/verification.json) نیز حسابداری منبع و هم‌ارزی قالب‌ها را ثبت می‌کند.

| سطح / Level | نام مجموعه / Dataset | شمار رکورد / Records |
| --- | --- | ---: |
| استان / Province | `provinces` | 31 |
| شهرستان / County | `counties` | 484 |
| بخش / District | `districts` | 1193 |
| دهستان / Rural District | `rurals` | 2777 |
| شهر / City | `cities` | 1672 |
| شهرهای فیلترشده / Filtered Cities | `cities-filtered` | 1185 |
| آبادی / Village | `villages` | 99317 |
| همهٔ سطرهای منبع / All source rows | `all` | 105474 |

`cities-filtered` یک فهرست **derived / convenience** برای کاربردهای رایج است، نه رده‌بندی رسمی دیگری از شهرها. این خروجی از `cities` با قاعدهٔ فعلی فیلتر ساخته می‌شود؛ برای همهٔ رکوردهای شهر، `cities` را انتخاب کنید.

## Which file should I use?

| نیاز توسعه‌دهنده | انتخاب درست |
| --- | --- |
| استان و شهرستان برای فرم نشانی | [`provinces`](dist/json/provinces.json) و [`counties`](dist/json/counties.json) |
| همهٔ رکوردهای شهر از منبع فعلی | [`cities`](dist/json/cities.json) |
| فهرست شهرِ مشتق‌شده برای کاربرد رایج | [`cities-filtered`](dist/json/cities-filtered.json) |
| بخش یا دهستان در سلسله‌مراتب نشانی | [`districts`](dist/json/districts.json) یا [`rurals`](dist/json/rurals.json) |
| آبادی‌های ایران | [`villages`](dist/json/villages.json) |
| پروجکشن کاملِ همهٔ سطح‌ها | [`all`](dist/json/all.json) |

هر مجموعه در JSON، CSV و XLSX در بخش [Data downloads](#data-downloads) موجود است. اگر برنامه‌تان «شهرستان» می‌خواهد، فایل شهر را جایگزین آن نکنید.

## City vs County

### شهر با شهرستان فرق دارد

**City = شهر. County = شهرستان. City != County.** این‌ها دو نوع موجودیت اداری جدا هستند و یک نامِ قابل‌مشاهده می‌تواند در هر دو نوع وجود داشته باشد. نوع را از `name` حدس نزنید؛ `id` و فیلدهای parent مانند `province_id`، `county_id` و `district_id` سلسله‌مراتب را مشخص می‌کنند.

نمونهٔ واقعی رفسنجان در دادهٔ فعلی:

```text
استان کرمان / Kerman Province
└── شهرستان رفسنجان / Rafsanjan County
    └── بخش مرکزی / Central District
        └── شهر رفسنجان / Rafsanjan City
```

ساختار مفهومی تقسیمات چنین است؛ وجود فرزند در هر سطح برای تک‌تک رکوردها تضمین نمی‌شود:

```text
Province / استان
└── County / شهرستان
    └── District / بخش
        ├── City / شهر
        └── Rural District / دهستان
            └── Village / آبادی
```

شناسه‌های عمومی برای خواندن سلسله‌مراتب رمزگشایی نمی‌شوند؛ همیشه به parent fields مراجعه کنید. معنای سطح‌های منبع در [CODEREC](offical/coderec.md) ثبت شده است.

## Data contract

[JSON Schema](dist/schema.json) قرارداد سخت‌گیرانه و مرجعِ فیلدها، نوع‌ها و شکل رکوردهاست؛ [manifest](dist/manifest.json) نیز نسخه، مسیرها، شمارها، هش منبع و وضعیت derived را فهرست می‌کند. همهٔ فیلدها روی همهٔ سطح‌ها وجود ندارند.

برای نمونه، یک رکورد واقعی از `cities` چنین است:

```json
{
  "id": 1080004001335,
  "name": "رفسنجان",
  "slug": "رفسنجان",
  "province_id": 108,
  "county_id": 1080004,
  "district_id": 1080004002
}
```

`id` شناسهٔ عمومی، `name` نام منبع، و `slug` شکل جست‌وجوپذیر نام است. فیلدهای ancestry شامل `province_id`، `county_id`، `district_id` و در موارد لازم `rural_id` هستند. `tel_prefix` برای استان‌ها، و `coderec`، `village_code` و `mapped_rural_code` در پروجکشن‌هایی که schema مشخص می‌کند کاربرد دارند.

## Developer Data Explorer

[Developer Data Explorer](docs/index.html) یک ابزار ایستای کمکی در `docs/` است، نه محصول اصلی. با آن می‌توان موجودیت‌ها را جست‌وجو کرد، City و County را جدا دید، سلسله‌مراتب و مختصاتِ موجود را بررسی کرد، **Copy JSON** یا **Copy for AI** را انجام داد و به فایل‌های دانلودی رسید. URL عمومی GitHub Pages در این README منتشر نشده است، زیرا باید فقط پس از فعال‌بودن و بررسی مستقل اضافه شود.

## AI and LLM context

برای agent discovery و راهبری مخزن، از [docs/llms.txt](docs/llms.txt) استفاده کنید. برای قراردادن دادهٔ فشرده و self-contained در گفت‌وگو یا pipeline یک ابزار AI، LLM Contextهای header + TSV زیر را copy/paste یا pipe کنید:

| Context | فایل |
| --- | --- |
| Provinces | [provinces.txt](dist/llm/provinces.txt) |
| Counties | [counties.txt](dist/llm/counties.txt) |
| Cities | [cities.txt](dist/llm/cities.txt) |
| Filtered Cities | [cities-filtered.txt](dist/llm/cities-filtered.txt) |

این‌ها training dataset نیستند. **They are not training datasets.** هر context محدوده، سال منبع، ستون‌ها و معنای صریح City/County را نگه می‌دارد. برای جلوگیری از contextهای بسیار بزرگ، LLM Context جداگانه‌ای برای villages یا all تولید نمی‌شود.

## Coordinates

مختصات، enrichmentهای جدا از کاربرگ رسمی اداری‌اند و بخشی از رکوردهای اصلی تقسیمات نیستند:

| مجموعهٔ enrichment | JSON | CSV | XLSX | معنی |
| --- | --- | --- | --- | --- |
| Province capitals | [JSON](dist/json/province-capitals.json) | [CSV](dist/csv/province-capitals.csv) | [XLSX](dist/xlsx/province-capitals.xlsx) | مختصات پایتخت استان |
| County centers | [JSON](dist/json/county-centers.json) | [CSV](dist/csv/county-centers.csv) | [XLSX](dist/xlsx/county-centers.xlsx) | مختصات مرکز اداری / seat شهرستان |

Coordinates use WGS84 decimal latitude/longitude. Province coordinates mean the **province capital**; County coordinates mean the **county administrative center / seat**. They are not geographic centroids, polygon centroids, boundary geometry, or official administrative-workbook coordinates. هر رکورد `source_id` دارد؛ منبع، مجوز و attribution لازم را در [coordinate provenance](enrichment/coordinates/sources.json) و manifest ببینید.

## Source and provenance

دادهٔ اداری از کاربرگ متعهد‌شدهٔ [offical/list.xlsx](offical/list.xlsx) با سال منبع ۱۴۰۴ می‌آید و معانی CODEREC در [offical/coderec.md](offical/coderec.md) مشخص شده‌اند. مخزن این منبع اداری را مصرف می‌کند، اما خودش سرویس رسمی دولت نیست.

مسیر اعتماد و بازتولید: [manifest](dist/manifest.json) فایل‌ها، شمارها، نسخه و SHA-256 را ثبت می‌کند؛ [schema](dist/schema.json) قرارداد را تعریف می‌کند؛ [verification](dist/verification.json) اعتبارسنجی، parentها، هم‌ارزی قالب‌ها و خروجی‌ها را گزارش می‌کند. ساخت با ورودی‌های متعهد‌شده deterministic است. coordinate enrichment مشتق‌شده و دارای provenance جداگانه است؛ GeoNames و الزامات attribution آن در [sources.json](enrichment/coordinates/sources.json) ثبت شده‌اند.

## V2 to V3 compatibility

برای موجودیت‌های عمومیِ ادامه‌دارِ V2، شناسه‌ها و slugها هر جا کاربرد داشته‌اند حفظ شده‌اند. توسعه‌دهندگانی که مهاجرت می‌کنند باید [V2 public contract](compat/v2-public-contract.json)، [rural migration overrides](compat/v2-rural-migration-overrides.json) و [V2-to-V3 migration map](migration/v2-to-v3.csv) را بررسی کنند؛ این فایل‌ها مسیر جزئیات مهاجرت‌اند، نه جایگزین schema فعلی.

## Build and verify

```sh
cd tools
npm ci
npm test
npm run build
npm run verify
```

این pipeline خروجی‌های generated را بازسازی می‌کند و قراردادها، compatibility، enrichment، parity قالب‌ها و خروجی‌ها را بررسی می‌کند. [GitHub Actions validation](.github/workflows/validate.yml) نیز همین مسیر را روی `main` و `dev` اجرا می‌کند. پیش از تغییر منبع یا قراردادها، [CONTRIBUTING.md](CONTRIBUTING.md) را بخوانید.

### Quick usage

```js
const cities = await fetch("./dist/json/cities.json").then((response) => response.json());
const city = cities.find((record) => record.name === "رفسنجان");
// Use city.county_id and city.district_id; never infer the entity type from name.
```

## FAQ

### «شهر» و «شهرستان» چه تفاوتی دارند؟

شهر یک City و شهرستان یک County است؛ نوع‌های جدا با نام‌های گاهی یکسان. `name` کافی نیست؛ از dataset درست و parent fields استفاده کنید.

### برای فرم آدرس از کدام فایل استفاده کنم؟

برای انتخاب استان و شهرستان از `provinces` و `counties` شروع کنید و بسته به نیاز فرم، `districts`، `rurals` یا `cities` را اضافه کنید.

### آیا آبادی‌ها هم در داده وجود دارند؟

بله؛ `villages` شامل 99317 رکورد آبادی است و در هر سه قالب قابل دانلود است.

### آیا مختصات جغرافیایی وجود دارد؟

بله، در `province-capitals` و `county-centers` به‌صورت enrichment جداگانه با provenance مستقل.

### مختصات Province/County دقیقاً چه چیزی را نشان می‌دهد؟

Province یعنی پایتخت استان و County یعنی مرکز اداری شهرستان؛ این مختصات centroid یا مرز جغرافیایی نیستند.

### آیا این داده رسمی است؟

منبع اداریِ متعهد‌شده traceable و رسمی است، اما projectionهای این مخزن خروجی‌های تولیدشده‌اند و coordinate enrichment نیز منبع و مجوز جدا دارد. این مخزن یک سرویس رسمی دولتی نیست.

## English quick reference

This is an Iran administrative divisions dataset for direct developer use: Province, County, District, Rural District, City, and Village in JSON, CSV, and XLSX. The official administrative source year is 1404. Start with [Data downloads](#data-downloads), then consult the [manifest](dist/manifest.json) and strict [schema](dist/schema.json).

**City ≠ County:** City = شهر; County = شهرستان. Use explicit IDs and parent fields, not names, to identify an entity. `cities` is the complete city projection; `cities-filtered` is a derived convenience list. Coordinates are separate datasets for province capitals and county administrative seats, not centroids. AI users can use [docs/llms.txt](docs/llms.txt) for navigation and the compact [LLM Context files](dist/llm/cities.txt) for copy/paste context.

## License

This repository is licensed under [GPL-3.0](LICENSE). The [Persian translation](LICENSE-FA.md) is provided for readability; the English license controls if the texts differ.

Made with ❤ by [Sajad Dehshiri](https://sajaddehshiri.ir)
