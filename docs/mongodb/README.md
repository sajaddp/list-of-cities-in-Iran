# راهنمای ایمپورت فایل JSON برای فهرست شهرهای ایران به تفکیک استان به دیتابیس MongoDB

در این راهنما، به صورت حرفه‌ای روش دقیق ایمپورت **فهرست شهرهای ایران** به دیتابیس MongoDB توضیح داده شده است. برای این منظور، فایل `provinces.json` از مسیر `dist/json` استفاده می‌شود. این فایل شامل داده‌های ساختاریافته استان‌ها و شهرهای ایران بوده و در پروژه‌های بک‌اند یا API محور کاربرد دارد.

## مراحل

### 1. نصب MongoDB

ابتدا باید MongoDB را نصب و اجرا کنید. می‌توانید برای راهنمای نصب از [لینک رسمی MongoDB](https://docs.mongodb.com/manual/installation/) استفاده کنید.

### 2. اتصال به MongoDB

قبل از ایمپورت، از اجرای MongoDB اطمینان حاصل کنید:

```sh
mongod
```

### 3. ایمپورت فایل JSON به دیتابیس

با استفاده از دستور زیر، فایل JSON را به دیتابیس MongoDB ایمپورت کنید. این دستور به صورت خودکار ساختار مورد نیاز را ایجاد می‌کند:

```sh
mongoimport --db نام_دیتابیس --collection نام_کالکشن --file dist/json/provinces.json --jsonArray
```

**توجه:** نام دیتابیس و کالکشن را به دلخواه تنظیم کنید.

---

## Guide to Import JSON File for Iranian Cities by Province into MongoDB

This professional guide provides a clear method to import a JSON file containing the structured list of **Iranian provinces and cities** into MongoDB. The example file `provinces.json` located at `dist/json` is suitable for backend or API-based projects.

## Steps

### 1. Install MongoDB

First, install and run MongoDB. You can follow the official installation guide from [MongoDB documentation](https://docs.mongodb.com/manual/installation/).

### 2. Connect to MongoDB

Before importing, ensure MongoDB is running:

```sh
mongod
```

### 3. Import JSON File to Database

Use the following command to import your JSON file into MongoDB. This command automatically creates the necessary database structure:

```sh
mongoimport --db database_name --collection collection_name --file dist/json/provinces.json --jsonArray
```

**Note:** Replace `database_name` and `collection_name` with your desired names.
