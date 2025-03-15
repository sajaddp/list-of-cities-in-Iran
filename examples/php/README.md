# Example PHP Function to Load JSON File

## فارسی

در اینجا یک مثال از یک تابع PHP که یک فایل از مسیر `output/json` را بارگذاری می‌کند، آورده شده است. این مثال از PHP 8.3 استفاده می‌کند و نحوه بارگذاری و دیکد کردن یک فایل JSON به نام `provinces.json` را نشان می‌دهد.

```php
<?php

declare(strict_types=1);

function loadJsonFile(string $filePath): array
{
    if (!file_exists($filePath)) {
        throw new InvalidArgumentException("فایل یافت نشد: $filePath");
    }

    $jsonContent = file_get_contents($filePath);
    if ($jsonContent === false) {
        throw new RuntimeException("خواندن فایل ناموفق بود: $filePath");
    }

    $data = json_decode($jsonContent, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new RuntimeException("خطای دیکد کردن JSON: " . json_last_error_msg());
    }

    return $data;
}

try {
    $filePath = __DIR__ . '/output/json/provinces.json';
    $provinces = loadJsonFile($filePath);
    print_r($provinces);
} catch (Exception $e) {
    echo 'خطا: ' . $e->getMessage();
}
```

## English

Here is a example of a PHP function that loads a file from the `output/json` directory. This example uses PHP 8.3 and demonstrates how to load and decode a JSON file named `provinces.json`.

```php
<?php

declare(strict_types=1);

function loadJsonFile(string $filePath): array
{
    if (!file_exists($filePath)) {
        throw new InvalidArgumentException("File not found: $filePath");
    }

    $jsonContent = file_get_contents($filePath);
    if ($jsonContent === false) {
        throw new RuntimeException("Failed to read file: $filePath");
    }

    $data = json_decode($jsonContent, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new RuntimeException("JSON decode error: " . json_last_error_msg());
    }

    return $data;
}

try {
    $filePath = __DIR__ . '/output/json/provinces.json';
    $provinces = loadJsonFile($filePath);
    print_r($provinces);
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
```
