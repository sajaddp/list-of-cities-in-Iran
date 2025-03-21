# راهنمای استفاده از فایل JSON برای فهرست شهرهای ایران به تفکیک استان در PHP 8.4

در این راهنما، به صورت حرفه‌ای روش استفاده از **فهرست شهرهای ایران** در یک پروژه PHP توضیح داده شده است. برای این منظور، فایل `provinces.json` از مسیر `dist/json` استفاده می‌شود. این فایل شامل داده‌های ساختاریافته استان‌ها و شهرهای ایران بوده و برای توسعه API، تولید فرم‌ها یا گزارش‌گیری کاربرد دارد.

## مراحل

### 1. ایجاد تابع برای خواندن فایل JSON

ابتدا یک تابع برای خواندن محتوای فایل JSON ایجاد کنید:

```php
function readJsonFile(string $filePath): array {
    if (!file_exists($filePath)) {
        throw new Exception("File not found: $filePath");
    }

    $jsonContent = file_get_contents($filePath);
    $data = json_decode($jsonContent, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON format in file: $filePath");
    }

    return $data;
}
```

### 2. استفاده از داده‌ها در برنامه

سپس می‌توانید داده‌ها را بارگذاری و استفاده کنید:

```php
try {
    $provinces = readJsonFile('dist/json/provinces.json');
    foreach ($provinces as $province) {
        echo $province['name'] . ' (' . $province['tel_prefix'] . ")\n";
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
```

---

## Guide to Using JSON File for Iranian Cities by Province in PHP 8.4

This professional guide shows how to use a JSON file containing the list of **Iranian provinces and cities** in a PHP 8.4 project. The file `provinces.json`, located in the `dist/json` directory, contains structured data that can be used in backend services, APIs, or reporting tools.

## Steps

### 1. Create a Function to Read JSON File

Start by defining a function to read the content of a JSON file:

```php
function readJsonFile(string $filePath): array {
    if (!file_exists($filePath)) {
        throw new Exception("File not found: $filePath");
    }

    $jsonContent = file_get_contents($filePath);
    $data = json_decode($jsonContent, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON format in file: $filePath");
    }

    return $data;
}
```

### 2. Use the Data in Your Application

Then load and use the data in your code:

```php
try {
    $provinces = readJsonFile('dist/json/provinces.json');
    foreach ($provinces as $province) {
        echo $province['name'] . ' (' . $province['tel_prefix'] . ")\n";
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
```
