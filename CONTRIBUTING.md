# راهنمای مشارکت در پروژه

از مشارکت شما در این پروژه صمیمانه استقبال می‌کنیم. لطفاً پیش از ارسال هرگونه درخواست تغییر، این راهنما را با دقت مطالعه کنید تا با فرآیند استاندارد مشارکت آشنا شوید.

## نحوه مشارکت

1. **فورک کردن مخزن اصلی**  
   ابتدا مخزن اصلی را فورک کنید تا یک نسخهی کپی‌شده از آن در حساب کاربری شما ایجاد شود.

2. **ایجاد شاخهی مجزا برای تغییرات**  
   در مخزن فورک‌شده، یک شاخهی جدید برای تغییرات خود ایجاد کنید:

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **اعمال تغییرات موردنظر**  
   کد خود را مطابق با استانداردهای پروژه و به صورت تمیز و خوانا تغییر دهید.

4. **بررسی و کامیت تغییرات**  
   پس از اعمال تغییرات، آن‌ها را بررسی کرده و با پیامی واضح و دقیق کامیت کنید:

   ```bash
   git commit -m "Add: [شرح مختصر تغییر انجام‌شده]"
   ```

5. **پوش کردن به مخزن فورک‌شده**  
   تغییرات خود را به شاخهی ایجادشده در مخزن فورک‌شده پوش کنید:

   ```bash
   git push origin feature/YourFeatureName
   ```

6. **ایجاد Pull Request (PR)**  
   در گیت‌هاب، از شاخهی خود یک Pull Request به شاخهی اصلی مخزن پروژه ایجاد کرده و در توضیحات آن، هدف و جزئیات تغییرات را بنویسید.

## قوانین و الزامات مشارکت

- کد شما باید مطابق با الگوی کدنویسی تعریف‌شده در پروژه باشد.
- قبل از ارسال Pull Request اطمینان حاصل کنید که همهی تست‌ها با موفقیت پس شده‌اند.
- پیام‌های کامیت باید روشن، مختصر و منطقی باشند.
- از ایجاد تغییرات نامرتبط با موضوع شاخه خودداری کنید.
- در صورت نیاز، مستندات مرتبط با تغییرات خود را به‌روزرسانی نمایید.

## گزارش مشکلات (Issues)

در صورت مواجهه با باگ، نقص عملکرد یا پیشنهاد ویژگی جدید، لطفاً یک Issue جدید باز کرده و شرح دقیقی از مشکل یا پیشنهاد ارائه دهید. درج مراحل بازتولید مشکل (در صورت وجود) کمک بزرگی به رفع سریع‌تر آن خواهد کرد.

---

## Contribution Guidelines

We sincerely welcome your contributions to this project. Before submitting any changes, please carefully read this guide to understand the standard contribution process.

## How to Contribute

1. **Fork the main repository**  
   Start by forking the main repository to create a copy under your own GitHub account.

2. **Create a dedicated branch for your changes**  
   In your forked repository, create a new branch specifically for your changes:

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Apply your intended changes**  
   Modify the code according to the project's standards, keeping it clean and readable.

4. **Review and commit changes**  
   After making your changes, review them and commit with a clear and meaningful message:

   ```bash
   git commit -m "Add: [Short description of the changes made]"
   ```

5. **Push to the forked repository**  
   Push your changes to the newly created branch in your forked repository:

   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Create a Pull Request (PR)**  
   On GitHub, open a Pull Request from your branch to the main branch of the project repository. Clearly describe the purpose and details of your changes.

## Contribution Rules and Requirements

- Ensure that your code follows the project's coding conventions and style.
- Make sure all tests pass successfully before submitting a Pull Request.
- Commit messages must be
