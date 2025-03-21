# راهنمای استفاده از فایل JSON برای فهرست شهرهای ایران به تفکیک استان در پروژه Next.js 15 (App Router)

در این راهنما، به صورت حرفه‌ای روش استفاده از **فهرست شهرهای ایران** در یک پروژه Next.js 15 با ساختار App Router توضیح داده شده است. فایل `provinces.json` که در مسیر `dist/json` قرار دارد، شامل داده‌های ساختاریافته‌ی استان‌ها و شهرهای ایران است و می‌توان از آن در Server Components یا API Routeهای داخل دایرکتوری `app` استفاده کرد.

## مراحل

### 1. پیکربندی TypeScript برای پشتیبانی از JSON

در فایل `tsconfig.json` خود، گزینه‌های زیر را فعال کنید:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "target": "ES2022"
  }
}
```

### 2. استفاده از JSON در یک Server Component (دایرکتوری `app`)

در مسیر `app/provinces/page.tsx` فایل زیر را ایجاد کنید:

```tsx
import provinces from '@/dist/json/provinces.json';

type Province = {
  id: number;
  name: string;
  slug: string;
  tel_prefix: string;
};

export default function ProvincesPage() {
  return (
    <main>
      <h1>فهرست استان‌ها</h1>
      <ul>
        {(provinces as Province[]).map((province) => (
          <li key={province.id}>
            {province.name} ({province.tel_prefix})
          </li>
        ))}
      </ul>
    </main>
  );
}
```

> **توجه:** مسیر `@/dist/json/provinces.json` بسته به تنظیمات alias شما در `tsconfig.json` ممکن است نیاز به اصلاح داشته باشد.

### 3. استفاده در Route Handler (دایرکتوری `app/api`)

در مسیر `app/api/provinces/route.ts` فایل زیر را ایجاد کنید:

```ts
import { NextResponse } from 'next/server';
import provinces from '@/dist/json/provinces.json';

export async function GET() {
  return NextResponse.json(provinces);
}
```

---

## Guide to Using JSON File for Iranian Cities by Province in a Next.js 15 (App Router) Project

This professional guide explains how to use a **list of Iranian provinces and cities** in a Next.js 15 project using the App Router structure. The `provinces.json` file located in the `dist/json` directory contains structured data suitable for use in server components or API routes.

## Steps

### 1. Configure TypeScript to Support JSON

Enable the following options in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "target": "ES2022"
  }
}
```

### 2. Use JSON in a Server Component (inside `app` directory)

Create the file at `app/provinces/page.tsx`:

```tsx
import provinces from '@/dist/json/provinces.json';

type Province = {
  id: number;
  name: string;
  slug: string;
  tel_prefix: string;
};

export default function ProvincesPage() {
  return (
    <main>
      <h1>List of Provinces</h1>
      <ul>
        {(provinces as Province[]).map((province) => (
          <li key={province.id}>
            {province.name} ({province.tel_prefix})
          </li>
        ))}
      </ul>
    </main>
  );
}
```

> **Note:** Adjust the `@/dist/json/provinces.json` import path according to your `tsconfig.json` alias configuration.

### 3. Use JSON in an API Route (Route Handler in `app/api`)

Create the file at `app/api/provinces/route.ts`:

```ts
import { NextResponse } from 'next/server';
import provinces from '@/dist/json/provinces.json';

export async function GET() {
  return NextResponse.json(provinces);
}
```
