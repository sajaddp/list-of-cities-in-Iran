import { AllInterface } from ".";

export function normalizePersianText(text: string): string {
  if (!text) return ""; // بررسی مقدار خالی

  return (
    text
      .replace(/ي/g, "ی") // ي → ی
      .replace(/ك/g, "ک") // ك → ک
      .replace(/ة/g, "ه") // ة → ه
      .replace(/ؤ/g, "و") // ؤ → و
      // .replace(/ئ/g, "ی")   // ئ → ی
      .replace(/ۀ/g, "ه") // ۀ → ه
      .replace(/۰/g, "0") // اصلاح اعداد عربی
      .replace(/١/g, "1")
      .replace(/٢/g, "2")
      .replace(/٣/g, "3")
      .replace(/٤/g, "4")
      .replace(/٥/g, "5")
      .replace(/٦/g, "6")
      .replace(/٧/g, "7")
      .replace(/٨/g, "8")
      .replace(/٩/g, "9")
      .replace(/[^\w\s\u0600-\u06FF]/g, "") // حذف کاراکترهای غیرمجاز
      // .replace(/\u200C/g, " ") // حذف نیم‌فاصله
      .trim()
  ); // حذف فاصله‌های اضافی
}

export const sortAllInterfaceArray = (data: AllInterface[]): AllInterface[] => {
  const typeOrder: Record<AllInterface["type"], number> = {
    province: 1,
    county: 2,
    city: 3,
    district: 4,
    rural: 5,
  };

  return data.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
};
