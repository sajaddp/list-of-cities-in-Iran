# راهنمای استفاده از فایل JSON برای فهرست شهرهای ایران به تفکیک استان در Kotlin

در این راهنما، به‌صورت حرفه‌ای روش صحیح فراخوانی و استفاده از **فهرست شهرهای ایران** به زبان Kotlin (نسخه 1.28) توضیح داده شده است. برای این منظور از فایل `provinces.json` در مسیر `dist/json` استفاده می‌کنیم. این فایل شامل داده‌های ساختاریافته مربوط به استان‌ها و شهرهای ایران است.

## مراحل

### 1. اضافه کردن وابستگی‌ها

وابستگی‌های زیر را به فایل `build.gradle.kts` اضافه کنید:

```kotlin
dependencies {
    implementation("com.squareup.moshi:moshi:1.12.0")
    implementation("com.squareup.moshi:moshi-kotlin:1.12.0")
}
```

### 2. ایجاد مدل داده

کلاس داده‌ای برای مدل JSON تعریف کنید:

```kotlin
data class Province(
    val id: Int,
    val name: String
)
```

### 3. خواندن فایل JSON

از تابع زیر برای خواندن امن و حرفه‌ای فایل JSON استفاده کنید:

```kotlin
import com.squareup.moshi.Moshi
import com.squareup.moshi.Types
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import java.io.File

fun readProvincesFromFile(filePath: String): List<Province>? {
    val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
    val type = Types.newParameterizedType(List::class.java, Province::class.java)
    val jsonAdapter = moshi.adapter<List<Province>>(type)

    val file = File(filePath)
    if (!file.exists()) {
        println("File not found: $filePath")
        return null
    }

    val json = file.readText()
    return jsonAdapter.fromJson(json)
}
```

### 4. استفاده از داده‌ها

مثال کاربردی فراخوانی و استفاده از داده‌ها:

```kotlin
fun main() {
    val provinces = readProvincesFromFile("dist/json/provinces.json")

    provinces?.forEach { println(it) } ?: println("Failed to load provinces data.")
}
```

---

## Guide to Using JSON File for Iranian Cities by Province in Kotlin

This professional guide demonstrates how to correctly load and use the JSON file containing a structured list of **Iranian provinces and cities** in Kotlin (version 1.28). We use `provinces.json` located at `dist/json`.

## Steps

### 1. Add Dependencies

Add the following dependencies to your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.squareup.moshi:moshi:1.12.0")
    implementation("com.squareup.moshi:moshi-kotlin:1.12.0")
}
```

### 2. Create Data Model

Define a data class for your JSON model:

```kotlin
data class Province(
    val id: Int,
    val name: String
)
```

### 3. Read JSON File

Use the following safe and professional function to read the JSON file:

```kotlin
import com.squareup.moshi.Moshi
import com.squareup.moshi.Types
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import java.io.File

fun readProvincesFromFile(filePath: String): List<Province>? {
    val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
    val type = Types.newParameterizedType(List::class.java, Province::class.java)
    val jsonAdapter = moshi.adapter<List<Province>>(type)

    val file = File(filePath)
    if (!file.exists()) {
        println("File not found: $filePath")
        return null
    }

    val json = file.readText()
    return jsonAdapter.fromJson(json)
}
```

### 4. Utilize Data

Practical example of calling and using data:

```kotlin
fun main() {
    val provinces = readProvincesFromFile("dist/json/provinces.json")

    provinces?.forEach { println(it) } ?: println("Failed to load provinces data.")
}
```
