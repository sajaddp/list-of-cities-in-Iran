# لیست شهرها و استان‌های ایران

![GitHub (Pre-)Release Date](https://img.shields.io/github/release-date-pre/sajaddp/list-of-cities-in-Iran?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/sajaddp/list-of-cities-in-Iran?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/sajaddp/list-of-cities-in-Iran?style=for-the-badge)

[English documentation](#list-of-cities-and-provinces-in-iran)

این مخزن شامل لیست شهرها و استان‌های ایران، شهرستان‌ها، بخش‌ها، دهستان‌ها و آبادی‌هاست. داده‌ها بر اساس فایل رسمی تقسیمات کشوری تا پایان سال **۱۴۰۴** آماده شده‌اند و در سه فرمت **JSON، CSV و XLSX** در دسترس هستند.

برای استفاده در سایت یا نرم‌افزار، کافی هست فایل موردنیاز را از [جدول دانلود](#دانلود-دادهها) دریافت کنید؛ نیازی به نصب پکیج یا اجرای ابزارهای مخزن ندارید. اگر فایل رسمی به‌روزتری منتشر شده، لطفاً از طریق [بخش گزارش مشکلات](https://github.com/sajaddp/list-of-cities-in-Iran/issues) به ما اطلاع دهید.

## نکته مهم: تفاوت «شهر» و «شهرستان»

در تقسیمات کشوری ایران، «شهر» و «شهرستان» یکسان نیستند. شهر یک سکونتگاه شهری هست، اما شهرستان یک واحد اداری بزرگ‌تر هست که می‌تواند چند شهر، بخش، دهستان و روستا را در بر بگیرد. بنابراین برای پیدا کردن یک شهرستان باید فایل شهرستان‌ها را بررسی کنید، نه فایل شهرها.

| اصطلاح فارسی | معادل انگلیسی | توضیح |
| --- | --- | --- |
| استان | Province | سطح اول تقسیمات کشوری |
| شهرستان | County | زیرمجموعه استان؛ می‌تواند شامل چند بخش و شهر باشد |
| بخش | District | زیرمجموعه شهرستان |
| شهر | City | سکونتگاه شهری |
| دهستان | Rural District | واحد اداری روستایی در یک بخش |
| آبادی / روستا | Village / Settlement | سکونتگاه روستایی ثبت‌شده در فایل منبع |

برای نمونه، «رفسنجان» هم نام یک شهر هست و هم نام یک شهرستان. ارتباط آن‌ها در داده‌های فعلی به این صورت ثبت شده:

```text
استان کرمان
└── شهرستان رفسنجان
    └── بخش مرکزی
        └── شهر رفسنجان
```

### قبل از ثبت issue

پیش از گزارش داده مفقود یا نادرست، سطح تقسیمات کشوری و فایل مربوط به آن را بررسی کنید: `cities` برای شهر، `counties` برای شهرستان، `districts` برای بخش و `rurals` برای دهستان. نام یکسان به معنای رکورد یکسان نیست؛ برای تشخیص ارتباط‌ها از فیلدهایی مانند `province_id` و `county_id` استفاده کنید.

## دانلود داده‌ها

همه فایل‌های جدول زیر در هر سه فرمت موجود هستند. تعداد رکوردها از [فهرست مشخصات داده‌ها](dist/manifest.json) گرفته شده:

| داده | نام فایل | تعداد رکورد | JSON | CSV | XLSX |
| --- | --- | ---: | --- | --- | --- |
| استان‌ها | `provinces` | 31 | [JSON](dist/json/provinces.json) | [CSV](dist/csv/provinces.csv) | [XLSX](dist/xlsx/provinces.xlsx) |
| شهرستان‌ها | `counties` | 484 | [JSON](dist/json/counties.json) | [CSV](dist/csv/counties.csv) | [XLSX](dist/xlsx/counties.xlsx) |
| بخش‌ها | `districts` | 1193 | [JSON](dist/json/districts.json) | [CSV](dist/csv/districts.csv) | [XLSX](dist/xlsx/districts.xlsx) |
| شهرها؛ فهرست کامل | `cities` | 1672 | [JSON](dist/json/cities.json) | [CSV](dist/csv/cities.csv) | [XLSX](dist/xlsx/cities.xlsx) |
| شهرهای فیلترشده | `cities-filtered` | 1185 | [JSON](dist/json/cities-filtered.json) | [CSV](dist/csv/cities-filtered.csv) | [XLSX](dist/xlsx/cities-filtered.xlsx) |
| دهستان‌ها | `rurals` | 2777 | [JSON](dist/json/rurals.json) | [CSV](dist/csv/rurals.csv) | [XLSX](dist/xlsx/rurals.xlsx) |
| آبادی‌ها | `villages` | 99317 | [JSON](dist/json/villages.json) | [CSV](dist/csv/villages.csv) | [XLSX](dist/xlsx/villages.xlsx) |
| همه داده‌ها | `all` | 105474 | [JSON](dist/json/all.json) | [CSV](dist/csv/all.csv) | [XLSX](dist/xlsx/all.xlsx) |

فایل `cities-filtered` از فهرست شهرها ساخته می‌شود و یک تقسیم‌بندی رسمی جداگانه نیست. برای دریافت تمام رکوردهای شهر، فایل `cities` را انتخاب کنید. فایل `all` همه سطح‌های تقسیمات کشوری را در بر می‌گیرد، نه فقط شهرها.

## ویژگی‌ها

- لیست شهرهای ایران به تفکیک استان، همراه با شناسه شهرستان و بخش؛ همچنین فهرست شهرستان‌ها، دهستان‌ها و آبادی‌ها.
- خروجی‌های JSON، CSV و XLSX برای استفاده مستقیم در زبان‌ها و پایگاه‌های داده مختلف.
- مختصات مرکز استان‌ها و مرکز شهرستان‌ها، در فایل‌های جداگانه و همراه با اطلاعات منبع.
- فایل‌های متنی فشرده برای استفاده از داده‌ها در ابزارهای هوش مصنوعی، همراه با توضیح ساختار و تفاوت شهر و شهرستان.
- ابزار جست‌وجو و مشاهده داده‌ها، فایل‌های مهاجرت از نسخه ۲ و آزمون‌های خودکار برای بررسی صحت خروجی‌ها.

## محتویات

[مقدمه](#مقدمه) · [ساختار پوشه‌ها](#ساختار-پوشهها) · [نحوه استفاده](#نحوه-استفاده) · [ساختار داده‌ها](#ساختار-دادهها) · [جست‌وجو](#جستوجو-و-مشاهده-دادهها) · [هوش مصنوعی](#استفاده-با-هوش-مصنوعی) · [مختصات](#مختصات-جغرافیایی) · [منبع داده‌ها](#منبع-دادهها-و-بررسی-صحت) · [مهاجرت](#مهاجرت-از-نسخه-۲-به-۳) · [آزمون‌ها](#بازسازی-و-آزمون-دادهها) · [مشارکت](#مشارکت) · [نسخه اختصاصی](#نسخه-اختصاصی) · [مجوز](#مجوز) · [سلب مسئولیت](#سلب-مسئولیت)

## مقدمه

هدف این پروژه، فراهم کردن منبعی باز و رایگان از داده‌های شهرها و استان‌های ایران برای برنامه‌نویسان هست. به‌جای وارد کردن دستی نام‌ها یا تبدیل فایل رسمی، می‌توانید خروجی آماده را دریافت کنید. فایل منبع و ابزارهای تبدیل هم در مخزن نگه‌داری می‌شوند تا نحوه تولید داده‌ها قابل بررسی باشد.

## ساختار پوشه‌ها

| پوشه | محتوا |
| --- | --- |
| `dist/` | فایل‌های JSON، CSV، XLSX، متن‌های آماده برای هوش مصنوعی و گزارش‌های بررسی داده‌ها |
| `docs/` | ابزار جست‌وجو و راهنماهای استفاده در زبان‌ها و پایگاه‌های داده مختلف |
| `offical/` | فایل‌های رسمی و راهنمای کدهای تقسیمات کشوری |
| `tools/` | ابزارهای تبدیل، تولید و بررسی داده‌ها |
| `compat/` | اطلاعات سازگاری با نسخه ۲ |
| `migration/` | جدول تبدیل شناسه‌های قدیمی به جدید |
| `enrichment/coordinates/` | منابع و شواهد مربوط به مختصات جغرافیایی |

## نحوه استفاده

ساده‌ترین راه، دریافت فایل از [جدول دانلود](#دانلود-دادهها) و استفاده از آن در پروژه خودتان هست. فایل‌های JSON به زبان یا چارچوب خاصی وابسته نیستند.

برای دریافت کل مخزن:

```shell
git clone https://github.com/sajaddp/list-of-cities-in-Iran.git
cd list-of-cities-in-Iran
```

این دستور شاخه پیش‌فرض را دریافت می‌کند. اگر README یک شاخه دیگر را می‌خوانید، همان شاخه را هم در نسخه محلی انتخاب کنید؛ برای مثال، داده‌های در حال آماده‌سازی نسخه ۳ در شاخه `dev` قرار دارند:

```shell
git switch dev
```

### کدام فایل را انتخاب کنم؟

| نیاز شما | فایل مناسب |
| --- | --- |
| انتخاب استان و شهرستان در فرم آدرس | [استان‌ها](dist/json/provinces.json) و [شهرستان‌ها](dist/json/counties.json) |
| فهرست کامل شهرهای منبع فعلی | [شهرها](dist/json/cities.json) |
| فهرست فیلترشده شهرها، مطابق رفتار نسخه‌های قبلی | [شهرهای فیلترشده](dist/json/cities-filtered.json) |
| انتخاب بخش و دهستان | [بخش‌ها](dist/json/districts.json) و [دهستان‌ها](dist/json/rurals.json) |
| فهرست روستاها و آبادی‌ها | [آبادی‌ها](dist/json/villages.json) |
| همه سطح‌های تقسیمات کشوری در یک فایل | [همه داده‌ها](dist/json/all.json) |

**تفاوت دو فایل شهرها:** فایل `cities` تمام رکوردهای شهر را دارد. فیلتر `cities-filtered` بر اساس نام فعلی شهر انجام می‌شود: اگر شکل استانداردشده این نام شامل `-` یا `_` باشد، شهر از این فهرست کنار گذاشته می‌شود. این قاعده در [مشخصات داده‌ها](dist/manifest.json) ثبت شده؛ نتیجه آن یک فهرست کمکی هست، نه تشخیص رسمی‌تر یا دقیق‌تر شهرها. مبنای فیلتر، نام فعلی شهر هست؛ `slug` عمومی ممکن هست برای سازگاری با نسخه‌های قبل بدون تغییر مانده باشد.

راهنماهای MySQL، PostgreSQL، MSSQL، TypeScript، JavaScript، Go، Kotlin، Python، PHP، MongoDB و Next.js در [پوشه مستندات](docs/) قرار دارند. هنگام استفاده از نمونه‌های قدیمی، نام فایل‌ها و فیلدها را با [ساختار فعلی داده‌ها](dist/schema.json) تطبیق دهید.

## ساختار داده‌ها

این نمونه، رکورد شهر رفسنجان در [فایل شهرها](dist/json/cities.json) هست:

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

`id` شناسه رکورد، `name` نام و `slug` نامک آن هست. فیلدهای `province_id`، `county_id`، `district_id` و در سطح‌های مربوط، `rural_id` ارتباط رکورد را با تقسیمات بالاتر مشخص می‌کنند. برای مثال، با `province_id` می‌توانید شهرهای یک استان را جدا کنید.

**ارتباط‌ها را از روی رقم‌های `id` استخراج نکنید.** برای حفظ سازگاری با نسخه‌های قبلی، شناسه یک شهر ممکن هست ثابت مانده باشد، در حالی که شهرستان یا بخش آن تغییر کرده. مرجع ارتباط‌ها همان فیلدهای جداگانه هستند.

فیلدهای همه فایل‌ها یکسان نیستند: `tel_prefix` در فایل استان‌ها قرار دارد و فیلدهایی مثل `coderec`، `village_code` و `mapped_rural_code` فقط در خروجی‌های مربوط وجود دارند. نوع شناسه‌ها نیز در همه سطح‌ها یکسان نیست. فهرست دقیق فیلدها و نوع هرکدام در [JSON Schema](dist/schema.json) مشخص شده.

## جست‌وجو و مشاهده داده‌ها

[ابزار جست‌وجوی داده‌ها](docs/index.html) برای پیدا کردن رکوردها، مشاهده نوع و مسیر تقسیمات کشوری، بررسی مختصات و رسیدن به فایل‌های دانلودی ساخته شده. دو دکمه `Copy JSON` و `Copy for AI` هم برای کپی رکورد یا آماده کردن آن برای هوش مصنوعی در اختیار دارید.

جست‌وجوی عادی، استان‌ها تا شهرها را پوشش می‌دهد؛ داده‌های آبادی‌ها فقط پس از انتخاب جست‌وجوی آبادی بارگیری می‌شوند. این ابزار به بک‌اند یا سرویس بیرونی نیاز ندارد و فایل‌های اصلی مخزن همچنان مرجع داده‌ها هستند.

فایل‌های آماده انتشار در `docs/` قرار دارند. برای اجرای محلی، می‌توانید از یک وب‌سرور ساده استفاده کنید؛ برای نمونه، با پایتون و از ریشه مخزن:

```shell
python3 -m http.server --directory docs 8000
```

سپس نشانی `http://localhost:8000` را در مرورگر باز کنید. پیوند `docs/index.html` در گیت‌هاب، کد صفحه را نشان می‌دهد، نه نسخه اجراشده آن.

## استفاده با هوش مصنوعی

برای معرفی داده‌ها به ابزارهایی مثل ChatGPT، Codex یا Claude، لازم نیست تمام فایل‌های مخزن را وارد گفتگو کنید. چهار فایل متنی زیر، داده‌های موردنیاز را همراه با توضیح ستون‌ها، سال منبع و تفاوت شهر و شهرستان در اختیار ابزار قرار می‌دهند:

| داده | فایل متنی |
| --- | --- |
| استان‌ها | [provinces.txt](dist/llm/provinces.txt) |
| شهرستان‌ها | [counties.txt](dist/llm/counties.txt) |
| شهرها؛ فهرست کامل | [cities.txt](dist/llm/cities.txt) |
| شهرهای فیلترشده | [cities-filtered.txt](dist/llm/cities-filtered.txt) |

هر فایل یک توضیح کوتاه و جدول داده با جداکننده تب دارد. می‌توانید متن آن را در گفتگو کپی کنید یا به ورودی ابزار بدهید. این فایل‌ها برای تأمین اطلاعات هنگام کار با هوش مصنوعی هستند، نه برای آموزش مدل. برای آبادی‌ها و همه داده‌ها، فایل متنی بسیار بزرگ تولید نمی‌شود.

فایل [راهنمای ابزارهای هوش مصنوعی](docs/llms.txt) کاربرد دیگری دارد: مسیر فایل‌ها و منابع مهم مخزن را معرفی می‌کند و خودش جایگزین داده‌ها نیست. دکمه `Copy for AI` در ابزار جست‌وجو نیز فقط رکورد انتخاب‌شده و تقسیمات بالادست آن را کپی می‌کند.

## مختصات جغرافیایی

مختصات در فایل‌های جداگانه ارائه می‌شوند و به رکوردهای اصلی استان یا شهرستان اضافه نشده‌اند:

| داده | تعداد رکورد | JSON | CSV | XLSX |
| --- | ---: | --- | --- | --- |
| مختصات مرکز استان‌ها | 31 | [JSON](dist/json/province-capitals.json) | [CSV](dist/csv/province-capitals.csv) | [XLSX](dist/xlsx/province-capitals.xlsx) |
| مختصات مرکز شهرستان‌ها | 484 | [JSON](dist/json/county-centers.json) | [CSV](dist/csv/county-centers.csv) | [XLSX](dist/xlsx/county-centers.xlsx) |

فایل `province-capitals` مختصات مرکز استان و فایل `county-centers` مختصات مرکز اداری شهرستان را دارد. این نقطه‌ها **مرکز هندسی یا مرز جغرافیایی استان و شهرستان نیستند**. طول و عرض جغرافیایی به‌صورت اعشاری و بر مبنای WGS84 ثبت شده‌اند.

منبع این بخش GeoNames هست، نه فایل رسمی تقسیمات کشوری. هر رکورد با `source_id` و `source_feature_id` به منبع خود وصل می‌شود. [اطلاعات منبع و مجوز](enrichment/coordinates/sources.json) و [شواهد ثبت‌شده](enrichment/coordinates/evidence/) برای بررسی در دسترس هستند. هنگام استفاده از این مختصات، الزام ذکر منبع GeoNames طبق مجوز CC BY 4.0 را رعایت کنید.

## منبع داده‌ها و بررسی صحت

فایل رسمی مبنای این نسخه در [offical/list.xlsx](offical/list.xlsx) نگه‌داری می‌شود و تقسیمات کشوری تا پایان سال ۱۴۰۴ را پوشش می‌دهد. توضیح کدهای منبع در [راهنمای کدهای تقسیمات کشوری](offical/coderec.md) آمده. این پروژه فایل‌های قابل‌استفاده در نرم‌افزار را از آن منبع تولید می‌کند؛ خود مخزن، مرجع یا سرویس رسمی دولتی نیست.

برای بررسی جزئیات:

| فایل | اطلاعات |
| --- | --- |
| [manifest.json](dist/manifest.json) | نسخه داده و ساختار، مسیر فایل‌ها، تعداد رکوردها، سال و هش فایل منبع |
| [schema.json](dist/schema.json) | فیلدهای مجاز، نوع داده و ساختار هر رکورد |
| [verification.json](dist/verification.json) | نتیجه بررسی داده‌ها، ارتباط‌ها، سازگاری و برابری خروجی‌های مختلف |

منبع مختصات جداگانه ثبت شده و فهرست شهرهای فیلترشده هم از فهرست کامل شهرها به دست می‌آید. این دو را نباید با داده خام فایل رسمی یکی دانست.

## مهاجرت از نسخه ۲ به ۳

شناسه و نامک رکوردهای ادامه‌دار نسخه ۲، در موارد تحت پوشش قرارداد سازگاری، حفظ شده‌اند. این به معنای ثابت ماندن نام، تقسیمات بالادست یا همه رکوردها نیست.

اگر از نسخه ۲ استفاده می‌کنید، [قرارداد داده‌های قبلی](compat/v2-public-contract.json) را بررسی کنید. برای شناسه‌های دهستان‌ها، [جدول تبدیل نسخه ۲ به ۳](migration/v2-to-v3.csv) و [موارد تغییر تقسیمات کشوری](compat/v2-rural-migration-overrides.json) در دسترس هستند. ارتباط رکوردها را همیشه از فیلدهای نسخه فعلی بخوانید.

## بازسازی و آزمون داده‌ها

این مرحله فقط برای مشارکت در پروژه یا بررسی نحوه تولید داده‌هاست؛ برای استفاده از فایل‌های آماده لازم نیست آن را اجرا کنید.

پس از دریافت مخزن با تاریخچه کامل Git و نصب Node.js و npm:

```shell
cd tools
npm ci
npm test
npm run build
npm run verify
```

آزمون‌های سازگاری، خروجی‌های نسخه‌های قبلی را از تاریخچه Git می‌خوانند؛ بنابراین دریافت کم‌عمق مخزن با `--depth` برای اجرای همه آزمون‌ها کافی نیست.

فرایند ساخت از ورودی‌های ذخیره‌شده در مخزن استفاده می‌کند. با ورودی یکسان، خروجی یکسان تولید می‌شود و برابری فایل‌های JSON، CSV و XLSX بررسی می‌شود. [آزمون‌های خودکار گیت‌هاب](.github/workflows/validate.yml) نیز آزمون، ساخت، بررسی خروجی‌ها و تشخیص فایل‌های به‌روزرسانی‌نشده را اجرا می‌کنند.

## پرسش‌های متداول

### برای فرم آدرس، شهر لازم دارم یا شهرستان؟

بستگی به فیلد فرم دارد. برای «شهرستان» از `counties` و برای «شهر» از `cities` استفاده کنید. این دو فایل جایگزین یکدیگر نیستند.

### آیا فایل آبادی‌ها هم آماده هست؟

بله؛ فایل `villages` در هر سه فرمت JSON، CSV و XLSX موجود هست. تعداد فعلی رکوردها در جدول دانلود آمده.

### آیا برای استفاده از داده‌ها باید ابزار خاصی نصب کنم؟

خیر. فایل مناسب پروژه‌تان را دریافت کنید. ابزارهای پوشه `tools/` برای بازسازی و بررسی داده‌ها هستند، نه پیش‌نیاز استفاده از آن‌ها.

## مشارکت

از گزارش خطا و مشارکت شما استقبال می‌کنیم. پیش از ارسال تغییرات، [راهنمای مشارکت](CONTRIBUTING.md) را بخوانید. هنگام گزارش داده نادرست، نام فایل، شناسه رکورد، سطح تقسیمات کشوری و در صورت امکان منبع رسمی اصلاح را بنویسید. برای تغییرات عمده، ابتدا یک [issue](https://github.com/sajaddp/list-of-cities-in-Iran/issues) باز کنید.

## نسخه اختصاصی

در صورت نیاز به نسخه اختصاصی، از طریق وب‌سایت [sajaddehshiri.ir](https://sajaddehshiri.ir) ارتباط برقرار کنید.

## مجوز

این پروژه تحت مجوز GNU General Public License v3.0 منتشر شده. متن رسمی و معتبر مجوز در [LICENSE](LICENSE) قرار دارد.

[ترجمه غیررسمی فارسی](LICENSE-FA.md) نیز موجود هست. در صورت اختلاف، ابهام یا تعارض میان دو متن، متن انگلیسی فایل `LICENSE` ملاک خواهد بود. مجوز و الزام ذکر منبع داده‌های GeoNames نیز در [اطلاعات منبع مختصات](enrichment/coordinates/sources.json) ثبت شده و باید جداگانه رعایت شود.

## سلب مسئولیت

این مخزن برای استفاده در پروژه‌های نرم‌افزاری تهیه شده و برای استناد حقوقی مناسب نیست. برای استناد رسمی به تقسیمات کشوری و مختصات، به منابع و اعلام‌های وزارت کشور مراجعه کنید. فایل‌های تولیدشده این پروژه و مختصات تکمیلی، جایگزین آن منابع نیستند.

---

## List of Cities and Provinces in Iran

[نسخه فارسی](#لیست-شهرها-و-استانهای-ایران)

This repository provides a list of cities and provinces in Iran, along with counties, districts, rural districts, and villages. The Iran administrative divisions dataset is available in **JSON, CSV, and XLSX** for direct use in software projects.

Current official source year: **1404** (Solar Hijri). The administrative files are generated from the official workbook covering divisions through the end of that year. If a newer official source becomes available, please [open an issue](https://github.com/sajaddp/list-of-cities-in-Iran/issues).

Start with [Data downloads](#data-downloads). You do not need to install a package or run the build tools to use the generated files.

### Important Note: City vs County

**City = شهر. County = شهرستان. City != County.** A city is an urban settlement; a county is a larger administrative unit that may contain multiple cities, districts, rural districts, and villages. Search the county files for a county, not the city files.

| Persian term | English equivalent | Description |
| --- | --- | --- |
| استان | Province | First-level administrative division |
| شهرستان | County | Subdivision of a province; may include multiple districts and cities |
| بخش | District | Subdivision of a county |
| شهر | City | Urban settlement |
| دهستان | Rural District | Rural administrative unit within a district |
| آبادی / روستا | Village / Settlement | Rural settlement recorded in the source workbook |

Rafsanjan is both a city name and a county name. The current records are connected as follows:

```text
Kerman Province
└── Rafsanjan County
    └── Central District
        └── Rafsanjan City
```

#### Before Opening an Issue

Confirm the administrative level and check the corresponding file: `cities` for cities, `counties` for counties, `districts` for districts, and `rurals` for rural districts. A shared name does not identify a shared record. Use explicit parent fields such as `province_id` and `county_id` to resolve relationships.

### Data downloads

All datasets below are available in all three formats. Counts are recorded in the [manifest](dist/manifest.json).

| Data | Dataset | Records | JSON | CSV | XLSX |
| --- | --- | ---: | --- | --- | --- |
| Provinces | `provinces` | 31 | [JSON](dist/json/provinces.json) | [CSV](dist/csv/provinces.csv) | [XLSX](dist/xlsx/provinces.xlsx) |
| Counties | `counties` | 484 | [JSON](dist/json/counties.json) | [CSV](dist/csv/counties.csv) | [XLSX](dist/xlsx/counties.xlsx) |
| Districts | `districts` | 1193 | [JSON](dist/json/districts.json) | [CSV](dist/csv/districts.csv) | [XLSX](dist/xlsx/districts.xlsx) |
| Cities, complete list | `cities` | 1672 | [JSON](dist/json/cities.json) | [CSV](dist/csv/cities.csv) | [XLSX](dist/xlsx/cities.xlsx) |
| Filtered cities | `cities-filtered` | 1185 | [JSON](dist/json/cities-filtered.json) | [CSV](dist/csv/cities-filtered.csv) | [XLSX](dist/xlsx/cities-filtered.xlsx) |
| Rural districts | `rurals` | 2777 | [JSON](dist/json/rurals.json) | [CSV](dist/csv/rurals.csv) | [XLSX](dist/xlsx/rurals.xlsx) |
| Villages | `villages` | 99317 | [JSON](dist/json/villages.json) | [CSV](dist/csv/villages.csv) | [XLSX](dist/xlsx/villages.xlsx) |
| All data | `all` | 105474 | [JSON](dist/json/all.json) | [CSV](dist/csv/all.csv) | [XLSX](dist/xlsx/all.xlsx) |

`cities-filtered` is a **derived / convenience** dataset, not a separate official classification. Use `cities` for every city record in the current source. The `all` dataset includes all administrative levels, not just cities.

### Features

- Iran cities by province, with explicit county and district relationships; separate county, rural-district, and village lists.
- JSON, CSV, and XLSX files for use across programming languages and databases.
- Separate coordinates for province capitals and county administrative centers, with source evidence.
- Compact text files for AI-assisted development, with field definitions and City/County semantics.
- A static data explorer, V2 migration files, and automated output validation.

### Contents

[Introduction](#introduction) · [Folder Structure](#folder-structure) · [Usage](#usage) · [Data Contract](#data-contract) · [Data Explorer](#developer-data-explorer) · [AI](#ai-and-llm-context) · [Coordinates](#coordinates) · [Source](#source-and-provenance) · [Migration](#v2-to-v3-compatibility) · [Build](#build-and-verify) · [Contributing](#contributing) · [Exclusive Version](#exclusive-version) · [License](#license) · [Disclaimer](#disclaimer)

### Introduction

This project provides an open and free resource for developers who need Iranian city and province data. Download the prepared files instead of entering names manually or converting the official workbook yourself. The source files and conversion tools are included so that the generated data can be inspected and reproduced.

### Folder Structure

| Directory | Contents |
| --- | --- |
| `dist/` | JSON, CSV, XLSX, LLM Context files, and validation reports |
| `docs/` | Static data explorer and language/database usage guides |
| `offical/` | Official source files and administrative-code documentation |
| `tools/` | Data conversion, generation, and verification tools |
| `compat/` | V2 compatibility records |
| `migration/` | Old-to-new ID mappings |
| `enrichment/coordinates/` | Coordinate sources and evidence |

### Usage

Download the dataset you need from [Data downloads](#data-downloads) and use it in your application. The JSON files are not tied to a particular language or framework.

To clone the repository:

```shell
git clone https://github.com/sajaddp/list-of-cities-in-Iran.git
cd list-of-cities-in-Iran
```

Cloning checks out the default branch. Select the branch whose README you are reading; for example, the V3 preparation work is on `dev`:

```shell
git switch dev
```

#### Which file should I use?

| Need | Files |
| --- | --- |
| Province and county selectors in an address form | [Provinces](dist/json/provinces.json) and [counties](dist/json/counties.json) |
| Every current city record | [Cities](dist/json/cities.json) |
| The existing convenience city list | [Filtered cities](dist/json/cities-filtered.json) |
| District and rural-district selectors | [Districts](dist/json/districts.json) and [rural districts](dist/json/rurals.json) |
| Villages and rural settlements | [Villages](dist/json/villages.json) |
| All administrative levels in one file | [All data](dist/json/all.json) |

**City filtering:** `cities` contains the complete city projection. `cities-filtered` excludes cities whose current-name filter slug contains `-` or `_`, as documented in the [manifest](dist/manifest.json). It is a convenience rule, not a more authoritative definition of a city. The filter slug is not necessarily the compatibility-preserved public `slug`.

Usage guides for MySQL, PostgreSQL, MSSQL, TypeScript, JavaScript, Go, Kotlin, Python, PHP, MongoDB, and Next.js are available under [docs/](docs/). Check older examples against the [current schema](dist/schema.json) before using their file paths or fields.

### Data Contract

A real record from the [city dataset](dist/json/cities.json):

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

`id` is the public record identifier, `name` is the name, and `slug` is the public slug. Fields such as `province_id`, `county_id`, `district_id`, and, where applicable, `rural_id` define ancestry. For example, filter cities by `province_id` to select cities within a province.

**Do not decode public IDs to reconstruct hierarchy.** Compatibility can preserve an older ID after an entity's county or district changes. Use the explicit parent fields instead.

Fields and ID types differ between datasets. `tel_prefix` belongs to province records; `coderec`, `village_code`, and `mapped_rural_code` appear only in the relevant projections. The [JSON Schema](dist/schema.json) defines the exact required fields, types, and allowed record shapes.

### Developer Data Explorer

The [static data explorer](docs/index.html) provides entity search, type labels, administrative breadcrumbs, available coordinates, and dataset links. **Copy JSON** copies the public record; **Copy for AI** prepares the selected record and its ancestors as a compact context.

Common searches exclude villages until village search is explicitly selected. The explorer requires no backend or external API. Repository datasets remain authoritative.

The publishable site is in `docs/`. To serve it locally with Python, run this command from the repository root:

```shell
python3 -m http.server --directory docs 8000
```

Open `http://localhost:8000` in your browser. The `docs/index.html` link on GitHub displays the page source, not a running deployment.

### AI and LLM Context

The following **LLM Context** files provide compact, self-contained data for tools such as ChatGPT, Codex, and Claude:

| Scope | Context file |
| --- | --- |
| Provinces | [provinces.txt](dist/llm/provinces.txt) |
| Counties | [counties.txt](dist/llm/counties.txt) |
| Cities, complete list | [cities.txt](dist/llm/cities.txt) |
| Filtered cities | [cities-filtered.txt](dist/llm/cities-filtered.txt) |

Each file contains a descriptive header and a TSV body, including source year, columns, scope, and explicit City/County semantics. Copy the text into a conversation or pipe it to an AI tool. These are **not training datasets**. Large `all` or `villages` context dumps are intentionally not generated.

[docs/llms.txt](docs/llms.txt) is a separate navigation resource for agents: it points to relevant files rather than containing the datasets. The explorer's **Copy for AI** action stays limited to the selected entity and its ancestor chain.

### Coordinates

Coordinate enrichment is provided separately from the core province and county records:

| Data | Records | JSON | CSV | XLSX |
| --- | ---: | --- | --- | --- |
| Province capitals | 31 | [JSON](dist/json/province-capitals.json) | [CSV](dist/csv/province-capitals.csv) | [XLSX](dist/xlsx/province-capitals.xlsx) |
| County centers | 484 | [JSON](dist/json/county-centers.json) | [CSV](dist/csv/county-centers.csv) | [XLSX](dist/xlsx/county-centers.xlsx) |

`province-capitals` represents the **province capital**; `county-centers` represents the **county administrative center / seat**. Coordinates are WGS84 decimal latitude/longitude. They are **not geographic centroids or administrative boundaries**.

This enrichment comes from GeoNames, not the official administrative workbook. Records include `source_id` and `source_feature_id`. See the [source registry](enrichment/coordinates/sources.json) and [committed evidence](enrichment/coordinates/evidence/). GeoNames attribution under CC BY 4.0 is required when using these coordinates.

### Source and Provenance

The committed [official workbook](offical/list.xlsx) covers administrative divisions through the end of Solar Hijri year 1404. Source-code meanings are documented in [offical/coderec.md](offical/coderec.md). This repository generates software-ready files from that source; it is not an official government repository or service.

| File | Purpose |
| --- | --- |
| [manifest.json](dist/manifest.json) | Dataset/schema versions, paths, counts, source year, and source SHA-256 |
| [schema.json](dist/schema.json) | Required fields, types, and record shapes |
| [verification.json](dist/verification.json) | Data, ancestry, compatibility, and format-parity verification results |

Coordinate enrichment has its own source. The filtered city list is derived from the complete city dataset. Neither should be described as raw data from the official workbook.

### V2 to V3 Compatibility

Public IDs and slugs for continuing V2 records are preserved within the supported compatibility contract. This does not mean every record, name, or parent relationship remains unchanged.

Review the [V2 public contract](compat/v2-public-contract.json) when upgrading. For rural-district IDs, use the [V2-to-V3 migration map](migration/v2-to-v3.csv) and [administrative-reorganization overrides](compat/v2-rural-migration-overrides.json). Always read parent relationships from current fields.

### Build and Verify

Building is only necessary for contribution or verification, not for consuming the prepared files. With a full-history Git clone, Node.js, and npm:

```shell
cd tools
npm ci
npm test
npm run build
npm run verify
```

Compatibility tests read pinned historical revisions. A shallow clone made with `--depth` does not provide the full history required by these tests.

The build uses committed inputs and is deterministic: the same inputs produce the same outputs. Verification checks JSON/CSV/XLSX parity and data contracts. The [GitHub Actions workflow](.github/workflows/validate.yml) runs tests, build, verification, and generated-artifact drift checks.

### FAQ

#### Should an address form use cities or counties?

Match the dataset to the field: use `counties` for a county selector and `cities` for a city selector. The datasets are not interchangeable.

#### Are village files available?

Yes. `villages` is available in JSON, CSV, and XLSX. See the download table for the current record count.

#### Do I need to install the repository tools?

No. Download the files needed by your application. The tools are for rebuilding and verifying the data, not for using it.

### Contributing

Contributions and corrections are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes. For a data issue, include the file, record ID, administrative level, and an official source for the correction where available. Open an [issue](https://github.com/sajaddp/list-of-cities-in-Iran/issues) before making major changes.

### Exclusive Version

For a customized version, contact [sajaddehshiri.ir](https://sajaddehshiri.ir).

### License

This project is licensed under the GNU General Public License v3.0. The official license text is in [LICENSE](LICENSE).

An [unofficial Persian translation](LICENSE-FA.md) is also available. If the texts differ, the English text in `LICENSE` controls. GeoNames licensing and attribution requirements are recorded separately in the [coordinate source registry](enrichment/coordinates/sources.json) and must also be respected.

### Disclaimer

This repository is intended for software projects, not legal reference. Consult Ministry of Interior sources and announcements for official administrative divisions and coordinates. Generated files and coordinate enrichment in this project do not replace those sources.

Made with ❤ by [Sajad Dehshiri](https://sajaddehshiri.ir)
