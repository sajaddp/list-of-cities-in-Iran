# لیست شهرها و استان‌های ایران

![GitHub (Pre-)Release Date](https://img.shields.io/github/release-date-pre/sajaddp/list-of-cities-in-Iran?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/sajaddp/list-of-cities-in-Iran?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/sajaddp/list-of-cities-in-Iran?style=for-the-badge)

این مخزن شامل لیستی جامع از شهرها و استان‌های ایران به همراه اطلاعات و استانداردهای مربوطه است. این مخزن شامل آخرین اطلاعات رسمی تقسیمات کشوری جمهوری اسلامی ایران تا ۱۴۰۲ است. در صورتی که فایل به‌روزتری منتشر شده است، به ما اطلاع دهید.

## نکته مهم: تفاوت «شهر» و «شهرستان»

در تقسیمات کشوری ایران، «شهر» و «شهرستان» یکسان نیستند. «شهر» یک سکونتگاه شهری است، اما «شهرستان» یک واحد اداری بزرگ‌تر است که می‌تواند چند شهر، بخش، دهستان و روستا را در بر بگیرد. بخش زیادی از issueهای نادرست زمانی ایجاد می‌شود که نام یک «شهرستان» در فایل شهرها جستجو می‌شود یا برعکس.

| اصطلاح فارسی | معادل انگلیسی       | توضیح                                                                  |
| ------------ | ------------------- | ---------------------------------------------------------------------- |
| استان        | Province            | سطح اول تقسیمات کشوری                                                  |
| شهرستان      | County              | واحدی اداری بزرگ‌تر از شهر که می‌تواند شامل چند شهر، بخش، دهستان و روستا باشد |
| بخش          | District            | زیرمجموعه شهرستان                                                      |
| شهر          | City                | سکونتگاه شهری، مانند تهران، شیراز، مشهد یا رشت                         |
| دهستان       | Rural District      | واحد اداری روستایی که معمولاً چند روستا را شامل می‌شود                 |
| آبادی / روستا | Village / Settlement | سکونتگاه روستایی                                                       |

### قبل از ثبت issue

پیش از گزارش داده مفقود یا نادرست، سطح تقسیمات کشوری را بررسی و فایل درست را جستجو کنید:

- برای شهر / City از فایل‌های `cities.*` استفاده کنید.
- برای شهرستان / County از فایل‌های `counties.*` استفاده کنید.
- برای بخش / District از فایل‌های `districts.*` استفاده کنید.
- برای دهستان / Rural District از فایل‌های `rurals.*` استفاده کنید.

| مورد       | تعداد   |
| ---------- | ------- |
| استان‌ها   | 31      |
| شهرستان‌ها | 482     |
| بخش‌ها     | 1184    |
| شهرها      | 1659    |
| دهستان‌ها  | 1524    |
| آبادی‌ها   | به زودی |

## ویژگی‌ها

- لیست شهرهای ایران به تفکیک استان
- لیست شهرستان‌های ایران
- خروجی‌های داده در فرمت‌های:
  - CSV
  - JSON
  - XLSX
- مثال‌ها و راهنماهای استفاده در `docs/` برای MySQL، PostgreSQL، MSSQL، TypeScript، JavaScript، Go، Kotlin، Python، PHP، MongoDB و Next.js.
- امکان استفاده از فایل‌های JSON در هر زبانی که از JSON پشتیبانی می‌کند.

## محتویات

- [مقدمه](#مقدمه)
- [ساختار پوشه‌ها](#ساختار-پوشه‌ها)
- [نحوه استفاده](#نحوه-استفاده)
- [مشارکت](#مشارکت)
- [نسخه اختصاصی](#نسخه-اختصاصی)
- [مجوز](#مجوز)
- [سلب مسئولیت](#سلب-مسئولیت)

## مقدمه

این پروژه با هدف ارائه یک منبع باز و رایگان از داده‌های شهرها و استان‌های ایران ایجاد شده است. خروجی‌های داده به صورت فایل‌های CSV، JSON و XLSX در دسترس هستند و راهنماهای استفاده در `docs/` قرار دارند.

## ساختار پوشه‌ها

- `docs/`: شامل مثال‌هایی از نحوه استفاده از داده‌ها در زبان‌های مختلف برنامه‌نویسی.
- `offical/`: شامل فایل‌های رسمی و استانداردهای تقسیمات کشوری.
- `dist/`: شامل خروجی‌های تولید شده از داده‌ها.
- `tools/`: شامل ابزارهای مورد نیاز برای تبدیل و پردازش داده‌ها.

## نحوه استفاده

برای استفاده از داده‌ها، می‌توانید مخزن را با دستور زیر کلون کنید:

```shell
git clone https://github.com/sajaddp/list-of-cities-in-Iran.git
```

همچنین می‌توانید فایل‌های موجود در پوشه `dist/` را دانلود کرده و در پروژه‌های خود استفاده کنید. ابزارهای موجود در پوشه `tools/` برای پردازش و تبدیل داده‌ها نیز قابل استفاده هستند.

## مشارکت

ما از مشارکت‌های شما استقبال می‌کنیم. لطفاً قبل از ارسال درخواست، مستندات مشارکت را مطالعه کنید. برای تغییرات عمده، ابتدا یک issue باز کنید و تغییرات پیشنهادی خود را مطرح کنید.

## نسخه اختصاصی

در صورت نیاز به نسخه اختصاصی، از طریق وب‌سایت [sajaddehshiri.ir](https://sajaddehshiri.ir) ارتباط برقرار کنید.

## مجوز

این پروژه تحت مجوز GNU General Public License v3.0 منتشر شده است.  
متن رسمی و معتبر مجوز در فایل `LICENSE` قرار دارد.

ترجمه غیررسمی فارسی نیز در فایل `LICENSE-FA.md` موجود است.  
در صورت وجود هرگونه اختلاف، ابهام یا تعارض میان ترجمه فارسی و متن انگلیسی، متن انگلیسی فایل `LICENSE` ملاک خواهد بود.

## سلب مسئولیت

تنها مرجع اعلام مختصات جغرافیایی جمهوری اسلامی ایران، وزارت کشور است. این مخزن برای استناد حقوقی مناسب نیست و هرگونه استناد حقوقی فاقد ارزش است.

---

## List of Cities and Provinces in Iran

This repository contains a comprehensive list of cities and provinces in Iran along with related information and standards. This repository contains the latest official administrative divisions of the Islamic Republic of Iran as of 2023. If a newer file has been released, please inform us.

## Important Note: City vs County

In Iran's administrative divisions, City and County are not the same. A City is an urban settlement, while a County is a larger administrative unit that may include multiple cities, districts, rural districts, and villages. Many incorrect issues are opened because a county name is searched for in the city files, or the other way around.

| Persian Term  | English Equivalent   | Description                                                                                       |
| ------------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| استان         | Province             | First-level administrative division                                                               |
| شهرستان       | County               | An administrative unit larger than a city that may include multiple cities, districts, rural districts, and villages |
| بخش           | District             | Subdivision of a county                                                                           |
| شهر           | City                 | Urban settlement, such as Tehran, Shiraz, Mashhad, or Rasht                                       |
| دهستان        | Rural District       | A rural administrative unit, usually containing multiple villages                                  |
| آبادی / روستا | Village / Settlement | Rural settlement                                                                                  |

### Before Opening an Issue

Before reporting missing or incorrect data, confirm the administrative level and check the matching files:

- Use `cities.*` files when looking for a City / `شهر`.
- Use `counties.*` files when looking for a County / `شهرستان`.
- Use `districts.*` files when looking for a District / `بخش`.
- Use `rurals.*` files when looking for a Rural District / `دهستان`.

| Item            | Count |
| --------------- | ----- |
| Provinces       | 31    |
| Counties        | 482   |
| Districts       | 1184  |
| Cities          | 1659  |
| Rural Districts | 1524  |
| Villages        | Soon  |

## Features

- List of cities in Iran by province
- List of counties in Iran
- Data outputs are available in:
  - CSV
  - JSON
  - XLSX
- Usage examples and guides are available in `docs/` for MySQL, PostgreSQL, MSSQL, TypeScript, JavaScript, Go, Kotlin, Python, PHP, MongoDB, and Next.js.
- JSON files can be used in any language that supports JSON.

## Contents

- [Introduction](#introduction)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [Exclusive Version](#exclusive-version)
- [License](#license)
- [Disclaimer](#disclaimer)

## Introduction

This project aims to provide an open and free resource of data for cities and provinces in Iran. Generated data files are available in CSV, JSON, and XLSX, with usage guides available in `docs/`.

## Folder Structure

- `docs/`: Contains examples of how to use the data in different programming languages.
- `offical/`: Contains official files and administrative division standards.
- `dist/`: Contains generated distributions from the data.
- `tools/`: Contains tools needed for data conversion and processing.

## Usage

To use the data, clone the repository with the following command:

```shell
git clone https://github.com/sajaddp/list-of-cities-in-Iran.git
```

You can also download the files available in the `dist/` folder and use them in your projects. Additionally, the tools available in the `tools/` folder can be used for data processing and conversion.

## Contributing

We welcome your contributions. Please read the contribution guidelines before submitting a request. For major changes, please open an issue first to discuss what you would like to change.

## Exclusive Version

For an exclusive version, please contact [sajaddehshiri.ir](https://sajaddehshiri.ir).

## License

This project is licensed under the GNU General Public License v3.0.  
The official and legally authoritative license text is available in the `LICENSE` file.

A non-official Persian translation is also available in `LICENSE-FA.md`.  
In case of any conflict, ambiguity, or inconsistency between the Persian translation and the English text, the English text in `LICENSE` shall prevail.

## Disclaimer

The Ministry of Interior is the only official source for the geographic coordinates of the Islamic Republic of Iran. This repository is not suitable for legal reference, and any legal citation is invalid.

Made with ❤ by [Sajad Dehshiri](https://sajaddehshiri.ir)
