# راهنمای استفاده از فایل JSON برای فهرست شهرهای ایران به تفکیک استان در پایتون 3.13

اگه با پایتون 3.13 کار می‌کنی و نیاز به **فهرست شهرهای ایران** داری، این راهنما کمکت می‌کنه. توی این آموزش، نحوه‌ی بارگذاری فایل `provinces.json` از مسیر `dist/json` رو نشون می‌دیم. این فایل شامل داده‌های کامل استان‌ها و شهرهای ایران هست و می‌تونی با استفاده از کتابخونه‌ی استاندارد `json`، اطلاعات رو به راحتی تجزیه و استفاده کنی.

## مثال کد پایتون

```python
import json
from typing import Any, Dict

def load_json(file_path: str) -> Dict[str, Any]:
    """
    این تابع یک فایل JSON را از مسیر داده شده بارگذاری می‌کند و آن را به صورت دیکشنری پایتون برمی‌گرداند.

    :param file_path: مسیر فایل JSON
    :return: دیکشنری پایتون حاوی داده‌های JSON
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# استفاده از تابع
file_path = 'dist/json/provinces.json'
provinces_data = load_json(file_path)
print(provinces_data)
```

## Guide to Using JSON Files in Python 3.13

This guide shows you how to load a JSON file from the `dist/json` directory and use it. In this example, we will load the `provinces.json` file.

## Python Code Example

```python
import json
from typing import Any, Dict

def load_json(file_path: str) -> Dict[str, Any]:
    """
    This function loads a JSON file from the given path and returns it as a Python dictionary.

    :param file_path: Path to the JSON file
    :return: Python dictionary containing JSON data
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# Using the function
file_path = 'dist/json/provinces.json'
provinces_data = load_json(file_path)
print(provinces_data)
```
