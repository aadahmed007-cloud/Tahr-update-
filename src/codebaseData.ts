export interface CodeFile {
  id: string;
  name: string;
  path: string;
  language: string;
  descriptionArabic: string;
  category: 'database' | 'api' | 'auth' | 'config';
  code: string;
}

export const TAHER_CODEBASE: CodeFile[] = [
  {
    id: 'prisma-schema',
    name: 'Prisma Schema',
    path: 'prisma/schema.prisma',
    language: 'prisma',
    category: 'database',
    descriptionArabic: 'هيكل قاعدة البيانات (Prisma Schema) الخاص بشركة طاهر للتطوير العقاري. يحتوي على جداول المشرفين (Admin)، المشاريع العقارية (Projects)، ورسائل العملاء (Leads). يدعم العلاقات ونوع البيانات الفريدة مع ترميز دقيق لكل حقل.',
    code: `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // يمكن تغيير المزود إلى mysql أو db2 أو sqlite أو mongodb
  url      = env("DATABASE_URL")
}

// 1. جدول مدراء النظام (إدارة لوحة التحكم)
model Admin {
  id        String   @id @default(uuid())
  username  String   @unique                 // اسم المستخدم الفريد لتسجيل الدخول
  password  String                           // كلمة المرور المشفرة (BCrypt)
  name      String                           // الاسم الكامل للمسؤول
  role      String   @default("ADMIN")       // الصلاحية
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 2. جدول المشاريع العقارية
model Project {
  id          String   @id @default(uuid())
  title       String                           // اسم الـمشروع العقاري
  location    String                           // الـموقع الجغرافي / الـمدينة
  price       Float                            // سـعر الـعقار
  area        Float                            // مـساحة الـعقار بـالـمتر الـمربع
  description String   @db.Text                // الـوصف الـتفصيلي للـمشروع
  imageUrl    String                           // رابـط الـصورة الـرئيسية للـمشروع
  featured    Boolean  @default(false)         // هل الـمشروع مميز ليظهر في الواجهة؟
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 3. جدول طـلبات الـعملاء ورسـائل الـتواصل
model Lead {
  id        String   @id @default(uuid())
  name      String                           // اسم العميل الـراسل
  phone     String                           // رقم هاتف الـعميل
  message   String   @db.Text                // نص رسالته واستفساره
  createdAt DateTime @default(now())
  status    String   @default("NEW")         // حالة الـطلب (NEW, CONTACTED, ARCHIVED)
}`
  },
  {
    id: 'api-contact',
    name: 'Contact API',
    path: 'app/api/contact/route.js',
    language: 'javascript',
    category: 'api',
    descriptionArabic: 'مسار الـ API لاستقبال رسائل العملاء واستمارات المهتمين (Leads) من الموقع العام وتحليلها وحفظها في قاعدة البيانات مع تدقيق وضمان سلامة المدخلات وخلوها من المخاطر البرمجية.',
    code: `import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// استقبال طلبات استمارة التواصل (تنزيل الـ Leads المهتمين بالمشاريع)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;

    // 1. التحقق من توفر جميع الحقول الأساسية
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'من فضلك قم بتعبئة جميع الحقول المطلوبة (الاسم، الهاتف، الرسالة).' },
        { status: 400 }
      );
    }

    // 2. تدقيق أطوال البيانات المدخلة لمنع الإدخال العشوائي
    if (name.trim().length < 3) {
      return NextResponse.json(
        { error: 'الاسم غامض جداً، يرجى إدخال الاسم الثلاثي أو الثنائي على الأقل (3 أحرف فأكثر).' },
        { status: 400 }
      );
    }

    if (phone.trim().length < 8) {
      return NextResponse.json(
        { error: 'رقم الهاتف يبدو غير مكتمل، يجب ألا يقل عن 8 أرقام.' },
        { status: 400 }
      );
    }

    // 3. إدراج السجل في قاعدة البيانات بأمان تام
    const newLead = await prisma.lead.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
        status: 'NEW' // تحديد حالة الطلب بأنه جديد لفرزه في لوحة التحكم الإدارية
      }
    });

    // 4. إرجاع رسالة النجاح والبيانات لصفحة العميل
    return NextResponse.json(
      { 
        success: true, 
        message: 'تم استلام بياناتك بنجاح تام! سيقوم مستشار شركة طاهر للتطوير العقاري بالتواصل معك خلال 24 ساعة.',
        id: newLead.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('SERVER CONTACT API ERROR:', error);
    return NextResponse.json(
      { error: 'عذراً، حدث خطأ غير متوقع أثناء إرسال طلبك. يرجى إعادة المحاولة برقم هاتف آخر أو لاحقاً.' },
      { status: 500 }
    );
  }
}`
  },
  {
    id: 'api-projects',
    name: 'Projects API (Main)',
    path: 'app/api/projects/route.js',
    language: 'javascript',
    category: 'api',
    descriptionArabic: 'مسار الإدارة الرئيسي للمشاريع. يتيح للعامة جلب المشاريع لعرضها في الموقع، ويمنح المشرف (Admin) فقط صلاحية إضافة مشروع جديد بعد التحقق من توقيع تشفير الجلسة (JWT) الخاص به.',
    code: `import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'taher-fallback-super-secret-key-2026');

// 1. مسار جلب المشاريع (متاح للجميع لمشاهدة مشاريع شركة طاهر للتطوير العقاري)
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, count: projects.length, projects }, { status: 200 });
  } catch (error) {
    console.error('GET PROJECTS ERROR:', error);
    return NextResponse.json({ error: 'ลحدث خطأ أثناء جلب المشاريع العقارية.' }, { status: 500 });
  }
}

// 2. مسار إضافة مشروع جديد (يسمح فقط للمشرف المصرح له بعد التحقق من الـ JWT)
export async function POST(request) {
  try {
    // التحقق من صلاحية المشرف عبر فحص الـ JWT في الـ Cookies
    const tokenCookie = request.cookies.get('taher_admin_token');
    if (!tokenCookie) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً كمسؤول للنظام.' }, { status: 401 });
    }

    try {
      // فحص توقيع وتوقيت صلاحية الـ JWT
      await jwtVerify(tokenCookie.value, JWT_SECRET);
    } catch (authError) {
      return NextResponse.json({ error: 'انتهت صلاحية جلستك أو الرمز غير صالح الرقمي، يرجى تسجيل الدخول مجدداً.' }, { status: 401 });
    }

    // قراءة البيانات من جسم الطلب
    const body = await request.json();
    const { title, location, price, area, description, imageUrl, featured } = body;

    // التحقق من صحة واكتمال المدخلات
    if (!title || !location || price == null || area == null || !description || !imageUrl) {
      return NextResponse.json({ error: 'كافة المدخلات الفنية للمشروع مطلوبة (العنوان، الموقع، السعر، المساحة، الوصف، الصورة).' }, { status: 400 });
    }

    // إدراج المشروع الجديد في قاعدة البيانات
    const newProject = await prisma.project.create({
      data: {
        title: title.trim(),
        location: location.trim(),
        price: parseFloat(price),
        area: parseFloat(area),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        featured: !!featured
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تمت إضافة المشروع العقاري في نظام شركة طاهر للتطوير العقاري بنجاح!',
      project: newProject
    }, { status: 201 });

  } catch (error) {
    console.error('POST PROJECT ERROR:', error);
    return NextResponse.json({ error: 'عذراً، حدث خطأ داخلي فادح عند محاولة إنشاء المشروع.' }, { status: 500 });
  }
}`
  },
  {
    id: 'api-projects-id',
    name: 'Project Details & Delete API',
    path: 'app/api/projects/[id]/route.js',
    language: 'javascript',
    category: 'api',
    descriptionArabic: 'المسار الفرعي للتعامل مع مشروع عقاري محدد بواسطة المعرّف (ID)، مما يسمح للوحة التحكم بتحديث بيانات المشروع (PUT) أو حذفه بالكامل (DELETE) بأقصى معايير الأمان وجواز التحقق.',
    code: `import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'taher-fallback-super-secret-key-2026');

// دالة وسيطة داخلية للتحقق المستقل في المسارات الإدارية الخاصة بالتعديل والحذف
async function verifyAdminAuth(request) {
  const tokenCookie = request.cookies.get('taher_admin_token');
  if (!tokenCookie) throw new Error('Unauthenticated');
  await jwtVerify(tokenCookie.value, JWT_SECRET);
}

// 1. جلب مشروع عقاري واحد بالتفصيل عبر الـ ID الخاص به
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const project = await prisma.project.findUnique({
      where: { id: id }
    });

    if (!project) {
      return NextResponse.json({ error: 'عذراً، هذا المشروع لم يعد متوفراً أو قد تم حذفه مسبقاً.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ تقني في جلب تفاصيل المشروع.' }, { status: 500 });
  }
}

// 2. تعديل وتحديث بيانات مشروع عقاري قائم (PUT)
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    // فحص تصريح المسؤول
    try {
      await verifyAdminAuth(request);
    } catch (e) {
      return NextResponse.json({ error: 'غير مصرح لك بتحديث بيانات مشاريع شركة طاهر العقارية.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, location, price, area, description, imageUrl, featured } = body;

    // فحص توفر المشروع في قاعدة البيانات
    const exists = await prisma.project.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json({ error: 'المشروع المراد تعديله غير موجود بالخادم.' }, { status: 404 });
    }

    // تحديث السجل في داتا بيس
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : exists.title,
        location: location !== undefined ? location.trim() : exists.location,
        price: price !== undefined ? parseFloat(price) : exists.price,
        area: area !== undefined ? parseFloat(area) : exists.area,
        description: description !== undefined ? description.trim() : exists.description,
        imageUrl: imageUrl !== undefined ? imageUrl.trim() : exists.imageUrl,
        featured: featured !== undefined ? !!featured : exists.featured,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث مواصفات العقار بنجاح تام!',
      project: updatedProject
    });

  } catch (error) {
    console.error('PUT PROJECT API ERROR:', error);
    return NextResponse.json({ error: 'فشل تعديل المشروع لوجود مشاكل فنية بالخادم.' }, { status: 500 });
  }
}

// 3. حذف مشروع عقاري نهائياً من قاعدة البيانات (DELETE)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // تأكيد هوية المسؤول
    try {
      await verifyAdminAuth(request);
    } catch (e) {
      return NextResponse.json({ error: 'أنت لا تملك الأذن بحذف سجلات شركة طاهر للتطوير العقاري.' }, { status: 401 });
    }

    const exists = await prisma.project.findUnique({ where: { id } });
    if (!exists) {
      return NextResponse.json({ error: 'المشروع مستهدف للحذف غير مسجل بالفعل بالدورة الزمنية.' }, { status: 404 });
    }

    // الحذف الفعلي من قاعدة البيانات
    await prisma.project.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'تمت إزالة وحذف السجل العقاري من النظام بنجاح.'
    });

  } catch (error) {
    console.error('DELETE PROJECT API ERROR:', error);
    return NextResponse.json({ error: 'فشل حذف المشروع لوجود مشكلة تقنية بقاعدة البيانات.' }, { status: 500 });
  }
}`
  },
  {
    id: 'api-login',
    name: 'Admin Auth API',
    path: 'app/api/auth/login/route.js',
    language: 'javascript',
    category: 'auth',
    descriptionArabic: 'مسار تأكيد الهوية وتسجيل دخول الأدمن. يتحقق من الاسم السليم وقفل التشفير، وينتج رمز الجلسة (JWT) ثم يحفظه في ملفات الارتباط (HTTP-Only Secure Cookies) المشفرة من جهة الخادم لمنع هجمات الاختطاف وسرقة الجلسات.',
    code: `import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'taher-fallback-super-secret-key-2026');

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 1. تدقيق المدخلات الأولية
    if (!username || !password) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم المسؤول ورمز المرور السري.' },
        { status: 400 }
      );
    }

    // 2. البحث عن المشرف في قاعدة البيانات بفضل Prisma
    const admin = await prisma.admin.findUnique({
      where: { username: username.toLowerCase().trim() }
    });

    if (!admin) {
      // إرجاع رسالة موحدة مضللة للمخترقين لدواعي السلامة والأمن
      return NextResponse.json(
        { error: 'تأكد من صحة اسم المسؤول أو الرقم التسلسلي السري.' },
        { status: 401 }
      );
    }

    // 3. التحقق من مطابقة كلمة المرور المشفرة بـ BCrypt
    const isMatched = await bcrypt.compare(password, admin.password);
    if (!isMatched) {
      return NextResponse.json(
        { error: 'تأكد من صحة اسم المسؤول أو الرقم التسلسلي السري.' },
        { status: 401 }
      );
    }

    // 4. توليد شهادة الجلسة المشفرة JWT بمدة صلاحية 24 ساعة
    const token = await new SignJWT({ 
      id: admin.id, 
      username: admin.username,
      name: admin.name,
      role: admin.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // تنتهي الجلسة بعد يوم واحد تلقائياً للحماية
      .sign(JWT_SECRET);

    // 5. تهيئة الاستجابة وتثبيت الكوكي الآمن HTTP-Only
    const response = NextResponse.json({
      success: true,
      message: 'مرحباً بك مجدداً في الإدارة لشركة طاهر العقارية!',
      admin: {
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });

    // تعيين الكوكي بمعايير أمنية صارمة
    response.cookies.set({
      name: 'taher_admin_token',
      value: token,
      httpOnly: true, // يمنع قراءة الكوكي عبر الـ JavaScript (مقاوم لـ XSS)
      secure: process.env.NODE_ENV === 'production', // يعمل فقط على HTTPS في الإنتاج
      sameSite: 'strict', // يمنع ثغرات تزوير الطلبات العابرة للمواقع (CSRF)
      maxAge: 60 * 60 * 24, // 24 ساعة بالثواني
      path: '/' // صالح لكافة مسارات الموقع الخلفية
    });

    return response;

  } catch (error) {
    console.error('ADMIN SIGNIN API ERROR:', error);
    return NextResponse.json(
      { error: 'خطأ برمجي داخلي عند مصادقة الجلسة.' },
      { status: 500 }
    );
  }
}`
  },
  {
    id: 'api-logout',
    name: 'Admin Logout API',
    path: 'app/api/auth/logout/route.js',
    language: 'javascript',
    category: 'auth',
    descriptionArabic: 'مسار لتسجيل خروج المسؤول من لوحة التحكم، يقوم بتدمير ملف الارتباط الإلكتروني (Secure HTTP-Only Cookie) وحذف الشهادة الأمنية لإنهاء الجلسة فوراً لمنع التسلل اللاحق لجهاز العمل.',
    code: `import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج من نظام إدارة شركة طاهر للتطوير العقاري بنجاح.'
    });

    // تدمير الكوكي بتعيين تاريخ منتهي الصلاحية فوراً
    response.cookies.set({
      name: 'taher_admin_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // تاريخ قديم يضمن الحذف الفوري من متصفح العميل
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'فشل في إلغاء تفعيل الجلسة الأمنية.' }, { status: 500 });
  }
}`
  },
  {
    id: 'middleware',
    name: 'Next.js Middleware',
    path: 'middleware.js',
    language: 'javascript',
    category: 'auth',
    descriptionArabic: 'كود الحقول الوسيطة (Global Middleware) الذي يقوم بحراسة وتوجيه مسارات الإدارة ومسارات الإضافة والحذف الحساسة تلقائياً. يمنع أي شخص غير مسجل الدخول من الولوج لصفحات المسؤول ويعيد تحويلهم فورياً لصفحة الدخول العام.',
    code: `import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// مفتاح التوقيع المشترك (يجب أن يطابق المدخل بملف .env.local)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'taher-fallback-super-secret-key-2026');

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // استخراج الكوكي الإداري المأمن
  const token = request.cookies.get('taher_admin_token')?.value;

  // 1. حماية صفحات لوحة التحكم الإدارية بالكامل (/admin/dashboard وما يتبعها)
  if (pathname.startsWith('/admin/dashboard')) {
    if (!token) {
      // توجيه المستخدم تلقائياً لصفحة تسجيل الدخول إذا لم يتوفر لديه رمز الهوية
      const loginUrl = new URL('/admin/login', request.url);
      // حفظ الصفحة التي كان يحاول زيارتها ليعود إليها لاحقاً بعد النجاح
      loginUrl.searchParams.set('callbackUrl', pathname); 
      return NextResponse.redirect(loginUrl);
    }

    try {
      // التحقق من صحة وصلاحية الرمز
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next(); // السماح للمسؤول بالمرور الآمن للوحة التحكم
    } catch (err) {
      // الرمز منتهي أو معدل عليه، مسح الرمز وإعادة توجيهه للوجين مجدداً
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('taher_admin_token');
      return response;
    }
  }

  // 2. حماية مسارات الـ API الإدارية (مثل الإضافة والتعديل والحذف ما عدا الـ GET للمشاهدين)
  if (pathname.startsWith('/api/projects')) {
    const isWriteMethod = ['POST', 'PUT', 'DELETE'].includes(request.method);
    if (isWriteMethod) {
      if (!token) {
        return NextResponse.json({ error: 'عذراً، هذا الإجراء مسموح به لمدراء شركة طاهر العقارية فقط.' }, { status: 401 });
      }
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
      } catch (err) {
        return NextResponse.json({ error: 'انتهت دورتك الإدارية الآمنة، يُرجى تجديد الدخول مجدداً.' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

// تحديد القنوات والمسارات التي يطبق عليها الـ Middleware الحارس تلقائياً لتوفير موارد الخادم
export const config = {
  matcher: [
    '/admin/dashboard/:path*', // مراقبة كافة المجلدات الداخلية للوحة التحكم
    '/api/projects/:path*',    // مراقبة مسارات مشاريع السيرفر
  ],
};`
  },
  {
    id: 'admin-login-page',
    name: 'Admin Login Connection Page',
    path: 'app/admin/login/page.js',
    language: 'javascript',
    category: 'auth',
    descriptionArabic: 'كود الصفحة الأمامية لتسجيل الدخول كأدمن بصفة حقيقية. يتكامل بالكامل مع مسار الـ API الذي تم بناؤه، ويقوم بإدارة نماذج الاتصال وعرض تنبيهات الأخطاء أو توجيهه للوحة تحكم شركة طاهر بنجاح وثبات.',
    code: `"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ غير متوقع أثناء الدخول.');
      }

      // في حال النجاح، الكوكي تم تعيينه تلقائياً بصيغة httpOnly من السيرفر
      // نقوم بتوجيه المستخدم للوحة الإدارة أو لصفحته السابقة
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err.message || 'فشل الاتصال بالخادم، يرجى التحقق من الشبكة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 dir-rtl text-right font-sans" style={{ direction: 'rtl' }}>
      <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8">
        
        {/* ترويسة الشعار */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20">
            🏢
          </div>
          <h1 className="text-2xl font-bold text-white">بوابة كبار المسؤولين</h1>
          <p className="text-slate-400 text-sm mt-1">تطوير شركة طاهر للتطوير العقاري</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
            ⚠️ <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm mb-2 font-medium">اسم المشرف (الأدمن)</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="مثال: taher_admin"
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-right transition"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2 font-medium">كلمة المرور السرية</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-right transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-emerald-950/50 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? 'جاري التحقق والمصادقة...' : 'تسجيل دخول آمن'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          محمي بتشفير خادم طوي الجلسة والبرمجة الصارمة &copy; 2026
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: 'api-upload',
    name: 'Image Upload API',
    path: 'app/api/upload/route.js',
    language: 'javascript',
    category: 'api',
    descriptionArabic: 'مسار الـ API المكمل لتأمين واستقبال الصور والمرفقات من الأجهزة المحلية للمستخدمين. يقرأ البيانات الثنائية (Binary FormData)، يتحقق من امتدادات الصور الرسمية والحد المسموح للمساحة وحفظها في مجلد المرفقات مع توفير حلول التخزين السحابي للإنتاج.',
    code: `import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'taher-fallback-super-secret-key-2026');

// مسار استقبال ورفع صور العقارات وإعدادات لوحة التحكم
export async function POST(request) {
  try {
    // 1. فحص ترخيص المسؤول (يسمح فقط لأدمن شركة طاهر برفع الصور وحفظها في الخادم)
    const tokenCookie = request.cookies.get('taher_admin_token');
    if (!tokenCookie) {
      return NextResponse.json({ error: 'غير مصرح لك برفع الملفات. سجل الدخول أولاً كأدمن.' }, { status: 401 });
    }

    try {
      await jwtVerify(tokenCookie.value, JWT_SECRET);
    } catch (authError) {
      return NextResponse.json({ error: 'انتهت صلاحية جلسة الأدمن الآمنة، يُرجى تجديد الدخول.' }, { status: 401 });
    }

    // 2. قراءة البيانات الثنائية الراجعة من الطلب
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'لم يتم العثور على أي ملف للرفع.' }, { status: 400 });
    }

    // 3. التحقق الأمني من نوع وحجم الملف
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'نوع الملف غير مدعوم، يرجى اختيار صورة صالحة فقط (JPEG, PNG, WEBP, GIF, SVG).' }, { status: 400 });
    }

    // حد أقصى لحجم الصورة: 5 ميجابايت لمنع امتلاء مساحة القرص
    const MAX_SIZE = 5 * 1024 * 1024; 
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'حجم الصورة كبير جداً، الحد الأقصى المسموح به هو 5 ميجابايت.' }, { status: 400 });
    }

    // 4. تحويل الملف الثنائي إلى مصفوفة بايتات
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. توليد اسم فريد للوصول وتفادي تكرار أسماء الملفات بالخادم
    const fileExtension = path.extname(file.name) || '.jpg';
    const uniqueFileName = \`taher-\${Date.now()}-\${Math.round(Math.random() * 1e9)}\${fileExtension}\`;
    
    // المجلد المستهدف داخل مسار الـ public لعرض الصور للزوار لاحقاً
    const uploadDirectory = path.join(process.cwd(), 'public', 'uploads');
    
    try {
      // إنشاء مجلد uploads إذا كان غير موجود
      await mkdir(uploadDirectory, { recursive: true });
    } catch (err) {
      // سيتم إنشائه تلقائياً أو تجاوزه لو موجود سلفاً
    }

    const physicalPath = path.join(uploadDirectory, uniqueFileName);
    
    // كتابة الملف المرفق بجهاز العميل داخل السيرفر المحلي
    await writeFile(physicalPath, buffer);
    
    // رابط الصورة في الخادم المستهدف
    const filePublicUrl = \`/uploads/\${uniqueFileName}\`;

    return NextResponse.json({
      success: true,
      message: 'تم رفع الصورة وحفظها بنجاح تام بالجهاز المحلي وخادم شركة طاهر!',
      url: filePublicUrl,
      fileName: uniqueFileName,
      size: file.size
    }, { status: 200 });

  } catch (error) {
    console.error('IMAGE UPLOAD BACKEND ERROR:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ تقني في المخدم أثناء حفظ الصورة. تأكد من صلاحيات الكتابة بمجلد public/uploads.' 
    }, { status: 500 });
  }
}

/* 
💡 نصيحة للإنتاج السحابي (Cloud Hosting like Vercel):
بما أن Vercel تدعم الـ Serverless Functions التي لا تملك مساحات تخزين ملفات متغيرة، 
يُفضل تعديل الكود أعلاه بمكاملته مع خدمة تخزين خارجية مثل Cloudinary أو AWS S3 أو Supabase Storage:

مثال للمكاملة مع Cloudinary:
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
const uploadResponse = await cloudinary.uploader.upload(dataUri);
return uploadResponse.secure_url;
*/`
  },
  {
    id: 'env-local',
    name: 'Environment Setup',
    path: '.env.local',
    language: 'properties',
    category: 'config',
    descriptionArabic: 'المتغيرات البيئية السرية والمفاتيح المطلوبة لربط وتكامل قاعدة البيانات ومشروع Next.js ومفاتيح تشفير التوقيع الأمني على خوادم Antigravity أو بيئة التشغيل المستهدفة.',
    code: `# =========================================================================
# ⚙️ ملف المتغيرات البيئية السرية لمشروع "شركة طاهر للتطوير العقاري"
# يرجى وضعه في جذر مشروع Next.js باسم (.env.local) لتفعليه
# =========================================================================

# 1. عنوان الاتصال السري بقاعدة البيانات (PostgreSQL) في هذا النموذج
# استبدل الحقول التالية ببيانات السيرفر الفعلي الخاص بك
DATABASE_URL="postgresql://taher_user:STRONG_PASSWORD_HERE@localhost:5432/taher_realestate?schema=public"

# 2. مفتاح التشفير السري لتوقيع رموز الأمان وإدارة جلسات المشرفين (JWT)
# يُفضل أن يكون رمزاً طويلاً ومعقداً وصعب التخمين لحماية لوحة التحكم
JWT_SECRET="taher_company_for_development_and_real_estate_secured_key_98234y18274y18247y8124"

# 3. خيارات بيئة التشغيل
NODE_ENV="development"`
  }
];

