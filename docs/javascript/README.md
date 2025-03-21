# نحوه فراخوانی و استفاده از فایل JSON برای فهرست شهرهای ایران در جاوااسکریپت

برای دریافت و استفاده از **فهرست شهرهای ایران** در جاوااسکریپت، می‌تونید فایل `provinces.json` رو از مسیر `dist/json` فراخوانی کنید. این فایل شامل اطلاعات ساختاریافته از استان‌ها و شهرهای ایران هست که در پروژه‌های فرانت‌اند یا فول‌استک کاربرد داره.

```javascript
const fs = require("fs");
const path = require("path");

function loadJSONFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    const data = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    return null;
  }
}

const provinces = loadJSONFile("../../dist/json/provinces.json");
console.log(provinces);
```

## How to Load and Use a JSON File in JavaScript

In this example, we will load a JSON file named `provinces.json` from the `dist/json` directory and use it.

```javascript
const fs = require("fs");
const path = require("path");

function loadJSONFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    const data = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    return null;
  }
}

const provinces = loadJSONFile("../../dist/json/provinces.json");
console.log(provinces);
```
