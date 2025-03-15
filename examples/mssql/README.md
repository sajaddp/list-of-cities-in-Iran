# راهنمای ایمپورت فایل JSON به دیتابیس MSSQL

## فارسی

برای ایمپورت کردن فایل JSON از مسیر `dist/json` به دیتابیس MSSQL و تولید خودکار ساختار دیتابیس، مراحل زیر را دنبال کنید:

1. **اتصال به دیتابیس MSSQL:**
   ابتدا به دیتابیس MSSQL خود متصل شوید. می‌توانید از ابزارهایی مانند SQL Server Management Studio (SSMS) یا Azure Data Studio استفاده کنید.

2. **ایجاد جدول موقت:**
   یک جدول موقت برای نگهداری داده‌های JSON ایجاد کنید. به عنوان مثال:

   ```sql
   CREATE TABLE ProvincesTemp (
        JsonData NVARCHAR(MAX)
   );
   ```

3. **بارگذاری فایل JSON:**
   فایل JSON را به جدول موقت بارگذاری کنید. به عنوان مثال:

   ```sql
   BULK INSERT ProvincesTemp
   FROM 'C:\path\to\dist\json\provinces.json'
   WITH (ROWTERMINATOR = '\n', FIELDTERMINATOR = ',');
   ```

4. **استخراج داده‌ها از JSON:**
   داده‌های JSON را از جدول موقت استخراج کرده و به جدول نهایی منتقل کنید. به عنوان مثال:

   ```sql
   SELECT *
   INTO Provinces
   FROM OPENJSON((SELECT JsonData FROM ProvincesTemp))
   WITH (
        ProvinceID INT 'strict $.ProvinceID',
        ProvinceName NVARCHAR(100) 'strict $.ProvinceName'
   );
   ```

5. **حذف جدول موقت:**
   پس از انتقال داده‌ها، جدول موقت را حذف کنید:

   ```sql
   DROP TABLE ProvincesTemp;
   ```

### English

To import a JSON file from the `dist/json` path into an MSSQL database and automatically generate the database structure, follow these steps:

1. **Connect to MSSQL Database:**
   First, connect to your MSSQL database. You can use tools like SQL Server Management Studio (SSMS) or Azure Data Studio.

2. **Create a Temporary Table:**
   Create a temporary table to hold the JSON data. For example:

   ```sql
   CREATE TABLE ProvincesTemp (
        JsonData NVARCHAR(MAX)
   );
   ```

3. **Load JSON File:**
   Load the JSON file into the temporary table. For example:

   ```sql
   BULK INSERT ProvincesTemp
   FROM 'C:\path\to\dist\json\provinces.json'
   WITH (ROWTERMINATOR = '\n', FIELDTERMINATOR = ',');
   ```

4. **Extract Data from JSON:**
   Extract the JSON data from the temporary table and insert it into the final table. For example:

   ```sql
   SELECT *
   INTO Provinces
   FROM OPENJSON((SELECT JsonData FROM ProvincesTemp))
   WITH (
        ProvinceID INT 'strict $.ProvinceID',
        ProvinceName NVARCHAR(100) 'strict $.ProvinceName'
   );
   ```

5. **Drop Temporary Table:**
   After transferring the data, drop the temporary table:

   ```sql
   DROP TABLE ProvincesTemp;
   ```
