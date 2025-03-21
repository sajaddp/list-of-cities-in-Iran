# راهنمای استفاده از فایل JSON برای فهرست شهرهای ایران به تفکیک استان در TypeScript

در این راهنما، به صورت حرفه‌ای روش استفاده از **فهرست شهرهای ایران** در یک پروژه TypeScript توضیح داده شده است. برای این منظور، فایل `provinces.json` از مسیر `dist/json` استفاده می‌شود. این فایل شامل داده‌های ساختاریافته استان‌ها و شهرهای ایران بوده و در پروژه‌های Node.js، API محور یا واسط کاربری (UI) قابل استفاده است.

## مراحل

### 1. تنظیم TypeScript برای خواندن فایل JSON

در فایل `tsconfig.json`، گزینه‌های زیر را فعال کنید:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "target": "ES2020"
  }
}
```

### 2. ایجاد فایل TypeScript و ایمپورت داده‌ها

می‌توانید فایل JSON را مستقیماً ایمپورت کرده و استفاده کنید:

```ts
import provinces from "./dist/json/provinces.json";

type Province = {
  id: number;
  name: string;
  slug: string;
  tel_prefix: string;
};

(provinces as Province[]).forEach((province) => {
  console.log(`${province.name} (${province.tel_prefix})`);
});
```

> **نکته:** مطمئن شوید فایل `provinces.json` در زمان کامپایل در دسترس باشد یا از ابزارهایی مانند `webpack` یا `ts-node` استفاده می‌کنید.

---

## Guide to Using JSON File for Iranian Cities by Province in TypeScript

This professional guide explains how to use a JSON file containing the list of **Iranian provinces and cities** in a TypeScript project. The file `provinces.json`, located in the `dist/json` directory, contains structured data suitable for use in Node.js, backend services, or frontend applications.

## Steps

### 1. Configure TypeScript to Read JSON

In your `tsconfig.json`, enable the following options:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "target": "ES2020"
  }
}
```

### 2. Import and Use JSON Data

You can directly import the JSON file and use its contents:

```ts
import provinces from "./dist/json/provinces.json";

type Province = {
  id: number;
  name: string;
  slug: string;
  tel_prefix: string;
};

(provinces as Province[]).forEach((province) => {
  console.log(`${province.name} (${province.tel_prefix})`);
});
```

> **Note:** Ensure the `provinces.json` file is available at compile/runtime, especially when using tools like `webpack`, `ts-node`, or other build pipelines.
