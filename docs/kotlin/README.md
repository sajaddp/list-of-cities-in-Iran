# راهنمای استفاده از فایل JSON برای فهرست شهرهای ایران به تفکیک استان در Kotlin

اگه با Kotlin 1.28 کار می‌کنی و دنبال راهی برای استفاده از **فهرست شهرهای ایران** به‌صورت JSON هستی، این راهنما به دردت می‌خوره. در این آموزش، نحوه‌ی فراخوانی و استفاده از فایل `provinces.json` از مسیر `dist/json` رو در پروژه Kotlin نشون می‌دیم. این فایل شامل داده‌های ساختاریافته از استان‌ها و شهرهای ایرانه.

## مراحل

1. **اضافه کردن وابستگی‌ها**: ابتدا باید وابستگی‌های لازم را به فایل `build.gradle.kts` اضافه کنید:

   ```kotlin
   dependencies {
       implementation("com.squareup.moshi:moshi:1.12.0")
       implementation("com.squareup.moshi:moshi-kotlin:1.12.0")
   }
   ```

2. **ایجاد مدل داده**: یک کلاس داده برای مدل JSON خود ایجاد کنید. به عنوان مثال:

   ```kotlin
   data class Province(
       val id: Int,
       val name: String
   )
   ```

3. **خواندن فایل JSON**: از تابع زیر برای خواندن فایل JSON استفاده کنید:

   ```kotlin
   import com.squareup.moshi.Moshi
   import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
   import java.io.File

   fun readProvincesFromFile(filePath: String): List<Province>? {
       val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
       val jsonAdapter = moshi.adapter<List<Province>>(Types.newParameterizedType(List::class.java, Province::class.java))

       val file = File(filePath)
       if (!file.exists()) {
           println("File not found: $filePath")
           return null
       }

       val json = file.readText()
       return jsonAdapter.fromJson(json)
   }
   ```

4. **فراخوانی تابع**: تابع را فراخوانی کنید و از داده‌ها استفاده کنید:

   ```kotlin
   fun main() {
       val provinces = readProvincesFromFile("dist/json/provinces.json")
       provinces?.forEach { println(it) }
   }
   ```

## Guide to Using JSON File in Kotlin

In this guide, we will explain how to load and use a JSON file from the `dist/json` directory in Kotlin 1.28. For example, consider the `provinces.json` file.

### Steps

1. **Add Dependencies**: First, add the necessary dependencies to your `build.gradle.kts` file:

   ```kotlin
   dependencies {
       implementation("com.squareup.moshi:moshi:1.12.0")
       implementation("com.squareup.moshi:moshi-kotlin:1.12.0")
   }
   ```

2. **Create Data Model**: Create a data class for your JSON model. For example:

   ```kotlin
   data class Province(
       val id: Int,
       val name: String
   )
   ```

3. **Read JSON File**: Use the following function to read the JSON file:

   ```kotlin
   import com.squareup.moshi.Moshi
   import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
   import java.io.File

   fun readProvincesFromFile(filePath: String): List<Province>? {
       val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
       val jsonAdapter = moshi.adapter<List<Province>>(Types.newParameterizedType(List::class.java, Province::class.java))

       val file = File(filePath)
       if (!file.exists()) {
           println("File not found: $filePath")
           return null
       }

       val json = file.readText()
       return jsonAdapter.fromJson(json)
   }
   ```

4. **Call the Function**: Call the function and use the data:

   ```kotlin
   fun main() {
       val provinces = readProvincesFromFile("dist/json/provinces.json")
       provinces?.forEach { println(it) }
   }
   ```
