# راهنمای ایمپورت فایل JSON برای فهرست شهرهای ایران به تفکیک استان به دیتابیس MSSQL

در این راهنما، به صورت حرفه‌ای روش دقیق ایمپورت **فهرست شهرهای ایران** به دیتابیس MSSQL توضیح داده شده است. برای این منظور، فایل `provinces.json` از مسیر `dist/json` استفاده می‌شود. این فایل شامل داده‌های ساختاریافته استان‌ها و شهرهای ایران بوده و به راحتی در پروژه‌های بک‌اند یا API محور قابل استفاده است.

## مراحل

### 1. اتصال به دیتابیس MSSQL

ابتدا باید به دیتابیس MSSQL متصل شوید. می‌توانید از ابزارهایی مثل SQL Server Management Studio (SSMS) یا Azure Data Studio استفاده کنید.

### 2. ایجاد جدول موقت برای JSON

یک جدول موقت برای نگهداری داده‌های JSON ایجاد کنید:

```sql
CREATE TABLE ProvincesTemp (
    JsonData NVARCHAR(MAX)
);
```

### 3. بارگذاری داده‌ها به جدول موقت

برای بارگذاری فایل JSON به جدول موقت از دستورات زیر استفاده کنید:

```sql
BULK INSERT ProvincesTemp
FROM 'C:\\path\\to\\dist\\json\\provinces.json'
WITH (
    ROWTERMINATOR = '\n',
    FIELDTERMINATOR = '\0'
);
```

**توجه:** مسیر فایل JSON را به‌طور دقیق تنظیم کنید.

### 4. استخراج داده‌ها از JSON

داده‌ها را از جدول موقت استخراج کرده و در جدول نهایی وارد کنید:

```sql
SELECT *
INTO Provinces
FROM OPENJSON((SELECT JsonData FROM ProvincesTemp))
WITH (
    ProvinceID INT '$.ProvinceID',
    ProvinceName NVARCHAR(100) '$.ProvinceName'
);
```

### 5. حذف جدول موقت

بعد از انتقال داده‌ها، جدول موقت را حذف کنید:

```sql
DROP TABLE ProvincesTemp;
```

---

## Guide to Import JSON File for Iranian Cities by Province into MSSQL Database

This professional guide explains precisely how to import a structured JSON file containing **Iranian provinces and cities** into an MSSQL database. The example uses the file `provinces.json` located at `dist/json`, suitable for backend or API-based projects.

## Steps

### 1. Connect to MSSQL Database

First, connect to your MSSQL database using tools like SQL Server Management Studio (SSMS) or Azure Data Studio.

### 2. Create Temporary Table for JSON

Create a temporary table to store JSON data:

```sql
CREATE TABLE ProvincesTemp (
    JsonData NVARCHAR(MAX)
);
```

### 3. Load JSON Data into Temporary Table

Use the following commands to load the JSON file into the temporary table:

```sql
BULK INSERT ProvincesTemp
FROM 'C:\\path\\to\\dist\\json\\provinces.json'
WITH (
    ROWTERMINATOR = '\n',
    FIELDTERMINATOR = '\0'
);
```

**Note:** Ensure the file path is correctly specified.

### 4. Extract Data from JSON

Extract data from the temporary table and insert it into the final table:

```sql
SELECT *
INTO Provinces
FROM OPENJSON((SELECT JsonData FROM ProvincesTemp))
WITH (
    ProvinceID INT '$.ProvinceID',
    ProvinceName NVARCHAR(100) '$.ProvinceName'
);
```

### 5. Drop Temporary Table

After transferring the data, drop the temporary table:

```sql
DROP TABLE ProvincesTemp;
```
