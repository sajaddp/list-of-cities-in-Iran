# راهنمای ایمپورت فایل JSON برای فهرست شهرهای ایران به تفکیک استان به دیتابیس MySQL

در این راهنما، به صورت حرفه‌ای روش دقیق ایمپورت **فهرست شهرهای ایران** به دیتابیس MySQL توضیح داده شده است. برای این منظور، فایل `provinces.json` از مسیر `dist/json` استفاده می‌شود. این فایل شامل داده‌های ساختاریافته استان‌ها و شهرهای ایران بوده و در پروژه‌های بک‌اند یا API محور کاربرد دارد.

## مراحل

### 1. نصب پیش‌نیازها

ابتدا باید ابزارهای لازم را نصب کنید:

```sh
sudo apt install mysql-client jq  # Ubuntu/Debian
sudo yum install mysql jq        # CentOS
```

### 2. ایجاد دیتابیس و جدول

یک دیتابیس جدید ایجاد کنید و سپس جدولی متناسب با ساختار JSON بسازید:

```sql
CREATE DATABASE mydatabase;
USE mydatabase;

CREATE TABLE provinces (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  slug VARCHAR(100),
  tel_prefix VARCHAR(10)
);
```

### 3. ایمپورت داده‌ها از فایل JSON

از دستور زیر برای وارد کردن خودکار داده‌ها به جدول استفاده کنید:

```sh
jq -c '.[]' dist/json/provinces.json | while read item; do
  id=$(echo "$item" | jq '.id')
  name=$(echo "$item" | jq -r '.name')
  slug=$(echo "$item" | jq -r '.slug')
  tel_prefix=$(echo "$item" | jq -r '.tel_prefix')

  mysql -u root -p mydatabase -e "INSERT INTO provinces (id, name, slug, tel_prefix) VALUES ($id, '$name', '$slug', '$tel_prefix');"
done
```

---

## Guide to Import JSON File for Iranian Cities by Province into MySQL

This professional guide provides a clear method to import a JSON file containing the structured list of **Iranian provinces and cities** into MySQL. The example file `provinces.json` located at `dist/json` is suitable for backend or API-based projects.

## Steps

### 1. Install Prerequisites

First, install required tools:

```sh
sudo apt install mysql-client jq  # Ubuntu/Debian
sudo yum install mysql jq        # CentOS
```

### 2. Create Database and Table

Create a new database and a table matching the JSON structure:

```sql
CREATE DATABASE mydatabase;
USE mydatabase;

CREATE TABLE provinces (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  slug VARCHAR(100),
  tel_prefix VARCHAR(10)
);
```

### 3. Import Data from JSON File

Use the following command to import data automatically into your table:

```sh
jq -c '.[]' dist/json/provinces.json | while read item; do
  id=$(echo "$item" | jq '.id')
  name=$(echo "$item" | jq -r '.name')
  slug=$(echo "$item" | jq -r '.slug')
  tel_prefix=$(echo "$item" | jq -r '.tel_prefix')

  mysql -u root -p mydatabase -e "INSERT INTO provinces (id, name, slug, tel_prefix) VALUES ($id, '$name', '$slug', '$tel_prefix');"
done
```
