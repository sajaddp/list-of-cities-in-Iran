# راهنمای وارد کردن فایل JSON برای فهرست شهرهای ایران به تفکیک استان به دیتابیس PostgreSQL

برای ذخیره‌سازی **فهرست شهرهای ایران** در دیتابیس PostgreSQL، می‌تونی از پشتیبانی قوی این دیتابیس از فرمت JSON استفاده کنی. در این راهنما، نحوه‌ی وارد کردن فایل `provinces.json` از مسیر `dist/json` به PostgreSQL رو توضیح می‌دیم. این فایل شامل اطلاعات ساختاریافته استان‌ها و شهرهای ایران هست و به‌راحتی می‌تونه با توابع داخلی مثل `jsonb_populate_record` یا `COPY` وارد جدول بشه.

## مراحل به زبان فارسی

1. **نصب ابزارهای مورد نیاز**:
   ابتدا باید ابزارهای `psql` و `jq` را نصب کنید. برای نصب این ابزارها می‌توانید از دستورات زیر استفاده کنید:

   ```sh
   sudo apt-get install postgresql-client jq
   ```

2. **ایجاد دیتابیس و جدول**:
   یک دیتابیس جدید ایجاد کنید و جدول مورد نظر را با استفاده از دستور زیر ایجاد کنید:

   ```sql
   CREATE DATABASE mydatabase;
   \c mydatabase
   CREATE TABLE provinces (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL
   );
   ```

3. **وارد کردن داده‌ها از فایل JSON**:
   فایل `provinces.json` را از مسیر `dist/json` بخوانید و داده‌ها را به جدول وارد کنید:

   ```sh
   cat dist/json/provinces.json | jq -c '.[]' | while read i; do
        psql -d mydatabase -c "INSERT INTO provinces (name, code) VALUES ('$(echo $i | jq -r '.name')', '$(echo $i | jq -r '.code')');"
   done
   ```

### Steps in English

1. **Install required tools**:
   First, you need to install `psql` and `jq` tools. You can install these tools using the following commands:

   ```sh
   sudo apt-get install postgresql-client jq
   ```

2. **Create database and table**:
   Create a new database and the required table using the following command:

   ```sql
   CREATE DATABASE mydatabase;
   \c mydatabase
   CREATE TABLE provinces (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL
   );
   ```

3. **Import data from JSON file**:
   Read the `provinces.json` file from the `dist/json` path and import the data into the table:

   ```sh
   cat dist/json/provinces.json | jq -c '.[]' | while read i; do
        psql -d mydatabase -c "INSERT INTO provinces (name, code) VALUES ('$(echo $i | jq -r '.name')', '$(echo $i | jq -r '.code')');"
   done
   ```
