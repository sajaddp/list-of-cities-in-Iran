# راهنمای استفاده از فایل JSON برای فهرست شهرهای ایران به تفکیک استان در PHP 8.4

اگه با PHP 8.4 کار می‌کنی و می‌خوای **فهرست شهرهای ایران** رو از یه فایل JSON بخونی، این راهنما برات آماده‌ست. توی این آموزش، نحوه‌ی فراخوانی و استفاده از فایل `provinces.json` از مسیر `dist/json` رو بررسی می‌کنیم. این فایل شامل اطلاعات دقیق استان‌ها و شهرهای ایرانه و می‌تونه توی پروژه‌های PHP برای تولید API، فرم‌ها یا گزارش‌ها استفاده بشه.

## مراحل

1. **ایجاد تابع برای خواندن فایل JSON:**

   ```php
   function readJsonFile(string $filePath): array {
        if (!file_exists($filePath)) {
             throw new Exception("File not found: $filePath");
        }

        $jsonContent = file_get_contents($filePath);
        return json_decode($jsonContent, true);
   }
   ```

2. **فراخوانی تابع و استفاده از داده‌ها:**

   ```php
   try {
        $provinces = readJsonFile('dist/json/provinces.json');
        print_r($provinces);
   } catch (Exception $e) {
        echo 'Error: ' . $e->getMessage();
   }
   ```

## Guide to Using JSON Files in PHP 8.3

In this guide, we will explain how to call and use a JSON file from the `dist/json` directory using PHP 8.3. For example, we will consider the `provinces.json` file.

### Steps

1. **Create a function to read the JSON file:**

   ```php
   function readJsonFile(string $filePath): array {
        if (!file_exists($filePath)) {
             throw new Exception("File not found: $filePath");
        }

        $jsonContent = file_get_contents($filePath);
        return json_decode($jsonContent, true);
   }
   ```

2. **Call the function and use the data:**

   ```php
   try {
        $provinces = readJsonFile('dist/json/provinces.json');
        print_r($provinces);
   } catch (Exception $e) {
        echo 'Error: ' . $e->getMessage();
   }
   ```
