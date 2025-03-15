# نحوه فراخوانی و استفاده از فایل JSON در جاوااسکریپت

در این مثال، ما یک فایل JSON به نام `provinces.json` را از مسیر `output/json` فراخوانی می‌کنیم و از آن استفاده می‌کنیم.

```javascript
const fs = require('fs');
const path = require('path');

function loadJSONFile(filePath) {
    try {
        const fullPath = path.join(__dirname, filePath);
        const data = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        return null;
    }
}

const provinces = loadJSONFile('../../output/json/provinces.json');
console.log(provinces);
```

## How to Load and Use a JSON File in JavaScript

In this example, we will load a JSON file named `provinces.json` from the `output/json` directory and use it.

```javascript
const fs = require('fs');
const path = require('path');

function loadJSONFile(filePath) {
    try {
        const fullPath = path.join(__dirname, filePath);
        const data = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        return null;
    }
}

const provinces = loadJSONFile('../../output/json/provinces.json');
console.log(provinces);
```
