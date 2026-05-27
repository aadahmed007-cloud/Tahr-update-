import * as React from 'react';
import { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  Database, 
  Key, 
  Terminal, 
  Settings, 
  Clipboard, 
  Check, 
  ExternalLink, 
  Building2, 
  Server, 
  ShieldCheck, 
  BookOpen, 
  Send,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  Sparkles,
  Layers,
  HelpCircle,
  Hash
} from 'lucide-react';
import { TAHER_CODEBASE, SCHEMA_MODELS, CodeFile, SchemaModel } from './codebaseData';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<CodeFile>(TAHER_CODEBASE[0]);
  const [activeTab, setActiveTab] = useState<'files' | 'db' | 'playground' | 'guide' | 'settings'>('files');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Website Settings & Media Upload States
  const [companySettings, setCompanySettings] = useState({
    name: 'شركة طاهر للتطوير العقاري',
    phone: '+20 102 345 6789',
    email: 'info@taher-estate.com',
    currency: 'الجنيه المصري (EGP)',
    taxNumber: '723-891-209',
    address: 'شارع التسعين الشمالي، التجمع الخامس، القاهرة الجديده'
  });

  const [companyLogo, setCompanyLogo] = useState<string>('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=120&h=120&q=80');
  const [companyHero, setCompanyHero] = useState<string>('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');
  const [galleryImages, setGalleryImages] = useState<Array<{ name: string, url: string, size: string, uploadTime: string }>>([
    { name: 'taher-hills-primary.jpg', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80', size: '420 KB', uploadTime: 'منذ يومين' },
    { name: 'office-reception.jpg', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80', size: '280 KB', uploadTime: 'منذ 5 ساعات' }
  ]);
  const [uploadLog, setUploadLog] = useState<string[]>([
    '✓ تم تهيئة نظام حارس الرفع ونظامه الفرعي بنجاح.',
    'ⓘ بانتظار اختيار ملفات صور من جهازك المحلي لتفعيل العرض الكودي والمحلي المباشر.'
  ]);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // API Playground States
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [contactResult, setContactResult] = useState<any>(null);
  const [contactLoading, setContactLoading] = useState(false);

  const [projectForm, setProjectForm] = useState({ 
    title: '', 
    location: '', 
    price: '', 
    area: '', 
    description: '', 
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
    featured: false 
  });
  const [projectResult, setProjectResult] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [isLoggedInSimulator, setIsLoggedInSimulator] = useState(true);

  // Filter files by category
  const categories = [
    { id: 'all', nameAr: 'كل الملفات', icon: Folder },
    { id: 'database', nameAr: 'قواعد البيانات', icon: Database },
    { id: 'api', nameAr: 'مسارات الـ API', icon: Server },
    { id: 'auth', nameAr: 'الحماية والمصادقة', icon: Key },
    { id: 'config', nameAr: 'ملفات الإعدادات', icon: Settings },
  ];

  const filteredFiles = selectedCategory === 'all' 
    ? TAHER_CODEBASE 
    : TAHER_CODEBASE.filter(f => f.category === selectedCategory);

  const handleCopyCode = (file: CodeFile) => {
    navigator.clipboard.writeText(file.code);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyDirectText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleTestContactAPI = (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactResult(null);

    setTimeout(() => {
      const { name, phone, message } = contactForm;
      if (!name || !phone || !message) {
        setContactResult({
          status: 400,
          statusText: 'Bad Request',
          error: 'من فضلك قم بتعبئة جميع الحقول المطلوبة (الاسم، الهاتف، الرسالة).'
        });
      } else if (name.trim().length < 3) {
        setContactResult({
          status: 400,
          statusText: 'Bad Request',
          error: 'الاسم غامض جداً، يرجى إدخال الاسم الثلاثي أو الثنائي على الأقل (3 أحرف فأكثر).'
        });
      } else if (phone.trim().length < 8) {
        setContactResult({
          status: 400,
          statusText: 'Bad Request',
          error: 'رقم الهاتف يبدو غير مكتمل، يجب ألا يقل عن 8 أرقام.'
        });
      } else {
        setContactResult({
          status: 201,
          statusText: 'Created',
          success: true,
          message: 'تم استلام بياناتك بنجاح تام! سيقوم مستشار شركة طاهر للتطوير العقاري بالتواصل معك خلال 24 ساعة.',
          data: {
            id: 'lead_uuid_' + Math.random().toString(36).substring(2, 10),
            name: name.trim(),
            phone: phone.trim(),
            message: message.trim(),
            status: 'NEW',
            createdAt: new Date().toISOString()
          }
        });
      }
      setContactLoading(false);
    }, 800);
  };

  const handleTestProjectAPI = (e: React.FormEvent) => {
    e.preventDefault();
    setProjectLoading(true);
    setProjectResult(null);

    setTimeout(() => {
      if (!isLoggedInSimulator) {
        setProjectResult({
          status: 401,
          statusText: 'Unauthorized',
          error: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً كمسؤول للنظام.'
        });
        setProjectLoading(false);
        return;
      }

      const { title, location, price, area, description, imageUrl } = projectForm;
      if (!title || !location || !price || !area || !description || !imageUrl) {
        setProjectResult({
          status: 400,
          statusText: 'Bad Request',
          error: 'كافة المدخلات الفنية للمشروع مطلوبة (العنوان، الموقع، السعر، المساحة، الوصف، الصورة).'
        });
      } else {
        setProjectResult({
          status: 201,
          statusText: 'Created',
          success: true,
          message: 'تمت إضافة المشروع العقاري في نظام شركة طاهر للتطوير العقاري بنجاح!',
          project: {
            id: 'project_uuid_' + Math.random().toString(36).substring(2, 10),
            title: title.trim(),
            location: location.trim(),
            price: parseFloat(price),
            area: parseFloat(area),
            description: description.trim(),
            imageUrl: imageUrl.trim(),
            featured: projectForm.featured,
            createdAt: new Date().toISOString()
          }
        });
      }
      setProjectLoading(false);
    }, 850);
  };

  const logAction = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString('ar-EG', { hour12: false });
    setUploadLog(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setIsAlertVisible(true);
    setTimeout(() => setIsAlertVisible(false), 4000);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        logAction('⚠️ خطأ: الملف المختار ليس صورة صالحة.');
        triggerAlert('يرجى اختيار صورة صالحة فقط (PNG, JPG, WEBP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        logAction(`⚠️ خطأ: حجم ملف ${file.name} يتجاوز 5 ميجابايت.`);
        triggerAlert('حجم الصورة كبير جداً، الحد الأقصى هو 5 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCompanyLogo(result);
        logAction(`✓ تم تحديث شعار الشركة بنجاح: ${file.name} (${Math.round(file.size / 1024)} KB).`);
        logAction(`⚙️ [API Upload Simulator] POST /api/upload -> الاستجابة: 200 (SUCCESS)`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        logAction('⚠️ خطأ: الملف المختار ليس صورة صالحة.');
        triggerAlert('يرجى تحديد صورة صالحة.');
        return;
      }
      if (file.size > 6 * 1024 * 1024) {
        logAction(`⚠️ خطأ: حجم ملف البانر كبير جداً (${Math.round(file.size / 1024 / 1024)} MB).`);
        triggerAlert('الملف أكبر من الحد المسموح.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCompanyHero(result);
        logAction(`✓ تم رفع وتحديث خلفية البانر بنجاح: ${file.name} (${Math.round(file.size / 1024)} KB).`);
        logAction(`⚙️ [API Upload Simulator] POST /api/upload -> الاستجابة: 200 (SUCCESS)`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        triggerAlert('يرجى اختيار صورة صالحة.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newImage = {
          name: file.name,
          url: result,
          size: `${Math.round(file.size / 1024)} KB`,
          uploadTime: 'الآن'
        };
        setGalleryImages(prev => [newImage, ...prev]);
        logAction(`✓ تم إضافة صورة جديدة للمشروع في الاستوديو: ${file.name}.`);
        logAction(`⚙️ [API Upload Simulator] POST /api/upload -> الاستجابة: 200 (SUCCESS)`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetDefaults = () => {
    setCompanyLogo('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=120&h=120&q=80');
    setCompanyHero('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80');
    setCompanySettings({
      name: 'شركة طاهر للتطوير العقاري',
      phone: '+20 102 345 6789',
      email: 'info@taher-estate.com',
      currency: 'الجنيه المصري (EGP)',
      taxNumber: '723-891-209',
      address: 'شارع التسعين الشمالي، التجمع الخامس، القاهرة الجديده'
    });
    logAction('🔄 تم استرجاع إعدادات الهوية البصرية الإفتراضية للموقع بنجاح.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans tracking-tight leading-relaxed select-none" style={{ direction: 'rtl' }}>
      
      {/* Upper Elegant Banner / Header */}
      <header className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/80 px-4 py-8 sm:px-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-center md:text-right">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-[1.5px] shadow-xl shadow-emerald-950/20 overflow-hidden">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center overflow-hidden">
                {companyLogo ? (
                  <img src={companyLogo} alt="Logo" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xl font-bold text-white">🏢</span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-l from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {companySettings.name}
                </h1>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-md font-mono">
                  Full-Stack Backend Ready
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1.5 max-w-xl">
                بوابة المطورين والمهندسين لاستعراض وتصدير الـ Backend والـ Prisma Schemas والـ API لتشغيل الموقع الإلكتروني بشكل ديناميكي وآمن.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button 
              onClick={() => {
                const fullText = TAHER_CODEBASE.map(f => `// ==========================================\n// PATH: ${f.path}\n// ==========================================\n${f.code}`).join('\n\n');
                handleCopyDirectText(fullText, 'full-code');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition text-sm font-medium text-slate-200 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {copiedId === 'full-code' ? <Check className="w-4 h-4 text-emerald-400 animate-pulse" /> : <Clipboard className="w-4 h-4 text-slate-400" />}
              <span>{copiedId === 'full-code' ? 'تم نسخ جميع الأكواد!' : 'نسخ ملف الـ Backend كاملاً'}</span>
            </button>
            <a 
              href="https://prisma.io" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-600/20 transition text-sm font-medium flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>مستندات Prisma</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Structural Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800/80 mb-8 overflow-x-auto scrollbar-none">
          <button 
            onClick={() => setActiveTab('files')}
            className={`pb-4 px-6 text-sm font-medium border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${activeTab === 'files' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <FileCode className="w-4 h-4" />
            <span>مستعرض ومولد الملفات</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('db')}
            className={`pb-4 px-6 text-sm font-medium border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${activeTab === 'db' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Database className="w-4 h-4" />
            <span>هيكل قاعدة البيانات (ER Diagram)</span>
          </button>

          <button 
            onClick={() => setActiveTab('playground')}
            className={`pb-4 px-6 text-sm font-medium border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${activeTab === 'playground' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Terminal className="w-4 h-4" />
            <span>محاكي وفاحص الـ API</span>
          </button>

          <button 
            onClick={() => setActiveTab('guide')}
            className={`pb-4 px-6 text-sm font-medium border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${activeTab === 'guide' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>دليل التشغيل والدمج</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-6 text-sm font-medium border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${activeTab === 'settings' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الموقع ورفع الصور</span>
          </button>
        </div>

        {/* TAB 1: CODE EXPLORER */}
        {activeTab === 'files' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar with files selection */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Category selector */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">تصنيف المكونات</h3>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          // Reset selection to first match
                          const newFiltered = cat.id === 'all' 
                            ? TAHER_CODEBASE 
                            : TAHER_CODEBASE.filter(f => f.category === cat.id);
                          if (newFiltered.length > 0) setSelectedFile(newFiltered[0]);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${selectedCategory === cat.id ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/25' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CatIcon className="w-4.5 h-4.5" />
                          <span>{cat.nameAr}</span>
                        </div>
                        <span className="text-xs bg-slate-950/80 text-slate-500 px-2 py-0.5 rounded-full border border-slate-800/40">
                          {cat.id === 'all' ? TAHER_CODEBASE.length : TAHER_CODEBASE.filter(f => f.category === cat.id).length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Files in selected category */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">الملفات المتوفرة بالمسار</h3>
                <div className="space-y-1.5">
                  {filteredFiles.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-right px-3.5 py-3 rounded-xl transition cursor-pointer border ${selectedFile.id === file.id ? 'bg-slate-800/80 border-slate-700 text-white' : 'border-transparent text-slate-300 hover:bg-slate-800/30'}`}
                    >
                      <div className="font-semibold text-sm truncate flex items-center justify-between">
                        <span>{file.name}</span>
                        <span className="text-xs opacity-50 font-mono text-left" style={{ direction: 'ltr' }}>
                          .{file.path.split('.').pop()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-mono truncate" style={{ direction: 'ltr' }}>
                        {file.path}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Code preview & metadata */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* File header */}
                <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <h2 className="text-base font-bold text-white">{selectedFile.name}</h2>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-1 select-all" style={{ direction: 'ltr' }}>
                      {selectedFile.path}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(selectedFile)}
                      className="px-4 py-2 text-xs font-semibold bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg text-white transition flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      {copiedId === selectedFile.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3.5 h-3.5 text-slate-400" />
                          <span>نسخ الكود</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Technical explanation of this component */}
                <div className="bg-slate-950/50 px-6 py-4.5 border-b border-slate-800 text-sm text-slate-300">
                  <p className="leading-relaxed">
                    <strong className="text-emerald-400 block mb-1">وصف الملف وملخص عمله:</strong>
                    {selectedFile.descriptionArabic}
                  </p>
                </div>

                {/* Preformatted code panel */}
                <div className="relative">
                  <div className="absolute top-3 left-4 text-[10px] font-mono select-none px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800/85 text-slate-500 uppercase">
                    {selectedFile.language}
                  </div>
                  <pre className="p-6 overflow-x-auto text-xs font-mono text-emerald-300 bg-[#070b12] leading-relaxed max-h-[550px] overflow-y-auto text-left" style={{ direction: 'ltr' }}>
                    <code>
                      {selectedFile.code.split('\n').map((line, idx) => (
                        <div key={idx} className="table-row">
                          <span className="table-cell pr-4 text-slate-600 text-right select-none w-8 text-[11px] font-sans border-r border-slate-800/50">{idx + 1}</span>
                          <span className="table-cell pl-4 text-slate-300 break-all whitespace-pre-wrap">{line || ' '}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

              </div>

              {/* Proactive tip / warning panel inside */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-sm text-amber-200/90 leading-relaxed">
                <span className="text-lg">💡</span>
                <div>
                  <h4 className="font-bold text-amber-300">نصيحة أمنية هامة للإنتاج (Production):</h4>
                  <p className="mt-1 text-slate-300">
                    كلمات المرور في قاعدة البيانات يتم تشفيرها باستخدام مكتبة <code className="font-mono bg-slate-950 text-emerald-400 px-1 py-0.5 rounded text-xs">bcryptjs</code>. يرجى التأكد من عدم إدراج مستخدم افتراضي بكلمة مرور نصيّة صريحة، واستخدم مسار <code className="font-mono bg-slate-950 text-emerald-400 px-1 py-0.5 rounded text-xs">bcrypt</code> لتوليد الـ Hash لتخزينه بالسيرفر بأمان.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: DATABASE VISUALIZER */}
        {activeTab === 'db' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Descriptive Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">مخطط الكيانات لـ Prisma Schema (ER Diagram)</h2>
                  <p className="text-slate-400 text-sm mt-1">يأخذ نظام شركة طاهر للتطوير العقاري مبدأ الهيكلية المترابطة وغير الزائدة لضمان سرعة معالجة الطلبات وجلب المشاريع باللوحة الإدارية.</p>
                </div>
              </div>
            </div>

            {/* Visual ER Maps with beautiful structural cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SCHEMA_MODELS.map((model: SchemaModel) => (
                <div key={model.name} className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 transition rounded-2xl overflow-hidden shadow-lg flex flex-col h-full">
                  
                  {/* Model header with distinct brand accent color */}
                  <div className={`px-5 py-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${
                        model.color === 'emerald' ? 'bg-emerald-500' : model.color === 'sky' ? 'bg-sky-500' : 'bg-amber-500'
                      }`}></span>
                      <h3 className="font-bold text-white text-base font-mono">{model.name}</h3>
                    </div>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded font-medium">
                      {model.nameArabic}
                    </span>
                  </div>

                  {/* Schema listing properties */}
                  <div className="p-4 flex-1 space-y-2.5">
                    {model.fields.map((field) => (
                      <div key={field.name} className="flex items-start justify-between p-2 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 border border-slate-900 transition">
                        <div>
                          <span className="font-mono text-xs text-slate-100 font-semibold">{field.name}</span>
                          {field.comment && (
                            <span className="block text-[11px] text-slate-500 mt-0.5">{field.comment}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10 inline-block">
                            {field.type}
                          </span>
                          {field.modifier && (
                            <span className="block font-mono text-[9px] text-slate-500 mt-1 uppercase leading-none">{field.modifier}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Schema footer representing primary key description */}
                  <div className="p-3 bg-slate-950/40 border-t border-slate-800 text-center text-xs text-slate-400">
                    المفتاح الرئيسي: <code className="text-amber-400 font-mono">id (UUID)</code>
                  </div>
                </div>
              ))}
            </div>

            {/* Visualizer Database Relations flow */}
            <div className="p-6 bg-[#070b12] border border-slate-800 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>تبادل البيانات والعلاقات الإدارية</span>
              </h3>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-6 font-mono text-[11px]">
                
                {/* Visual DB block */}
                <div className="px-5 py-4 bg-slate-900 border border-slate-700/50 rounded-xl text-center w-48">
                  <div className="text-emerald-400 font-bold mb-1">👑 Admin (حارس النظام)</div>
                  <div className="text-slate-500 border-t border-slate-800 pt-2 mt-1">يتحقق من الرموز والتصاريح لتوقيع العمليات</div>
                </div>

                {/* Arrow indicator */}
                <div className="text-center text-slate-500 text-xl font-sans rotate-90 md:rotate-0">
                  ◀────────────────▶
                </div>

                <div className="px-5 py-4 bg-slate-900 border border-slate-700/50 rounded-xl text-center w-48">
                  <div className="text-sky-400 font-bold mb-1">🏢 Project (المشاريع)</div>
                  <div className="text-slate-500 border-t border-slate-800 pt-2 mt-1">مسجلة بالكامل ويسمح للمشرف بالتعديل الكامل</div>
                </div>

                <div className="text-center text-slate-500 text-xl font-sans rotate-90 md:rotate-0">
                  ◀────────────────▶
                </div>

                <div className="px-5 py-4 bg-slate-900 border border-slate-700/50 rounded-xl text-center w-48">
                  <div className="text-amber-400 font-bold mb-1">📞 Lead (استفسارات العملاء)</div>
                  <div className="text-slate-500 border-t border-slate-800 pt-2 mt-1">يستقبلها الخادم ويقوم بإدراجها الفوري</div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 3: API PLAYGROUND SIMULATOR */}
        {activeTab === 'playground' && (
          <div className="space-y-8">
            
            {/* Descriptive Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">محاكي وفاحص الـ API التفاعلي (Live Simulator)</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    قم بتجربة استقبال البيانات وفحص استجابة الخادم لـ Next.js API Routes مباشرةً لتضمن عملها البرمجي الحقيقي وخلوها من التعقيدات.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Endpoint 1: POST /api/contact */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-slate-950/40 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded uppercase font-mono">POST</span>
                    <span className="font-mono text-sm text-slate-200">/api/contact</span>
                  </div>
                  <span className="text-xs text-slate-400">طلب استمارة تواصل عميل (Lead)</span>
                </div>

                <form onSubmit={handleTestContactAPI} className="p-5 space-y-4">
                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5 font-medium">اسم العميل المهتم</label>
                    <input 
                      type="text" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="مثال: يوسف طاهر النجار"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 text-right font-sans transition"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5 font-medium">رقم الهاتف للاتصال</label>
                    <input 
                      type="text" 
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="مثال: +966501234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 text-left font-sans transition"
                      style={{ direction: 'ltr' }}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs mb-1.5 font-medium">رسالة الاستفسار والمشروع المفضل</label>
                    <textarea 
                      value={contactForm.message}
                      rows={2}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="مثال: أود الاستفسار عن كراسة الشروط الخاصة ببرج طاهر ريزيدنس بالتجمع الخامس وخطط السداد المتوفرة للعملاء المباشرين."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 text-right font-sans transition"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={contactLoading}
                    className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>{contactLoading ? 'جاري محاكاة الإدراج...' : 'تقديم إرسال طلب تواصل تجريبي'}</span>
                  </button>
                </form>

                {/* API Response display */}
                {contactResult && (
                  <div className="border-t border-slate-800 bg-[#070b12] p-4.5 font-mono text-xs">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-900">
                      <span className="text-slate-400">الاستجابة الراجعة من النموذج:</span>
                      <span className={`font-bold ${contactResult.status === 201 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        HTTP {contactResult.status} {contactResult.statusText}
                      </span>
                    </div>
                    <pre className="text-left overflow-x-auto text-[11px]" style={{ direction: 'ltr' }}>
                      <code className={contactResult.status === 201 ? 'text-emerald-300' : 'text-rose-300'}>
                        {JSON.stringify(contactResult, null, 2)}
                      </code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Endpoint 2: POST /api/projects */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-slate-950/40 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-2.5 py-1 rounded uppercase font-mono">POST</span>
                    <span className="font-mono text-sm text-slate-200">/api/projects</span>
                  </div>
                  <span className="text-xs text-slate-400">إضافة مشروع جديد (مصادقة الأدمن)</span>
                </div>

                <div className="bg-slate-950/60 border-b border-slate-850 px-5 py-2.5 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4.5 h-4.5 ${isLoggedInSimulator ? 'text-emerald-400' : 'text-rose-500'}`} />
                    <span>محاكاة تسجيل دخول الأدمن: <strong className={isLoggedInSimulator ? 'text-emerald-400' : 'text-rose-400'}>{isLoggedInSimulator ? 'مفعل (لديه JWT)' : 'غير فعال (مجهول)'}</strong></span>
                  </div>
                  <button 
                    onClick={() => setIsLoggedInSimulator(!isLoggedInSimulator)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] text-white transition active:scale-95 cursor-pointer"
                  >
                    تبديل حالة الجلسة
                  </button>
                </div>

                <form onSubmit={handleTestProjectAPI} className="p-5 space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 text-[11px] mb-1 font-medium">اسم المشروع العقاري</label>
                      <input 
                        type="text" 
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="طاهر هيلز 2"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 text-right transition"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-[11px] mb-1 font-medium">المدينة والموقع</label>
                      <input 
                        type="text" 
                        value={projectForm.location}
                        onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                        placeholder="الأندلس، القاهرة الجديدة"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 text-right transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 text-[11px] mb-1 font-medium">السعر (جنيه مصري / دولار)</label>
                      <input 
                        type="number" 
                        value={projectForm.price}
                        onChange={(e) => setProjectForm({ ...projectForm, price: e.target.value })}
                        placeholder="4500000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-left transition"
                        style={{ direction: 'ltr' }}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-[11px] mb-1 font-medium">المساحة (متر مربع)</label>
                      <input 
                        type="number" 
                        value={projectForm.area}
                        onChange={(e) => setProjectForm({ ...projectForm, area: e.target.value })}
                        placeholder="185"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-left transition"
                        style={{ direction: 'ltr' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-[11px] mb-1 font-medium">رابط صورة العقار الواجهة</label>
                    <input 
                      type="text" 
                      value={projectForm.imageUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 text-left font-mono transition"
                      style={{ direction: 'ltr' }}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-[11px] mb-1 font-medium">الوصف وخطط السداد والتقسيط</label>
                    <textarea 
                      value={projectForm.description}
                      rows={1.5}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="وصف مميز للمشروع: شقق فاخرة على شارع التسعين مع تشطيب متكامل ونظام تسليم ذكي..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 text-right transition"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="featured"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="rounded accent-emerald-500 w-4 h-4 bg-slate-950 border-slate-800"
                    />
                    <label htmlFor="featured" className="text-xs text-slate-300 cursor-pointer select-none">إدراج كعقار مميز أول الصفحة الرئيسية</label>
                  </div>

                  <button 
                    type="submit"
                    disabled={projectLoading}
                    className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-white font-medium py-2 rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>{projectLoading ? 'جاري التحقق من التوقيع والأمان...' : 'إرسال طلب إنشاء مشروع (لوحة الإدارة)'}</span>
                  </button>
                </form>

                {/* API Response display */}
                {projectResult && (
                  <div className="border-t border-slate-800 bg-[#070b12] p-4.5 font-mono text-xs animate-fade-in">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-900">
                      <span className="text-slate-400">الاستجابة الراجعة من النموذج:</span>
                      <span className={`font-bold ${projectResult.status === 201 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        HTTP {projectResult.status} {projectResult.statusText}
                      </span>
                    </div>
                    <pre className="text-left overflow-x-auto text-[11px]" style={{ direction: 'ltr' }}>
                      <code className={projectResult.status === 201 ? 'text-emerald-300' : 'text-rose-300'}>
                        {JSON.stringify(projectResult, null, 2)}
                      </code>
                    </pre>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: DEPLOYMENT GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Guide Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-2">خطوات وإرشادات التثبيت والتشغيل بالتفصيل لـ Next.js & Prisma</h2>
              <p className="text-slate-400 text-sm">بصفتنا خبراء Full-Stack، إليك خريطة الطريق لدمج هذه الأكواد الخلفية في مشروع Next.js الخاص بك وتفعيل الأمان بالكامل:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Step 1 & 2 */}
              <div className="bg-slate-905 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono">1</div>
                  <h3 className="font-bold text-white text-base">إعداد قاعدة البيانات و Prisma ORM</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  قم بوضع مفاتيح الاتصال في ملف <code className="font-mono bg-slate-950 text-emerald-400 px-1 py-0.5 rounded text-xs">.env.local</code> الخاص بك.
                </p>
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl font-mono text-xs text-slate-300 leading-6 space-y-1">
                  <div># 1. تثبيت حزم Prisma بالكامل</div>
                  <div className="text-emerald-400">npm install prisma @prisma/client</div>
                  <div className="mt-3"># 2. توليد ودمج السكيما مع قاعدة البيانات وسحب الجداول</div>
                  <div className="text-emerald-400">npx prisma db push</div>
                  <div className="mt-3"># 3. تشغيل لوحة المعاينة الرسومية من Prisma لمعاينة الجداول</div>
                  <div className="text-emerald-400">npx prisma studio</div>
                </div>
              </div>

              {/* Step 3 & 4 */}
              <div className="bg-slate-905 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono">2</div>
                  <h3 className="font-bold text-white text-base">تثبيت حزم الأمان وتشفير الجلسات JWT</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  المشروع يحتاج لحزم للتشفير الآمن لكلمات المرور وتوليد رموز الجلسة من جهة الخادم:
                </p>
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl font-mono text-xs text-slate-300 leading-6 space-y-1">
                  <div># 1. تثبيت حزمة تشفير كلمات المرور لـ Admin</div>
                  <div className="text-emerald-400">npm install bcryptjs</div>
                  <div className="mt-3"># 2. تثبيت حزمة التوقيع الرقمي الخفيف والمحمي لجلسات متصفحات ايدج وجوجل كارت</div>
                  <div className="text-emerald-400">npm install jose</div>
                  <div className="mt-3 text-slate-500">ملاحظة: حزمة <code className="text-slate-300 font-bold">jose</code> ممتازة للميدلوير في Next.js ومتوافقة مع نظام Vercel Edge Runtime بالدقة الطويلة.</div>
                </div>
              </div>

            </div>

            {/* General FAQs on security */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <span>الأسئلة الأكثر شيوعاً ونصائح الأمان (Security & Authentication FAQ)</span>
              </h3>

              <div className="space-y-4">
                <div className="border-b border-slate-800/60 pb-4">
                  <h4 className="font-semibold text-slate-200 text-sm">كيف أقوم بإنشاء أول مستخدم Admin في قاعدة البيانات؟</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    من أفضل الطرق هي إنشاء ملف بذرة زراعي <code className="font-mono text-emerald-400">prisma/seed.js</code> يقوم بحقن المشرف بعد تشفيره بواسطة Bcrypt بكلمة مرور مخصصة، أو تشغيل دالة معزولة مؤقتة في مسار API، ثم حذف الدالة لتظل قاعدة البيانات مغلقة بشكل تام.
                  </p>
                </div>

                <div className="border-b border-slate-800/60 pb-4">
                  <h4 className="font-semibold text-slate-200 text-sm">لماذا يتم حفظ الـ Token كوكي بدل LocalStorage؟</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    لأننا اعتمدنا خيار <code className="font-mono text-emerald-500">httpOnly: true</code> في تهيئة الـ Cookies. هذا الخيار يحارب بنجاح هجمات الـ XSS (حقن الأكواد الخبيثة بالموقع الإلكتروني)، بحيث لا تمتلك أي سكربتات وصول للـ Cookie، ويعالجها الخادم في كل استدعاء تلقائياً للميدلوير.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-200 text-sm">كيف تعمل حماية الصفحات في الواجهة الأمامية (Front-End Pages)؟</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    بامتداد ملف <code className="font-mono text-emerald-400">middleware.js</code> الذي كتبناه لك، تقوم منصة Next.js بفحص الكوكي قبل تمرير وتقديم الصفحة للمتصفح. إن لم يكن المشرف مسجل دخوله سينقطع مروره فوراً ويرده السيرفر لصفحة اللوجين، مما يوفر أمان وحماية مطلقة للوحة معلومات شركة طاهر.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: WEBSITE SETTINGS & IMAGE UPLOAD SECTION */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in relative z-10">
            
            {/* Alert Banner */}
            {isAlertVisible && (
              <div className="fixed top-6 left-6 z-50 p-4 rounded-xl bg-slate-900 border-2 border-amber-500 text-amber-300 text-sm shadow-2xl flex items-center gap-2 max-w-sm animate-bounce">
                💡 <span className="font-semibold">{alertMessage}</span>
              </div>
            )}

            {/* Section Header */}
            <div className="bg-gradient-to-l from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Settings className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">لوحة وحارس إدارة إعدادات الهوية البصرية (Media Settings Panel)</h2>
                  <p className="text-slate-400 text-sm mt-1">تتيح لك هذه اللوحة تغيير شعار الشركة، وبانر الهيدر، وإعدادات العملة والاتصال مع محاكي الرفع التفاعلي لإصدار الإنتاج.</p>
                </div>
              </div>
              <button 
                onClick={handleResetDefaults}
                className="px-4 py-2 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 active:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl transition duration-150 cursor-pointer"
              >
                🔄 استرجاع الهوية الافتراضية
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form and System Logs column (Left - 7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* General Settings Form */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-white mb-5 pb-3 border-b border-slate-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>البيانات الأساسية لشركة طاهر والموقع</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 text-xs mb-1.5 font-medium">اسم الكيان العقاري التجاري</label>
                        <input 
                          type="text" 
                          value={companySettings.name}
                          onChange={(e) => {
                            setCompanySettings({ ...companySettings, name: e.target.value });
                            logAction(`✎ تم تغيير اسم الشركة إلى: "${e.target.value}"`);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-xs mb-1.5 font-medium">العملة الرسمية لعرض أسعار العقارات</label>
                        <select 
                          value={companySettings.currency}
                          onChange={(e) => {
                            setCompanySettings({ ...companySettings, currency: e.target.value });
                            logAction(`✎ تم تعديل العملة الرسمية للموقع لـ: ${e.target.value}`);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition text-right"
                          style={{ direction: 'rtl' }}
                        >
                          <option value="الجنيه المصري (EGP)">الجنيه المصري (EGP)</option>
                          <option value="الدولار الأمريكي (USD)">الدولار الأمريكي (USD)</option>
                          <option value="الريال السعودي (SAR)">الريال السعودي (SAR)</option>
                          <option value="الدرهم الإماراتي (AED)">الدرهم الإماراتي (AED)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 text-xs mb-1.5 font-medium">رقم هاتف قسم المبيعات والطلب</label>
                        <input 
                          type="text" 
                          value={companySettings.phone}
                          onChange={(e) => {
                            setCompanySettings({ ...companySettings, phone: e.target.value });
                            logAction(`✎ تم تعديل الهاتف إلى: ${e.target.value}`);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 text-left transition"
                          style={{ direction: 'ltr' }}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-xs mb-1.5 font-medium">البريد الإلكتروني المهني للتواصل</label>
                        <input 
                          type="email" 
                          value={companySettings.email}
                          onChange={(e) => {
                            setCompanySettings({ ...companySettings, email: e.target.value });
                            logAction(`✎ تم تعديل البريد إلى: ${e.target.value}`);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 text-left transition"
                          style={{ direction: 'ltr' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 text-xs mb-1.5 font-medium">رقم السجل التجاري والبطاقة الضريبية</label>
                        <input 
                          type="text" 
                          value={companySettings.taxNumber}
                          onChange={(e) => setCompanySettings({ ...companySettings, taxNumber: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 text-right transition"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-xs mb-1.5 font-medium">عنوان واجهة المقر الإداري للشركة</label>
                        <input 
                          type="text" 
                          value={companySettings.address}
                          onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 text-right transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Log output for secure operations */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>مراقب ومعالج عمليات الرفع (Server API Upload Logs)</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono font-medium animate-pulse">POST /api/upload</span>
                  </h4>
                  <div className="bg-[#05080f] rounded-xl border border-slate-950 p-4.5 font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto space-y-2 text-right">
                    {uploadLog.map((log, index) => {
                      let color = 'text-slate-400';
                      if (log.startsWith('[') && log.includes('✓')) color = 'text-emerald-400';
                      if (log.startsWith('[') && log.includes('⚠️')) color = 'text-amber-400 text-semibold';
                      if (log.startsWith('[') && log.includes('⚙️')) color = 'text-sky-400 font-semibold';
                      return (
                        <div key={index} className={`${color} border-b border-slate-900/50 pb-1.5 last:border-0`}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Real-world Next.js integration details */}
                <div className="bg-slate-905 border border-slate-800 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>كود معالجة الرفع من المتصفح (Client Integration Code)</span>
                    </h4>
                    <button 
                      onClick={() => handleCopyDirectText(
`// كود جلب ورفع الصور التفاعلي في واجهات شركة طاهر للتطوير العقاري (App Router)
async function handleImageUpload(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    // المتصفح يحدد الـ Content-Type تلقائياً لاستقبال Multipart/Form-Data
  });

  const output = await response.json();
  if (!response.ok) {
    throw new Error(output.error || 'فشلت عملية حفظ الصورة بالخادم.');
  }
  
  // يرجع الكود المسار العام مثل /uploads/taher-1234567.jpg لإدراجه بقاعدة البيانات
  return output.url; 
}`, 'client-code'
                      )}
                      className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-650 rounded-lg text-slate-300 transition cursor-pointer"
                    >
                      {copiedId === 'client-code' ? '✓ تم النسخ!' : 'نسخ دالة الرفع'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    يمكن للمطورين نسخ واستعمال هذه الدالة المتوافقة بالكامل مع مسار الخادم <code className="text-emerald-400 bg-slate-950 px-1 py-0.5 rounded font-mono">app/api/upload/route.js</code>، حيث يتم ربطها بحدث تغيير المدخل <code className="text-slate-300 font-mono">onChange</code> لرفع ملفات الصور الحقيقية بجودة عالية.
                  </p>
                </div>

              </div>

              {/* Upload Drop Zone & visual mock Column (Right - 5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Logo Real Upload Container */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">رفع شعار الشركة (Corporate Logo)</h4>
                  
                  <div className="flex items-center gap-5">
                    {/* Circle Previewer */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                      <img 
                        src={companyLogo} 
                        alt="Logo Preview" 
                        className="w-full h-full object-cover rounded-2xl" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    {/* Pick Box zone */}
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-400 leading-normal mb-2.5">انقر على الزر لاختيار شعار حقيقي من جهازك وتطبيقه مباشرة بالترويسة الكبرى والمحاكي العقاري.</p>
                      
                      <label 
                        htmlFor="logo-file-input" 
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold cursor-pointer border border-slate-700 transition"
                      >
                        📥 اختر شعار من جهازك
                      </label>
                      <input 
                        type="file" 
                        id="logo-file-input" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleLogoFileChange}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Hero Background Upload Zone */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">صورة البانر الرئيسي للموقع (Hero Banner)</h4>
                  
                  {/* Banner Mockup preview */}
                  <div className="relative w-full h-28 rounded-xl overflow-hidden border border-slate-800/85">
                    <img 
                      src={companyHero} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center p-3 text-center">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-white">{companySettings.name}</div>
                        <div className="text-[8px] text-emerald-400">مرحباً بكم في شريك العقار الموثوق</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400 mb-2.5">قم بتعيين بانر عقاري احترافي من جهازك لمعاينته حياً في نموذج الموقع السريع.</p>
                    
                    <label 
                      htmlFor="hero-file-input" 
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold cursor-pointer border border-slate-700 transition"
                    >
                      🖼️ اختر صورة البانر
                    </label>
                    <input 
                      type="file" 
                      id="hero-file-input" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleHeroFileChange}
                    />
                  </div>
                </div>

                {/* 3. Additional Project Media Upload (Drag and Drop Mock Zone) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">صور المعرض والمشاريع الملحقة</h4>
                  
                  {/* Simulated Upload box */}
                  <label 
                    htmlFor="gallery-file-input"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-805 border-slate-700/60 hover:border-emerald-500 rounded-xl bg-slate-950/50 hover:bg-slate-950/80 transition cursor-pointer p-3 text-center"
                  >
                    <span className="text-lg">📂</span>
                    <span className="text-[11px] font-semibold text-slate-300 mt-1.5">اسحب وأفلت صوراً أو اضغط هنا</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">صيغ PNG, JPG, WEBP حتى 5MB</span>
                  </label>
                  <input 
                    type="file" 
                    id="gallery-file-input" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleGalleryAdd}
                  />

                  {/* Uploaded Gallery Listing */}
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">الوسائط المرفوعة حديثاً ({galleryImages.length})</h5>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {galleryImages.map((img, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-900/60">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-850">
                              <img src={img.url} alt="Gallery" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="truncate max-w-[140px]">
                              <div className="text-[10px] font-bold text-white truncate">{img.name}</div>
                              <div className="text-[9px] text-slate-500 mt-0.5 font-mono">{img.size}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-400 bg-emerald-500/10 border border-emerald-500/10 px-1.5 py-0.5 rounded">
                              {img.uploadTime}
                            </span>
                            <button 
                              onClick={() => {
                                setGalleryImages(prev => prev.filter((_, idx) => idx !== i));
                                logAction(`✗ تم إزالة صورة ملحقة من المعرض المؤقت: ${img.name}`);
                              }}
                              className="p-1 rounded text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                              title="حذف الصورة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Main Footer of the platform app */}
      <footer className="bg-slate-900 border-t border-slate-850 px-4 py-8 text-center text-xs text-slate-450 text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span>🏢</span>
            <span className="font-semibold text-white">شركة طاهر للتطوير العقاري | الهندسة الفنية للـ Backend</span>
          </div>
          <p className="text-slate-500">تم تطوير وصياغة هذا الكود الخلفي المتكامل بواسطة خبير السيرفرات لتمكين الإرسال الفوري وإدارة وحماية المشاريع والعملاء المهتمين </p>
          <p className="text-[10px] text-slate-600 font-mono">Taher Real Estate Backend Applet Project Build &copy; 2026</p>
        </div>
      </footer>

    </div>
  );
}
