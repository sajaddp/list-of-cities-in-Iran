# راهنمای استفاده از فایل JSON در Kotlin

در این راهنما، نحوه فراخوانی و استفاده از یک فایل JSON از مسیر `output/json` در Kotlin 1.28 توضیح داده شده است. به عنوان مثال، فایل `provinces.json` را در نظر بگیرید.

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
        val provinces = readProvincesFromFile("output/json/provinces.json")
        provinces?.forEach { println(it) }
    }
    ```

## Guide to Using JSON File in Kotlin

In this guide, we will explain how to load and use a JSON file from the `output/json` directory in Kotlin 1.28. For example, consider the `provinces.json` file.

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
        val provinces = readProvincesFromFile("output/json/provinces.json")
        provinces?.forEach { println(it) }
    }
    ```
