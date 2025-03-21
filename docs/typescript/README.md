# نحوه فراخوانی فایل JSON برای فهرست شهرهای ایران در تایپ‌اسکریپت

اگه می‌خوای **فهرست شهرهای ایران** رو توی پروژه تایپ‌اسکریپت استفاده کنی، این راهنما دقیقا به کارت میاد. در این آموزش، نحوه‌ی فراخوانی فایل `provinces.json` از مسیر `dist/json` و استفاده ازش داخل کد TypeScript رو توضیح می‌دیم. این فایل شامل داده‌های ساختاریافته استان‌ها و شهرهای ایرانه که می‌تونی به راحتی تایپ‌دهی و استفاده‌شون کنی.

## روش استفاده

1. ابتدا باید تنظیمات `tsconfig.json` را به‌روزرسانی کنید تا امکان وارد کردن فایل‌های JSON فراهم شود. برای این کار، مقدار `resolveJsonModule` را به `true` تغییر دهید:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

2. سپس یک اینترفیس برای ساختار داده‌های JSON تعریف کنید. به عنوان مثال، اگر فایل `provinces.json` شامل لیستی از استان‌ها باشد، می‌توانید اینترفیس زیر را تعریف کنید:

```typescript
interface Province {
  id: number;
  name: string;
}
```

3. در نهایت، فایل JSON را وارد کرده و از آن استفاده کنید:

```typescript
import provinces from "../dist/json/provinces.json";

const getProvinces = (): Province[] => {
  return provinces;
};

console.log(getProvinces());
```

## How to Import a JSON File in TypeScript

To import a JSON file from the `dist/json` directory and use it in TypeScript, follow these steps:

1. First, update the `tsconfig.json` settings to enable importing JSON files. Set the `resolveJsonModule` option to `true`:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

2. Next, define an interface for the structure of the JSON data. For example, if the `provinces.json` file contains a list of provinces, you can define the following interface:

```typescript
interface Province {
  id: number;
  name: string;
}
```

3. Finally, import the JSON file and use it:

```typescript
import provinces from "../dist/json/provinces.json";

const getProvinces = (): Province[] => {
  return provinces;
};

console.log(getProvinces());
```
