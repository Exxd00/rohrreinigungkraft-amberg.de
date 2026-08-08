# الحملة النهائية المصححة - Rohrreinigung Kraft (Amberg)

## ⚠️ ملاحظة: هذه نسخة معدّلة جغرافياً من حملة نورنبرغ الأصلية، موجهة الآن إلى Amberg
والمناطق المحيطة (Oberpfalz) بدلاً من نورنبرغ/فورت/إرلانغن. الحساب ورقم الهاتف هما
نفس الشركة الحقيقية (نفس Google Ads Account: 789-424-2096).

## ما تم تصحيحه:

### ❌ قبل (الأخطاء):
| المشكلة | الخطأ |
|---------|-------|
| عدد الحملات | 20 حملة (تشتت) |
| الأسعار | 79€, 89€, 149€ (محددة) |
| الضمان | 90 يوم (غير واقعي) |
| الإيموجي | ⚠️🚨🆘 (مرفوض من Google) |
| Headlines | 15 (كثيرة ومكررة) |

### ✅ بعد (التصحيح):
| التحسين | الجديد |
|---------|--------|
| عدد الحملات | 4 حملات مركزة |
| الأسعار | "Festpreis" بدون أرقام |
| الضمان | "Garantie" عام |
| الإيموجي | لا يوجد |
| Headlines | 8 مركزة وواضحة |

---

## الحملات النهائية (4 فقط):

### 1. Notdienst Verstopfung
- **الهدف:** حالات الطوارئ
- **الميزانية:** €80/يوم
- **الكلمات:** rohr verstopft, toilette verstopft, abfluss verstopft

### 2. Preisanfragen
- **الهدف:** الباحثين عن أسعار
- **الميزانية:** €40/يوم
- **الكلمات:** rohrreinigung kosten, rohrreinigung festpreis

### 3. Lokal Amberg
- **الهدف:** البحث المحلي في Amberg والمنطقة
- **الميزانية:** €50/يوم
- **الكلمات:** rohrreinigung amberg, notdienst amberg

### 4. B2B Hausverwaltung
- **الهدف:** إدارات العقارات
- **الميزانية:** €30/يوم
- **الكلمات:** rohrreinigung hausverwaltung

---

## الميزانية الإجمالية:
```
€80 + €40 + €50 + €30 = €200/يوم
= €6,000/شهر
```

---

## الملفات للرفع:
1. `01_campaigns_FINAL.csv` - الحملات
2. `03_adgroups_FINAL.csv` - المجموعات الإعلانية
3. `04_keywords_FINAL.csv` - الكلمات المفتاحية
4. `05_negative_keywords_FINAL.csv` - الكلمات السلبية
5. `06_ads_FINAL.csv` - الإعلانات

بالإضافة إلى (على مستوى الحساب/الحملة): `02_campaign_location_targets.csv`،
`07_sitelinks.csv`، `08_callouts.csv`، `09_structured_snippets.csv`،
`10_call_extensions.csv`.

---

## قواعد الإعلانات المصححة:

### ✅ صحيح:
- "Festpreis vor Arbeitsbeginn" (بدون رقم)
- "Diagnose kostenlos"
- "Garantie inklusive" (بدون مدة محددة)
- "Lokaler Meisterbetrieb"
- "Ueber 100 Bewertungen"

### ❌ خطأ (تجنب):
- أسعار محددة (79€, 89€)
- ضمانات طويلة (90 يوم)
- إيموجي (⚠️🚨)
- وعود مبالغ فيها

---

## كيفية الرفع لـ Google Ads:

1. افتح Google Ads Editor
2. File > Import > From CSV
3. اختر الملفات بالترتيب:
   - 01_campaigns_FINAL.csv
   - 03_adgroups_FINAL.csv
   - 04_keywords_FINAL.csv
   - 05_negative_keywords_FINAL.csv
   - 06_ads_FINAL.csv
4. راجع التغييرات
5. Post Changes

---

## ملاحظات مهمة:

1. **الأسعار:** لا تذكر أسعار محددة - استخدم "Festpreis" فقط
2. **الضمان:** قل "Garantie" بدون تحديد المدة
3. **الوقت:** يوجد الآن فرع حقيقي في Amberg، لذلك الوقت الحقيقي سريع محلياً:
   "In 20-40 Min da" (وقت وصول واقعي وسريع بفضل الفرع المحلي).
4. **التقييمات:** "Ueber 100" بدلاً من رقم دقيق
5. **Location IDs:** معرّفات الاستهداف الجغرافي في
   `src/app/api/google-ads/campaigns/route.ts` لا تزال فارغة (TODO) — يجب
   البحث عنها عبر Google Ads API قبل استخدام لوحة التحكم الداخلية.
