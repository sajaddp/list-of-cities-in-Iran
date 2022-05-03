[![Iran](images/iran.jpeg)](#)

<p>
<img alt="GitHub (Pre-)Release Date" src="https://img.shields.io/github/release-date-pre/sajaddp/list-of-cities-in-Iran?style=for-the-badge">
<img alt="GitHub" src="https://img.shields.io/github/license/sajaddp/list-of-cities-in-Iran?style=for-the-badge">
<img alt="GitHub commit activity (branch)" src="https://img.shields.io/github/commit-activity/w/sajaddp/list-of-cities-in-Iran?style=for-the-badge">
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/sajaddp/list-of-cities-in-Iran?style=for-the-badge">
</p>


# لیست شهرها و استان‌های ایران

در این مخزن می‌توانید به لیست شهرها و استان‌های ایران در قالب‌های گوناگون دسترسی داشته باشید.

## ویژگی‌ها

- لیست شهرهای ایران
- لیست شهرستان‌های ایران
- لیست شهرهای ایران با فرمت SQL
- لیست شهرستان‌های ایران با فرمت SQL
- لیست شهرهای ایران با فرمت JSON
- لیست شهرستان‌های ایران با فرمت JSON

## روش استفاده

  
```shell
$ git clone https://github.com/sajaddp/list-of-cities-in-Iran.git
```


## مشارکت

از کمک شما برای تکمیل لیست و فرمت‌ها استقبال می‌کنم

### ویژگی‌های نیازمند مشارکت
- فرمت Json &check;
- فرمت SQL &check;
- فرمت csv &times;
- فرمت xlsx &times;
- فرمت txt &times;
- تابع نمونه PHP &times;
- تابع نمونه Python &times;
- تابع نمونه ES6 &times;


### روش تبدیل json به csv

```shell
$ jq -r '(.[0] | keys_unsorted) as $keys | $keys, map([.[ $keys[] ]])[] | @csv' cities.json > cities.csv
```

---

# List of cities in Iran

In this repository, you can access the list of cities and provinces of Iran in various formats

## Features
- List of cities in Iran
- List of provinces in Iran
- List of cities in Iran with SQL format
- List of provinces in Iran with SQL format
- List of cities in Iran with JSON format
- List of provinces in Iran with JSON format

## Usage

```shell
$ git clone https://github.com/sajaddp/list-of-cities-in-Iran.git
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
