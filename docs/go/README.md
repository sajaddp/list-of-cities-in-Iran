# راهنمای استفاده از فایل JSON برای فهرست شهرهای ایران به تفکیک استان در Go

در این راهنما، نحوه‌ی خواندن و استفاده از فایل JSON شامل **فهرست استان‌ها و شهرهای ایران** با زبان Go به صورت حرفه‌ای توضیح داده می‌شود. فایل نمونه مورد استفاده در این راهنما `provinces.json` است که در مسیر `dist/json` ذخیره شده است.

## مراحل

### 1. ایمپورت کردن پکیج‌های ضروری

```go
import (
 "encoding/json"
 "fmt"
 "os"
)
```

### 2. تعریف ساختار داده‌ها

برای خواندن صحیح اطلاعات از فایل JSON، باید ساختاری مطابق داده‌های JSON تعریف کنید:

```go
type Province struct {
 ID   int    `json:"id"`
 Name string `json:"name"`
}
```

### 3. فراخوانی و خواندن فایل JSON

برای خواندن و دیکد کردن اطلاعات از فایل JSON به صورت اصولی از تابع زیر استفاده کنید:

```go
func loadProvinces(filePath string) ([]Province, error) {
 jsonFile, err := os.ReadFile(filePath)
 if err != nil {
  return nil, err
 }

 var provinces []Province
 if err := json.Unmarshal(jsonFile, &provinces); err != nil {
  return nil, err
 }

 return provinces, nil
}
```

### 4. استفاده از داده‌های JSON

نحوه‌ی استفاده از داده‌های خوانده شده:

```go
func main() {
 provinces, err := loadProvinces("dist/json/provinces.json")
 if err != nil {
  fmt.Println("Error loading provinces:", err)
  return
 }

 for _, province := range provinces {
  fmt.Printf("ID: %d, Name: %s\n", province.ID, province.Name)
 }
}
```

---

## Guide to Using JSON Files for List of Iranian Cities by Province in Go

In this professional guide, you'll learn how to read and use JSON files containing the **list of Iranian provinces and cities** with Go. The example JSON file used here is `provinces.json`, located in the `dist/json` directory.

## Steps

### 1. Import necessary packages

```go
import (
 "encoding/json"
 "fmt"
 "os"
)
```

### 2. Define the data structure

Define a structure that accurately matches your JSON data:

```go
type Province struct {
 ID   int    `json:"id"`
 Name string `json:"name"`
}
```

### 3. Load and read the JSON file

Use the following best-practice approach to read and decode JSON data from a file:

```go
func loadProvinces(filePath string) ([]Province, error) {
 jsonFile, err := os.ReadFile(filePath)
 if err != nil {
  return nil, err
 }

 var provinces []Province
 if err := json.Unmarshal(jsonFile, &provinces); err != nil {
  return nil, err
 }

 return provinces, nil
}
```

### 4. Use the JSON data

Here's how to utilize the loaded data:

```go
func main() {
 provinces, err := loadProvinces("dist/json/provinces.json")
 if err != nil {
  fmt.Println("Error loading provinces:", err)
  return
 }

 for _, province := range provinces {
  fmt.Printf("ID: %d, Name: %s\n", province.ID, province.Name)
 }
}
```
