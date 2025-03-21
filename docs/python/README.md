# راهنمای استفاده از فایل JSON برای فهرست شهرهای ایران به تفکیک استان در Python 3.13

در این راهنما، به صورت حرفه‌ای روش استفاده از **فهرست شهرهای ایران** در یک پروژه پایتون توضیح داده شده است. برای این منظور، فایل `provinces.json` از مسیر `dist/json` استفاده می‌شود. این فایل شامل داده‌های ساختاریافته استان‌ها و شهرهای ایران بوده و برای توسعه API، ساخت CLI، یا ابزارهای گزارش‌گیری کاربرد دارد.

## مراحل

### 1. خواندن فایل JSON

ابتدا باید فایل JSON را بخوانید و محتوای آن را تبدیل به ساختار داده‌ای پایتون کنید:

```python
import json
from pathlib import Path

def read_json_file(file_path: str) -> list[dict]:
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    with path.open("r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format: {e}")
```

### 2. استفاده از داده‌ها

حالا می‌توانید داده‌ها را بارگذاری کرده و از آن‌ها استفاده کنید:

```python
try:
    provinces = read_json_file("dist/json/provinces.json")
    for province in provinces:
        print(f"{province['name']} ({province['tel_prefix']})")
except Exception as e:
    print(f"Error: {e}")
```

---

## Guide to Using JSON File for Iranian Cities by Province in Python 3.13

This professional guide demonstrates how to work with a JSON file containing the list of **Iranian provinces and cities** in a Python 3.13 project. The file `provinces.json`, located in the `dist/json` directory, holds structured data used in backend systems, reporting tools, or CLI applications.

## Steps

### 1. Read JSON File

Start by reading and parsing the JSON file:

```python
import json
from pathlib import Path

def read_json_file(file_path: str) -> list[dict]:
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    with path.open("r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format: {e}")
```

### 2. Use the Data

Now load the data and iterate over it:

```python
try:
    provinces = read_json_file("dist/json/provinces.json")
    for province in provinces:
        print(f"{province['name']} ({province['tel_prefix']})")
except Exception as e:
    print(f"Error: {e}")
```
