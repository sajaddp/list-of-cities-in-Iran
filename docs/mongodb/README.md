# راهنمای ایمپورت فایل JSON برای فهرست شهرهای ایران به تفکیک استان به دیتابیس MongoDB

در این راهنما، به صورت حرفه‌ای روش دقیق ایمپورت **فهرست شهرهای ایران** به دیتابیس MongoDB توضیح داده شده است. برای این منظور، فایل `provinces.json` از مسیر `dist/json` استفاده می‌شود. این فایل شامل داده‌های ساختاریافته استان‌ها و شهرهای ایران بوده و در پروژه‌های بک‌اند یا API محور کاربرد دارد.

## مراحل

### 1. نصب MongoDB

ابتدا MongoDB را نصب و اجرا کنید. برای راهنمای نصب می‌توانید از [مستندات رسمی MongoDB](https://docs.mongodb.com/manual/installation/) استفاده کنید.

### 2. اطمینان از اجرای MongoDB

پیش از ایمپورت، مطمئن شوید MongoDB در حال اجرا است:

```sh
mongod
```

### 3. ایمپورت فایل JSON به دیتابیس

از دستور زیر برای ایمپورت فایل استفاده کنید. این دستور به صورت خودکار دیتابیس و کالکشن را ایجاد می‌کند:

```sh
mongoimport --db mydatabase --collection provinces --file dist/json/provinces.json --jsonArray
```

**توجه:** نام دیتابیس و کالکشن را می‌توانید به دلخواه تغییر دهید.

---

## Guide to Import JSON File for Iranian Cities by Province into MongoDB

This professional guide provides a clear method to import a JSON file containing the structured list of **Iranian provinces and cities** into MongoDB. The example file `provinces.json` located at `dist/json` is suitable for backend or API-based projects.

## Steps

### 1. Install MongoDB

Install and run MongoDB. For installation help, refer to the [official MongoDB documentation](https://docs.mongodb.com/manual/installation/).

### 2. Ensure MongoDB is Running

Before importing, make sure MongoDB is up and running:

```sh
mongod
```

### 3. Import JSON File to Database

Use the following command to import the JSON file. This command will automatically create the required database and collection:

```sh
mongoimport --db mydatabase --collection provinces --file dist/json/provinces.json --jsonArray
```

**Note:** Replace `mydatabase` and `provinces` with your preferred names.
