# نحوه فراخوانی و استفاده از فایل JSON برای فهرست شهرهای ایران به تفکیک استان در جاوااسکریپت

در این راهنما، به‌صورت حرفه‌ای روش صحیح فراخوانی و استفاده از **فهرست شهرهای ایران** به زبان جاوااسکریپت توضیح داده شده است. برای این منظور از فایل `provinces.json` در مسیر `dist/json` استفاده می‌کنیم. این فایل شامل داده‌های ساختاریافته مربوط به استان‌ها و شهرهای ایران است که در پروژه‌های فرانت‌اند یا فول‌استک قابل استفاده است.

## مراحل

### 1. ایمپورت کردن ماژول‌های ضروری

```javascript
const fs = require("fs");
const path = require("path");
```

### 2. تعریف تابع برای خواندن فایل JSON

تابع زیر برای خواندن و پردازش امن فایل JSON مناسب است:

```javascript
function loadJSONFile(filePath) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const data = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    return null;
  }
}
```

### 3. فراخوانی و استفاده از داده‌ها

مثال استفاده عملی از تابع بالا:

```javascript
const provinces = loadJSONFile("../../dist/json/provinces.json");

if (provinces) {
  console.log(provinces);
} else {
  console.error("Failed to load provinces data.");
}
```

---

## How to Load and Use JSON File for Iranian Cities by Province in JavaScript

This professional guide demonstrates how to correctly load and use the JSON file containing a structured list of **Iranian provinces and cities** in JavaScript. We use `provinces.json` located at `dist/json`, suitable for front-end or full-stack projects.

## Steps

### 1. Import required modules

```javascript
const fs = require("fs");
const path = require("path");
```

### 2. Define function to read JSON file

Use the following safe and robust function to read and parse the JSON file:

```javascript
function loadJSONFile(filePath) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const data = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    return null;
  }
}
```

### 3. Load and utilize data

Practical example of using the above function:

```javascript
const provinces = loadJSONFile("../../dist/json/provinces.json");

if (provinces) {
  console.log(provinces);
} else {
  console.error("Failed to load provinces data.");
}
```

