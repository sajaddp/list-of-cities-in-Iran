# راهنمای ایمپورت فایل JSON برای فهرست شهرهای ایران به تفکیک استان به دیتابیس MSSQL

در این راهنما، به صورت حرفه‌ای روش دقیق ایمپورت **فهرست شهرهای ایران** به دیتابیس MSSQL توضیح داده شده است. برای این منظور، فایل `provinces.json` از مسیر `dist/json` استفاده می‌شود. این فایل شامل داده‌های ساختاریافته استان‌ها و شهرهای ایران بوده و در پروژه‌های بک‌اند یا API محور کاربرد دارد.

## مراحل

### 1. نصب پیش‌نیازها

ابتدا باید ابزارهای لازم را نصب کنید:

- [نصب SQL Server](https://learn.microsoft.com/sql/linux/quickstart-install-connect-ubuntu)
- [نصب SQLCMD](https://learn.microsoft.com/sql/linux/sql-server-linux-setup-tools)
- نصب ابزار `jq`

```sh
sudo apt install jq  # Ubuntu/Debian
sudo yum install jq  # CentOS
```

### 2. ایجاد دیتابیس و جدول

از دستور زیر برای ایجاد دیتابیس و جدول در MSSQL استفاده کنید:

```sql
sqlcmd -S localhost -U SA -P 'YourPassword'

CREATE DATABASE mydatabase;
GO
USE mydatabase;
GO

CREATE TABLE provinces (
  id INT PRIMARY KEY,
  name NVARCHAR(100),
  slug NVARCHAR(100),
  tel_prefix NVARCHAR(10)
);
GO
```

### 3. ایمپورت داده‌ها از فایل JSON

برای وارد کردن داده‌ها به جدول، دستور زیر را اجرا کنید:

```sh
jq -c '.[]' dist/json/provinces.json | while read item; do
  id=$(echo "$item" | jq '.id')
  name=$(echo "$item" | jq -r '.name')
  slug=$(echo "$item" | jq -r '.slug')
  tel_prefix=$(echo "$item" | jq -r '.tel_prefix')

  sqlcmd -S localhost -U SA -P 'YourPassword' -d mydatabase -Q "INSERT INTO provinces (id, name, slug, tel_prefix) VALUES ($id, N'$name', N'$slug', N'$tel_prefix');"
done
```

---

## Guide to Import JSON File for Iranian Cities by Province into MSSQL

This professional guide provides a clear method to import a JSON file containing the structured list of **Iranian provinces and cities** into MSSQL. The example file `provinces.json` located at `dist/json` is suitable for backend or API-based projects.

## Steps

### 1. Install Prerequisites

First, install required tools:

- [Install SQL Server](https://learn.microsoft.com/sql/linux/quickstart-install-connect-ubuntu)
- [Install SQLCMD](https://learn.microsoft.com/sql/linux/sql-server-linux-setup-tools)
- Install `jq`

```sh
sudo apt install jq  # Ubuntu/Debian
sudo yum install jq  # CentOS
```

### 2. Create Database and Table

Use the following command to create the database and table in MSSQL:

```sql
sqlcmd -S localhost -U SA -P 'YourPassword'

CREATE DATABASE mydatabase;
GO
USE mydatabase;
GO

CREATE TABLE provinces (
  id INT PRIMARY KEY,
  name NVARCHAR(100),
  slug NVARCHAR(100),
  tel_prefix NVARCHAR(10)
);
GO
```

### 3. Import Data from JSON File

Execute the following command to import data into your table:

```sh
jq -c '.[]' dist/json/provinces.json | while read item; do
  id=$(echo "$item" | jq '.id')
  name=$(echo "$item" | jq -r '.name')
  slug=$(echo "$item" | jq -r '.slug')
  tel_prefix=$(echo "$item" | jq -r '.tel_prefix')

  sqlcmd -S localhost -U SA -P 'YourPassword' -d mydatabase -Q "INSERT INTO provinces (id, name, slug, tel_prefix) VALUES ($id, N'$name', N'$slug', N'$tel_prefix');"
done
```
