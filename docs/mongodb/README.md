# راهنمای ایمپورت فایل JSON برای فهرست شهرهای ایران به تفکیک استان به دیتابیس MongoDB

اگه می‌خوای **فهرست شهرهای ایران** رو به دیتابیس MongoDB منتقل کنی، این راهنما کمکت می‌کنه. در این آموزش، نحوه‌ی ایمپورت فایل `provinces.json` از مسیر `dist/json` به MongoDB رو یاد می‌گیری. این فایل شامل اطلاعات کامل استان‌ها و شهرهای ایرانه و می‌تونه توی پروژه‌های بک‌اند یا API محور استفاده بشه.

## مراحل به زبان فارسی

1. **نصب MongoDB**:
   ابتدا باید MongoDB را نصب کنید. می‌توانید از [این لینک](https://docs.mongodb.com/manual/installation/) برای نصب استفاده کنید.

2. **فراخوانی فایل JSON**:
   فایل JSON مورد نظر خود را از مسیر `dist/json` فراخوانی کنید. برای مثال، فایل `provinces.json`.

3. **ایمپورت فایل JSON به دیتابیس**:
   از دستور `mongoimport` برای ایمپورت فایل JSON به دیتابیس استفاده کنید. این دستور به صورت خودکار ساختار دیتابیس را تولید می‌کند. به عنوان مثال:

   ```sh
   mongoimport --db نام_دیتابیس --collection نام_کالکشن --file dist/json/provinces.json --jsonArray
   ```

### English

1. **Install MongoDB**:
   First, you need to install MongoDB. You can use [this link](https://docs.mongodb.com/manual/installation/) for installation.

2. **Load JSON File**:
   Load the desired JSON file from the `dist/json` path. For example, the `provinces.json` file.

3. **Import JSON File to Database**:
   Use the `mongoimport` command to import the JSON file into the database. This command will automatically generate the database structure. For example:

   ```sh
   mongoimport --db database_name --collection collection_name --file dist/json/provinces.json --jsonArray
   ```
