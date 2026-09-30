# Chat Erdogan

واجهة أولية قابلة للتشغيل لمنصة تجار عربية (RTL) باستخدام React + Vite + Supabase.

## الوظائف في هذه النسخة
- واجهة عربية داكنة بالأسود والأزرق ومتجاوبة للموبايل.
- تسجيل دخول Supabase.
- شاشة طلبات / عروض (عامة) وتحديث مباشر عبر Supabase Realtime.
- إنشاء منشور نصي بسيط بعد تسجيل الدخول.
- صفحة حساب وإعدادات شكلية كبداية.

## قبل التشغيل
تحتاج Node.js وبيئة Supabase. لا تضع `service_role` key في الواجهة أبدًا.

1. أنشئ مشروعًا في https://supabase.com
2. من SQL Editor شغّل الملف `schema.sql`.
3. من إعدادات المشروع انسخ Project URL و `anon`/publishable key.
4. أنشئ `.env` من `.env.example` وأدخل القيم.
5. من Authentication > URL Configuration أضف رابط موقعك إلى Site URL و Redirect URLs.
6. أنشئ أول مستخدم من Supabase Auth، ثم اجعل حسابك Owner يدويًا من SQL Editor بعد التأكد من البريد:
   ```sql
   update public.profiles
   set role = 'owner', status = 'active'
   where id = (select id from auth.users where email = 'YOUR_EMAIL_HERE');
   ```
   لا تجعل أي واجهة عامة تسمح للمستخدم بتعيين دوره بنفسه.
7. شغّل:
   ```bash
   npm install
   npm run dev -- --host 0.0.0.0
   ```

## رفعه من الموبايل إلى GitHub
- نزّل ملف ZIP وفك ضغطه في مدير الملفات.
- افتح https://github.com/new وأنشئ Repository جديدًا باسم `chat-erdogan`.
- ارفع محتويات المجلد إلى الريبو الجديد (وليس ملف ZIP فقط إذا أردت استعراض الملفات).
- لا ترفع `.env` أو أي مفاتيح سرية.

## حدود هذه النسخة
هذه بداية عملية وليست جاهزة للإطلاق التجاري. لوحة الأونر، طلبات التسجيل، الرسائل الخاصة، طلبات التوثيق، الإنذارات، الحظر، إشعارات Push، ورفع الصور تحتاج استكمال واجهاتها واختبارها. مخطط SQL يتضمن جداول وسياسات أولية، لكن يجب إجراء مراجعة أمنية واختبارات قبل استخدام بيانات تجارية حقيقية.