export interface SchemaField {
  name: string;
  type: string;
  modifier?: string;
  comment?: string;
}

export interface SchemaModel {
  name: string;
  nameArabic: string;
  icon: string;
  color: string;
  fields: SchemaField[];
}

export const SCHEMA_MODELS: SchemaModel[] = [
  {
    name: 'Admin',
    nameArabic: 'المشرفين',
    icon: 'ShieldAlert',
    color: 'emerald',
    fields: [
      { name: 'id', type: 'String', modifier: '@id @default(uuid())', comment: 'المعرف الفريد' },
      { name: 'username', type: 'String', modifier: '@unique', comment: 'اسم المستخدم الفريد للدخول' },
      { name: 'password', type: 'String', comment: 'كلمة المرور المشفرة بـ BCrypt' },
      { name: 'name', type: 'String', comment: 'الاسم الكامل للمشرف' },
      { name: 'role', type: 'String', modifier: '@default("ADMIN")', comment: 'الصلاحية (المشرف العام)' },
      { name: 'createdAt', type: 'DateTime', modifier: '@default(now())', comment: 'تاريخ الإنشاء' },
      { name: 'updatedAt', type: 'DateTime', modifier: '@updatedAt', comment: 'تاريخ التحديث الأخير' }
    ]
  },
  {
    name: 'Project',
    nameArabic: 'المشاريع العقارية',
    icon: 'Building2',
    color: 'sky',
    fields: [
      { name: 'id', type: 'String', modifier: '@id @default(uuid())', comment: 'المعرف الفريد' },
      { name: 'title', type: 'String', comment: 'اسم المشروع العقاري' },
      { name: 'location', type: 'String', comment: 'الموقع الجغرافي / المدينة' },
      { name: 'price', type: 'Float', comment: 'سعر العقار التقريبي' },
      { name: 'area', type: 'Float', comment: 'المساحة بالمتر المربع' },
      { name: 'description', type: 'String', modifier: '@db.Text', comment: 'الوصف التفصيلي والعقود مرافقة' },
      { name: 'imageUrl', type: 'String', comment: 'رابط الصورة الرئيسية للعقار' },
      { name: 'featured', type: 'Boolean', modifier: '@default(false)', comment: 'تمييز العقار في الصفحة الأولى' },
      { name: 'createdAt', type: 'DateTime', modifier: '@default(now())', comment: 'تاريخ الإدراج' },
      { name: 'updatedAt', type: 'DateTime', modifier: '@updatedAt', comment: 'تاريخ التعديل الأخير' }
    ]
  },
  {
    name: 'Lead',
    nameArabic: 'طلبات وتواصل المهتمين',
    icon: 'MessageSquare',
    color: 'amber',
    fields: [
      { name: 'id', type: 'String', modifier: '@id @default(uuid())', comment: 'المعرف الفريد' },
      { name: 'name', type: 'String', comment: 'اسم العميل المهتم' },
      { name: 'phone', type: 'String', comment: 'رقم هاتف العميل للتواصل' },
      { name: 'message', type: 'String', modifier: '@db.Text', comment: 'نص الاستفسار والطلب' },
      { name: 'status', type: 'String', modifier: '@default("NEW")', comment: 'حالة الطلب (NEW, CONTACTED, ARCHIVED)' },
      { name: 'createdAt', type: 'DateTime', modifier: '@default(now())', comment: 'تاريخ الإرسال' }
    ]
  }
];
