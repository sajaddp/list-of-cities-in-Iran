# راهنمای استفاده از فایل JSON در Go

در این راهنما، نحوه فراخوانی و استفاده از یک فایل JSON از مسیر `dist/json` توضیح داده شده است. به عنوان مثال، فایل `provinces.json` را در نظر بگیرید.

## مراحل

1. **ایمپورت کردن پکیج‌های مورد نیاز:**

   ```go
   import (
       "encoding/json"
       "fmt"
       "io/ioutil"
       "os"
   )
   ```

2. **تعریف ساختار داده‌ها:**

   ```go
   type Province struct {
       ID   int    `json:"id"`
       Name string `json:"name"`
   }
   ```

3. **فراخوانی و خواندن فایل JSON:**

   ```go
   func loadProvinces(filePath string) ([]Province, error) {
       jsonFile, err := os.Open(filePath)
       if err != nil {
           return nil, err
       }
       defer jsonFile.Close()

       byteValue, _ := ioutil.ReadAll(jsonFile)

       var provinces []Province
       json.Unmarshal(byteValue, &provinces)

       return provinces, nil
   }
   ```

4. **استفاده از داده‌های JSON:**

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

## Guide to Using JSON Files in Go

In this guide, we will explain how to load and use a JSON file from the `dist/json` directory. For example, consider the file `provinces.json`.

### Steps

1. **Import the required packages:**

   ```go
   import (
       "encoding/json"
       "fmt"
       "io/ioutil"
       "os"
   )
   ```

2. **Define the data structure:**

   ```go
   type Province struct {
       ID   int    `json:"id"`
       Name string `json:"name"`
   }
   ```

3. **Load and read the JSON file:**

   ```go
   func loadProvinces(filePath string) ([]Province, error) {
       jsonFile, err := os.Open(filePath)
       if err != nil {
           return nil, err
       }
       defer jsonFile.Close()

       byteValue, _ := ioutil.ReadAll(jsonFile)

       var provinces []Province
       json.Unmarshal(byteValue, &provinces)

       return provinces, nil
   }
   ```

4. **Use the JSON data:**

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
