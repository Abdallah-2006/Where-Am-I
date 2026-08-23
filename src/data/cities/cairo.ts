import type { CityInfo, Station, TransitLine, UserProfileData, CalculatedRoute, OfficialTariffItem, TerminalLocation, TaxiMeterRate } from '../../types';

export const CAIRO_CITY: CityInfo = { id: 'cairo', name: 'القاهرة الكبرى', nameEn: 'Greater Cairo', governorate: 'القاهرة والجيزة والقليوبية', centerLat: 30.0444, centerLng: 31.2357, defaultZoom: 11 };

// ==========================================
// 1. OFFICIAL APPROVED TARIFFS - CAIRO GREATER AREA (مارس ٢٠٢٦)
// ==========================================
export const CAIRO_OFFICIAL_TARIFFS_2026: OfficialTariffItem[] = [
  // أ. تعريفة مترو الأنفاق (جميع الخطوط)
  { id: 'tar-metro-9stops', category: 'metro', from: 'شبكة المترو', to: 'حتى ٩ محطات', officialFare: 8.00, fareDisplay: '٨.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'جميع محطات المترو', level: 1 },
  { id: 'tar-metro-16stops', category: 'metro', from: 'شبكة المترو', to: 'من ١٠ إلى ١٦ محطة', officialFare: 10.00, fareDisplay: '١٠.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'جميع محطات المترو', level: 1 },
  { id: 'tar-metro-23stops', category: 'metro', from: 'شبكة المترو', to: 'من ١٧ إلى ٢٣ محطة', officialFare: 15.00, fareDisplay: '١٥.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'جميع محطات المترو', level: 1 },
  { id: 'tar-metro-more23', category: 'metro', from: 'شبكة المترو', to: 'أكثر من ٢٣ محطة', officialFare: 20.00, fareDisplay: '٢٠.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'جميع محطات المترو', level: 1 },

  // ب. مواقف الميكروباص الاقليمية والداخلية بالقاهرة
  { id: 'tar-cairo-ramses-giza', category: 'internal_microbus', from: 'موقف رمسيس', to: 'ميدان الجيزة', officialFare: 7.00, fareDisplay: '٧.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'موقف رمسيس (أحمد حلمي / الشهداء)' },
  { id: 'tar-cairo-abboud-ramses', category: 'internal_microbus', from: 'موقف عبود', to: 'رمسيس / العتبة', officialFare: 6.50, fareDisplay: '٦.٥٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'موقف عبود العمومي' },
  { id: 'tar-cairo-salam-tagamoa', category: 'internal_microbus', from: 'موقف السلام', to: 'التجمع الخامس (الجامعة الأمريكية)', officialFare: 14.00, fareDisplay: '١٤.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'موقف السلام النموذجي' },
  { id: 'tar-cairo-monib-october', category: 'internal_microbus', from: 'موقف المنيب', to: '٦ أكتوبر (الحصري)', officialFare: 13.50, fareDisplay: '١٣.٥٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'موقف المنيب العلوي' },
  { id: 'tar-cairo-marg-sheikhzayed', category: 'internal_microbus', from: 'المرج الجديدة', to: 'الشيخ زايد (الهايبر)', officialFare: 18.00, fareDisplay: '١٨.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'موقف المرج الجديدة' },
  { id: 'tar-cairo-helwan-ramses', category: 'internal_microbus', from: 'حلوان', to: 'رمسيس / تحرير', officialFare: 10.00, fareDisplay: '١٠.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'موقف حلوان العام' },

  // ج. وسائل النقل الحديثة (المونوريل والـ BRT والقطار الكهربائي LRT)
  { id: 'tar-monorail-east', category: 'monorail', from: 'محطة الاستاد (مدينة نصر)', to: 'العاصمة الإدارية الجديدة', officialFare: 40.00, fareDisplay: '٤٠.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'محطة الاستاد - الخط الثالث' },
  { id: 'tar-lrt-adlymansour', category: 'lrt', from: 'عدلي منصور', to: 'مدينة الفنون والثقافة (العاصمة)', officialFare: 35.00, fareDisplay: '٣٥.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'مجمع عدلي منصور التبادلي' },
  { id: 'tar-brt-ringroad', category: 'brt', from: 'الأتوبيس الترددي السريع (BRT)', to: 'محطات الدائري', officialFare: 15.00, fareDisplay: '١٥.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦', terminalFrom: 'مواقف الدائري والمحطات التبادلية' },

  // د. أتوبيسات هيئة النقل العام والنقل الجماعي
  { id: 'tar-cta-standard', category: 'cta_bus', from: 'داخل القاهرة الكبرى', to: 'أتوبيس هيئة النقل العام (عادي)', officialFare: 9.00, fareDisplay: '٩.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦' },
  { id: 'tar-cta-aircon', category: 'cta_bus', from: 'داخل القاهرة الكبرى', to: 'أتوبيس مكيف / ميني باص خاص', officialFare: 15.00, fareDisplay: '١٥.٠٠ ج.م', status: 'معتمدة - مارس ٢٠٢٦' }
];

// ==========================================
// 2. OFFICIAL TAXI METER RATE - GREATER CAIRO
// ==========================================
export const CAIRO_OFFICIAL_TAXI_METER: TaxiMeterRate = {
  baseFare: 13.50, // فتح البنديرة (يشمل أول كم)
  baseDistanceKm: 1.0,
  perKmRate: 4.00, // كل كم إضافي
  firstHourWaitRate: 23.00,
  additionalHourWaitRate: 20.00,
  effectiveDate: 'مارس ٢٠٢٦'
};

// ==========================================
// 3. FULL TERMINAL GPS DIRECTORY - CAIRO REGION
// ==========================================
export const CAIRO_TERMINAL_LOCATIONS: TerminalLocation[] = [
  {
    id: 'term-ramses',
    name: 'موقف ومركز رمسيس الرئيسي (أحمد حلمي / موقف مواصلات مصر)',
    city: 'القاهرة',
    region: 'وسط البلد',
    serves: ['جميع أحياء القاهرة الكبرى', 'الجيزة', 'أكتوبر', 'المعادي', 'التجمع', 'خطوط المحافظات'],
    lat: 30.0632,
    lng: 31.2481,
    notes: 'نقطة الارتكاز الأكبر في العاصمة، يربط السكة الحديد بالمترو والميكروباص.',
    isMainHub: true
  },
  {
    id: 'term-abboud',
    name: 'موقف عبود العمومي للأقاليم والداخل',
    city: 'القاهرة',
    region: 'شبرا',
    serves: ['وجه بحري والدلتا', 'خطوط داخلية لرمسيس والعتبة والمظلات'],
    lat: 30.0965,
    lng: 31.2505,
    isMainHub: true
  },
  {
    id: 'term-salam',
    name: 'موقف السلام النموذجي التبادلي',
    city: 'القاهرة',
    region: 'مدينة السلام',
    serves: ['مدن القناة', 'الشرقية', 'العاشر من رمضان', 'التجمع الخامسة', 'العاصمة الإدارية'],
    lat: 30.1580,
    lng: 31.4285,
    isMainHub: true
  },
  {
    id: 'term-monib',
    name: 'موقف المنيب العلوي والميداني',
    city: 'الجيزة',
    region: 'المنيب',
    serves: ['الصعيد (وجه قبلي)', '٦ أكتوبر', 'الشيخ زايد', 'الهرم والفيوم'],
    lat: 29.9811,
    lng: 31.2520,
    isMainHub: true
  },
  {
    id: 'term-adlymansour',
    name: 'مجمع مجمع عدلي منصور المركزي التبادلي',
    city: 'القاهرة',
    region: 'الشرقية / السلام',
    serves: ['المترو الخط الثالث', 'القطار الكهربائي LRT', 'موقف السوبرجيت', 'الأتوبيس الترددي BRT'],
    lat: 30.1465,
    lng: 31.4332,
    notes: 'أكبر محطة تبادلية بالشرق الأوسط.',
    isMainHub: true
  },
  {
    id: 'term-giza-sq',
    name: 'موقف ميدان الجيزة (تحت الكوبري)',
    city: 'الجيزة',
    region: 'وسط الجيزة',
    serves: ['الهرم', 'فيصل', 'المحDirectory', 'أكتوبر', 'جامعة القاهرة', 'رمسيس'],
    lat: 30.0105,
    lng: 31.2070,
    isMainHub: true
  },
  {
    id: 'term-tagamoa-luts',
    name: 'موقف اللوتس ومحور المشير (التجمع الخامس)',
    city: 'القاهرة الجديدة',
    region: 'التجمع الخامس',
    serves: ['الجامعة الأمريكية', 'شارع التسعين', 'مكرم عبيد', 'مدينة نصر', 'المدينة الرياضية'],
    lat: 30.0260,
    lng: 31.4720
  },
  {
    id: 'term-october-hosary',
    name: 'موقف ميدان الحصري',
    city: '٦ أكتوبر',
    region: 'أكتوبر',
    serves: ['المنطقة الصناعية', 'جامعة ٦ أكتوبر', 'المنيب', 'رمسيس', 'ميدان الجيزة'],
    lat: 29.9722,
    lng: 30.9460,
    isMainHub: true
  }
];

// ==========================================
// 4. MAIN CAIRO_STATIONS DIRECTORY
// ==========================================
export const CAIRO_STATIONS: Station[] = [
  // 1. Ramses Railway & Metro Station (الشهداء / رمسيس)
  {
    id: 'cairo-ramses-central',
    name: 'محطة رمسيس ومحطة مترو الشهداء',
    nameEn: 'Ramses Central Station & Al-Shohadaa Metro',
    city: 'القاهرة - وسط البلد',
    mode: 'train',
    lines: ['metro-line1', 'metro-line2', 'cta-ramses-giza', 'microbus-ramses-tagamoa', 'microbus-ramses-october', 'publicbus-ramses-giza'],
    lat: 30.0632,
    lng: 31.2481,
    x: 500,
    y: 400,
    isHub: true,
    transfers: ['مترو الخط الأول', 'مترو الخط الثاني', 'محطة قطارات مصر', 'موقف أحمد حلمي', 'موقف مواصلات مصر'],
    fareInfo: '٨ - ٢٠ ج.م مترو / ٧ - ٢٠ ج.م سرفيس وميكروباص',
    description: 'القلب النابض لشبكة النقل بالقاهرة الكبرى والتقاطع الرئيسي بين الخطين الأول والثاني للمترو والسكك الحديدية.',
    departures: [
      { destination: 'الجيزة والمنيب (مترو الخط ٢)', platform: 'رصيف مترو ٢', time: 'مستمر', frequency: 'كل دقيقتين', price: '٨.٠٠ ج.م' },
      { destination: 'المرج الجديدة (مترو الخط ١)', platform: 'رصيف مترو ١', time: 'مستمر', frequency: 'كل دقيقتين', price: '١٠.٠٠ ج.م' },
      { destination: 'التجمع الخامس (ميكروباص)', platform: 'موقف أحمد حلمي', time: 'مستمر', frequency: 'كل ٥ دقائق', price: '١٤.٠٠ ج.م' },
      { destination: '٦ أكتوبر (الحصري)', platform: 'موقف رمسيس العلوي', time: 'مستمر', frequency: 'كل ٥ دقائق', price: '١٦.٠٠ ج.م' }
    ]
  },

  // 2. Sadat / Tahrir Square (مترو السادات / ميدان التحرير)
  {
    id: 'metro-sadat-tahrir',
    name: 'محطة مترو السادات (ميدان التحرير)',
    nameEn: 'Sadat Metro Station (Tahrir Square)',
    city: 'القاهرة - وسط البلد',
    mode: 'metro',
    lines: ['metro-line1', 'metro-line2', 'cta-tahrir-tagamoa'],
    lat: 30.0444,
    lng: 31.2357,
    x: 480,
    y: 520,
    isHub: true,
    transfers: ['التقاطع التبادلي بين الخط الأول والثاني', 'مجمع التحرير', 'أتوبيسات عبد المنعم رياض'],
    fareInfo: '٨ - ٢٠ ج.م (حسب عدد المحطات)',
    description: 'المحطة التبادلية الأكثر شهرة بقلب القاهرة بميدان التحرير، وتصل لمتحف الحضارة والمتحف المصري.',
    departures: [
      { destination: 'حلوان (الخط الأول)', platform: 'رصيف ١', time: 'مستمر', frequency: 'كل دقيقتين', price: '١٠.٠٠ ج.م' },
      { destination: 'شبرا الخيمة (الخط الثاني)', platform: 'رصيف ٢', time: 'مستمر', frequency: 'كل ٣ دقائق', price: '٨.٠٠ ج.م' }
    ]
  },

  // 3. Adly Mansour Hub (محطة عدلي منصور التبادلية)
  {
    id: 'adly-mansour-hub',
    name: 'محطة عدلي منصور التبادلية الكبرى',
    nameEn: 'Adly Mansour Central Interchange Station',
    city: 'القاهرة - طريق الإسماعيلية',
    mode: 'metro',
    lines: ['metro-line3', 'lrt-capital', 'brt-ringroad'],
    lat: 30.1465,
    lng: 31.4332,
    x: 820,
    y: 200,
    isHub: true,
    transfers: ['الخط الثالث للمترو', 'القطار الكهربائي الخفيف LRT', 'الأتوبيس الترددي BRT', 'موقف الأقاليم'],
    fareInfo: '٨ - ٢٠ ج.م مترو / ٣٥ ج.م LRT',
    description: 'أضخم مجمع نقل تبادلي متكامل يربط شرق القاهرة بالعاصمة الإدارية الجديدة ومطار القاهرة.',
    departures: [
      { destination: 'محطة محور روض الفرج / جامعة القاهرة (مترو الخط ٣)', platform: 'رصيف الخط ٣', time: 'مستمر', frequency: 'كل ٤ دقائق', price: '١٥.٠٠ ج.م' },
      { destination: 'العاصمة الإدارية (القطار الكهربائي LRT)', platform: 'رصيف LRT', time: 'مستمر', frequency: 'كل ١٥ دقيقة', price: '٣٥.٠٠ ج.م' }
    ]
  },

  // 4. Attaba Station (محطة العتبة)
  {
    id: 'metro-attaba',
    name: 'محطة مترو العتبة',
    nameEn: 'Attaba Metro Station',
    city: 'القاهرة - وسط البلد',
    mode: 'metro',
    lines: ['metro-line2', 'metro-line3'],
    lat: 30.0528,
    lng: 31.2472,
    x: 520,
    y: 480,
    isHub: true,
    transfers: ['التقاطع بين الخط الثاني والخط الثالث', 'سوق العتبة والموسكي'],
    fareInfo: '٨ - ٢٠ ج.م مترو',
    description: 'محطة مركزية رئيسية للربط بين الخط الثاني المار بشرق وغرب القاهرة والخط الثالث السريع.'
  },

  // 5. Giza Railway & Metro Station (محطة الجيزة)
  {
    id: 'giza-central-station',
    name: 'محطة قطارات ومترو الجيزة',
    nameEn: 'Giza Railway & Metro Station',
    city: 'الجيزة - المنيب / المهر',
    mode: 'metro',
    lines: ['metro-line2', 'cta-ramses-giza', 'microbus-giza-october', 'publicbus-ramses-giza'],
    lat: 30.0105,
    lng: 31.2070,
    x: 350,
    y: 680,
    isHub: true,
    transfers: ['مترو الخط الثاني', 'قطارات الصعيد', 'موقف ميكروباص الهرم وفيصل وأكتوبر'],
    fareInfo: '٨ - ١٥ ج.م مترو / ٥ - ١٥ ج.م سرفيس',
    description: 'المحطة المركزية الأهم لخدمة محافظة الجيزة وربطها بقطارات الجنوب ووسط القاهرة.'
  },

  // 6. Cairo University Station (محطة جامعة القاهرة)
  {
    id: 'metro-cairo-univ',
    name: 'محطة مترو جامعة القاهرة',
    nameEn: 'Cairo University Metro Station',
    city: 'الجيزة - بين السرايات',
    mode: 'metro',
    lines: ['metro-line2', 'metro-line3'],
    lat: 30.0261,
    lng: 31.2012,
    x: 330,
    y: 620,
    isHub: true,
    transfers: ['التبادل بين الخط الثاني والخط الثالث (تفريعة إمبابة/جامعة القاهرة)'],
    fareInfo: '٨ - ١٥ ج.م مترو',
    description: 'نقطة الخدمة الرئيسية لجامعة القاهرة والمناطق المحيطة بها في الدقي والجيزة.'
  },

  // 7. Stadium Monorail & Metro Station (محطة الاستاد)
  {
    id: 'metro-stadium-monorail',
    name: 'محطة مترو ومونوريل الاستاد (مدينة نصر)',
    nameEn: 'Stadium Metro & Monorail Station',
    city: 'القاهرة - مدينة نصر',
    mode: 'monorail',
    lines: ['metro-line3', 'monorail-east'],
    lat: 30.0710,
    lng: 31.3015,
    x: 680,
    y: 380,
    isHub: true,
    transfers: ['الخط الثالث للمترو', 'محطة انطلاق مونوريل شرق النيل'],
    fareInfo: '١٠ - ١٥ ج.م مترو / ٤٠ ج.م مونوريل',
    description: 'الربط المباشر والحيوي بين خط المترو الثالث ومونوريل شرق النيل المتجه للتجمع والعاصمة الإدارية.'
  },

  // 8. AUC Tagamoa Station (موقف الجامعة الأمريكية والتجمع)
  {
    id: 'auc-tagamoa-hub',
    name: 'موقف الجامعة الأمريكية والتجمع الخامس',
    nameEn: 'AUC & New Cairo Terminal',
    city: 'القاهرة الجديدة',
    mode: 'microbus',
    lines: ['microbus-ramses-tagamoa', 'monorail-east'],
    lat: 30.0211,
    lng: 31.4988,
    x: 900,
    y: 600,
    isHub: true,
    transfers: ['ميكروباص السلام ورمسيس', 'محطة المونوريل - AUC', 'مواصلات مصر'],
    fareInfo: '١٤ - ٢٠ ج.م',
    description: 'المركز الرئيسي لمواصلات القاهرة الجديدة وشارع التسعين الجنوبي والجامعات.'
  },

  // 9. October Hosary Square (ميدان الحصري ٦ أكتوبر)
  {
    id: 'october-hosary-sq',
    name: 'ميدان الحصري وموقف ٦ أكتوبر',
    nameEn: 'El-Hosary Square Terminal (6th of October)',
    city: '٦ أكتوبر',
    mode: 'microbus',
    lines: ['microbus-ramses-october', 'microbus-giza-october'],
    lat: 29.9722,
    lng: 30.9460,
    x: 100,
    y: 800,
    isHub: true,
    transfers: ['ميكروباصات المنيب والجيزة ورمسيس', 'السرفيس الداخلي لأكتوبر والشيخ زايد'],
    fareInfo: '١٣.٥ - ١٨.٠ ج.م',
    description: 'قلب مدينة ٦ أكتوبر النابض ونقطة بداية وانطلاق أغلب خطوط المواصلات السريعة للجيزة والقاهرة.'
  }
];

// ==========================================
// 5. TRANSIT LINES DIRECTORY (METRO, MONORAIL, MICROBUS)
// ==========================================
export const CAIRO_TRANSIT_LINES: TransitLine[] = [
  // 1. Metro Line 1 (الخط الأول: حلوان - المرج الجديدة)
  {
    id: 'metro-line1',
    name: 'مترو الخط الأول (حلوان ↔ المرج الجديدة)',
    mode: 'metro',
    color: 'var(--color-rail-blue)', // أزرق
    lineCode: 'الخط ١',
    origin: 'حلوان',
    destination: 'المرج الجديدة',
    fareRange: '٨ - ٢٠ جنيه',
    frequency: 'كل دقيقتين',
    operatingHours: '٠٥:١٥ ص - ١٢:٣٠ منتصف الليل',
    stationIds: ['metro-sadat-tahrir', 'cairo-ramses-central'],
    streetPathDescription: 'مسار المترو الرئيسي الممتد من جنوب القاهرة (حلوان، المعادي) مروراً بالتحرير ورمسيس وصولاً للشمال (المرج).',
    streetsList: ['محور كورنيش النيل', 'وسط البلد', 'شارع رمسيس', 'شارع كوبري القبة', 'طريق مصر الإسماعلية'],
    landmarks: ['جامعة حلوان', 'مجمع التحرير', 'محطة مصر برمسيس', 'سراي القبة'],
    detailedPathLatLngs: [
      [29.8415, 31.3008], // حلوان
      [29.9592, 31.2581], // المعادي
      [30.0444, 31.2357], // السادات (التحرير)
      [30.0632, 31.2481], // الشهداء (رمسيس)
      [30.1008, 31.2863], // حدائق القبة
      [30.1522, 31.3356]  // المرج الجديدة
    ]
  },

  // 2. Metro Line 2 (الخط الثاني: شبرا الخيمة - المنيب)
  {
    id: 'metro-line2',
    name: 'مترو الخط الثاني (شبرا الخيمة ↔ المنيب)',
    mode: 'metro',
    color: 'var(--color-rail-gold)', // برتقالي/ذهبي
    lineCode: 'الخط ٢',
    origin: 'شبرا الخيمة',
    destination: 'المنيب (الجيزة)',
    fareRange: '٨ - ١٥ جنيه',
    frequency: 'كل دقيقتين',
    operatingHours: '٠٥:١٥ ص - ١٢:٣٠ منتصف الليل',
    stationIds: ['cairo-ramses-central', 'metro-attaba', 'metro-sadat-tahrir', 'metro-cairo-univ', 'giza-central-station'],
    streetPathDescription: 'يعبر النيل ليربط بين محافظة القليوبية وشبرا، مع القاهرة (رمسيس والعتبة والتحرير) ومحافظة الجيزة (الجامعة والمنيب).',
    streetsList: ['شارع شبرا', 'ميدان رمسيس', 'شارع أوبرا', 'ميدان التحرير', 'الدقي', 'شارع أهرام الجيزة'],
    landmarks: ['موقف عبود', 'محطة رمسيس', 'ميدان العتبة', 'برج القاهرة', 'جامعة القاهرة', 'محطة الجيزة'],
    detailedPathLatLngs: [
      [30.1225, 31.2440], // شبرا الخيمة
      [30.0632, 31.2481], // الشهداء (رمسيس)
      [30.0528, 31.2472], // العتبة
      [30.0444, 31.2357], // السادات
      [30.0381, 31.2115], // الدقي
      [30.0261, 31.2012], // جامعة القاهرة
      [30.0105, 31.2070], // الجيزة
      [29.9811, 31.2520]  // المنيب
    ]
  },

  // 3. Metro Line 3 (الخط الثالث: عدلي منصور - محور روض الفرج / جامعة القاهرة)
  {
    id: 'metro-line3',
    name: 'مترو الخط الثالث (عدلي منصور ↔ جامعة القاهرة / روض الفرج)',
    mode: 'metro',
    color: 'var(--color-rail-green)', // أخضر زمردي
    lineCode: 'الخط ٣',
    origin: 'عدلي منصور (مجمع التبادل)',
    destination: 'محور روض الفرج / جامعة القاهرة',
    fareRange: '٨ - ٢٠ جنيه',
    frequency: 'كل ٣ دقائق',
    operatingHours: '٠٥:١٥ ص - ١٢:٣٠ منتصف الليل',
    stationIds: ['adly-mansour-hub', 'metro-stadium-monorail', 'metro-attaba', 'metro-cairo-univ'],
    streetPathDescription: 'أحدث خط مترو عرضي يربط أقصى شرق القاهرة بالهليوبوليس ومدينة نصر وممر العتبة والكيت كات حتى الجيزة.',
    streetsList: ['طريق مصر الإسماعيلية', 'شارع الميرغني', 'شارع النصر', 'شارع الجيش', 'شارع 26 يوليو', 'الكيت كات'],
    landmarks: ['مجمع عدلي منصور', 'مطار القاهرة (قريب)', 'استاد القاهرة', 'الكيت كات', 'جامعة القاهرة'],
    detailedPathLatLngs: [
      [30.1465, 31.4332], // عدلي منصور
      [30.1130, 31.3380], // مصر الجديدة (هليوبوليس)
      [30.0710, 31.3015], // الاستاد
      [30.0528, 31.2472], // العتبة
      [30.0662, 31.2140], // الكيت كات
      [30.0261, 31.2012]  // جامعة القاهرة
    ]
  },

  // 4. Monorail East Cairo (مونوريل شرق النيل: الاستاد - العاصمة الإدارية)
  {
    id: 'monorail-east',
    name: 'مونوريل شرق النيل (محطة الاستاد ↔ العاصمة الإدارية)',
    mode: 'monorail',
    color: 'var(--color-rail-purple)', // بنفسجي
    lineCode: 'مونوريل العاصمة',
    origin: 'محطة الاستاد (مدينة نصر)',
    destination: 'العاصمة الإدارية الجديدة',
    fareRange: '٤٠ جنيه',
    frequency: 'كل ٥ دقائق',
    operatingHours: '٠٦:٠٠ ص - ١١:٠٠ م',
    stationIds: ['metro-stadium-monorail', 'auc-tagamoa-hub'],
    streetPathDescription: 'وسيلة نقل معلقة رفيعة المستوى تمر بقلب مدينة نصر، محور المشير طنطاوي، شارع التسعين الشمالي والجنوبي بالتجمع الخامس وصولاً للعاصمة الإدارية.',
    streetsList: ['شارع يوسف عباس', 'محور المشير طنطاوي', 'شارع التسعين الجنوبي', 'محور بن زايد'],
    landmarks: ['استاد القاهرة', 'محور المشير', 'مجمع الكليات بالتجمع', 'الجامعة الأمريكية AUC', 'حي الوزارات بالعاصمة'],
    detailedPathLatLngs: [
      [30.0710, 31.3015], // محطة الاستاد
      [30.0410, 31.3650], // محور المشير
      [30.0260, 31.4210], // شارع التسعين
      [30.0211, 31.4988], // AUC التجمع
      [30.0150, 31.7500]  // العاصمة الإدارية
    ]
  },

  // 5. Regional Microbus: Ramses to Tagamoa (رمسيس ↔ التجمع الخامس)
  {
    id: 'microbus-ramses-tagamoa',
    name: 'ميكروباص خط سريع (رمسيس ↔ التجمع الخامس / الجامعة الأمريكية)',
    mode: 'microbus',
    color: 'var(--color-microbus)',
    lineCode: 'سرفيس التجمع',
    origin: 'محطة رمسيس (موقف أحمد حلمي)',
    destination: 'التجمع الخامس (موقف اللوتس / AUC)',
    fareRange: '١٤.٠٠ جنيه',
    frequency: 'كل ٥ دقائق',
    operatingHours: 'على مدار ٢٤ ساعة',
    stationIds: ['cairo-ramses-central', 'auc-tagamoa-hub'],
    streetPathDescription: 'رمسيس ← طريق النصر (مدينة نصر) ← كوبري الأكتوبر / محور المشير طنطاوي ← الدائري ← شارع التسعين الجنوبية ← موقف AUC.',
    streetsList: ['شارع رمسيس', 'شارع امتداد رمسيس', 'محور المشير طنطاوي', 'شارع التسعين الجنوبي'],
    landmarks: ['منصة الشداء', 'استاد القاهرة', 'كايرو فيستيفال سيتي', 'الجامعة الأمريكية'],
    detailedPathLatLngs: [
      [30.0632, 31.2481], // رمسيس
      [30.0520, 31.2910], // امتداد رمسيس
      [30.0380, 31.3500], // محور المشير
      [30.0280, 31.4050], // أول التسعين
      [30.0211, 31.4988]  // الجامعة الأمريكية
    ]
  },

  // 6. Regional Microbus: Ramses to 6th of October (رمسيس ↔ ٦ أكتوبر)
  {
    id: 'microbus-ramses-october',
    name: 'ميكروباص مباشر (موقف رمسيس ↔ ٦ أكتوبر ميدان الحصري)',
    mode: 'microbus',
    color: 'var(--color-public-bus)',
    lineCode: 'سرفيس أكتوبر',
    origin: 'موقف رمسيس',
    destination: '٦ أكتوبر (ميدان الحصري)',
    fareRange: '١٦.٠٠ جنيه',
    frequency: 'كل ٥ دقائق',
    operatingHours: '٠٥:٣٠ ص - ٠١:٠٠ ص',
    stationIds: ['cairo-ramses-central', 'october-hosary-sq'],
    streetPathDescription: 'موقف رمسيس ← كوبري 15 مايو ← الزمالك ← المحور المركزي (محور 26 يوليو) ← ميدان فودافون ← ميدان الحصري بأكتوبر.',
    streetsList: ['كوبري 15 مايو', 'محور 26 يوليو', 'المحور المركزي بأكتوبر'],
    landmarks: ['الزمالك', 'الهايبر ون الشيخ زايد', 'مول العرب', 'جامعة 6 أكتوبر', 'مسجد الحصري'],
    detailedPathLatLngs: [
      [30.0632, 31.2481], // رمسيس
      [30.0580, 31.2180], // 15 مايو / الزمالك
      [30.0120, 31.0250], // محور 26 يوليو
      [29.9810, 30.9650], // مدخل أكتوبر
      [29.9722, 30.9460]  // ميدان الحصري
    ]
  },

  // 7. BRT Ring Road (الأتوبيس الترددي السريع)
  {
    id: 'brt-ringroad',
    name: 'الأتوبيس الترددي السريع BRT (محطات الدائري)',
    mode: 'brt',
    color: 'var(--color-brt)',
    lineCode: 'BRT',
    origin: 'محطة عدلي منصور التبادلية',
    destination: 'مواقف ومحطات الدائري',
    fareRange: '١٥.٠٠ جنيه',
    frequency: 'كل ١٠ دقائق',
    operatingHours: '٠٦:٠٠ ص - ١١:٠٠ م',
    stationIds: ['adly-mansour-hub', 'cairo-ramses-central'],
    streetPathDescription: 'خط ترددي سريع يربط محطات التبادل بالمسار الدائري ومواقف الركوب الرئيسية.',
    streetsList: ['طريق الإسماعيلية', 'الطريق الدائري', 'محاور القاهرة الكبرى'],
    landmarks: ['عدلي منصور', 'مواقف الدائري', 'محطات التبادل'],
    detailedPathLatLngs: [[30.1465, 31.4332], [30.1580, 31.4285], [30.1200, 31.3000], [30.0632, 31.2481]]
  },

  // 8. Cairo Public Bus (أتوبيس هيئة النقل العام)
  {
    id: 'publicbus-ramses-giza',
    name: 'أتوبيس النقل العام (رمسيس ↔ الجيزة)',
    mode: 'public_bus',
    color: 'var(--color-public-bus)',
    lineCode: 'نقل عام',
    origin: 'موقف رمسيس',
    destination: 'ميدان الجيزة',
    fareRange: '٩.٠٠ - ١٥.٠٠ جنيه',
    frequency: 'كل ١٠ - ٢٠ دقيقة',
    operatingHours: '٠٥:٣٠ ص - ١٢:٠٠ منتصف الليل',
    stationIds: ['cairo-ramses-central', 'giza-central-station'],
    streetPathDescription: 'أتوبيس نقل عام يربط وسط القاهرة بالجيزة عبر المحاور الرئيسية.',
    streetsList: ['شارع رمسيس', 'ميدان التحرير', 'شارع الجامعة', 'ميدان الجيزة'],
    landmarks: ['محطة مصر', 'ميدان التحرير', 'جامعة القاهرة', 'ميدان الجيزة'],
    detailedPathLatLngs: [[30.0632, 31.2481], [30.0444, 31.2357], [30.0261, 31.2012], [30.0105, 31.2070]]
  }
];

// ==========================================
// 6. CAIRO ROUTE CALCULATION ALGORITHM
// ==========================================
export function calculateCairoTripRoute(fromName: string, toName: string): CalculatedRoute | null {
  const fromStation = CAIRO_STATIONS.find(
    s => s.name.toLowerCase().includes(fromName.toLowerCase()) || 
         s.id.toLowerCase() === fromName.toLowerCase() ||
         fromName.toLowerCase().includes(s.name.toLowerCase())
  ) || CAIRO_STATIONS[0]; // Default: Ramses Central

  const toStation = CAIRO_STATIONS.find(
    s => s.name.toLowerCase().includes(toName.toLowerCase()) || 
         s.id.toLowerCase() === toName.toLowerCase() ||
         toName.toLowerCase().includes(s.name.toLowerCase())
  ) || CAIRO_STATIONS[7]; // Default: AUC Tagamoa

  if (fromStation.id === toStation.id) {
    return {
      id: `route-same-${fromStation.id}`,
      fromStation: fromStation.name,
      toStation: toStation.name,
      totalDurationMins: 0,
      totalStops: 0,
      totalFare: 0,
      transfersCount: 0,
      type: 'fastest',
      pathCoords: [{ x: fromStation.x ?? 0, y: fromStation.y ?? 0 }],
      pathLatLngs: [[fromStation.lat, fromStation.lng]],
      streetGuide: ['أنت بالفعل في وجهتك المحددة داخل القاهرة الكبرى.'],
      legs: []
    };
  }

  // 1. Cairo Transit Special Logic: Ramses to Tagamoa
  if (fromStation.id === 'cairo-ramses-central' && toStation.id === 'auc-tagamoa-hub') {
    const microbusLine = CAIRO_TRANSIT_LINES.find(l => l.id === 'microbus-ramses-tagamoa')!;

    return {
      id: 'route-ramses-to-tagamoa',
      fromStation: fromStation.name,
      toStation: toStation.name,
      totalDurationMins: 45,
      totalStops: 4,
      totalFare: 14.0,
      transfersCount: 0,
      type: 'fastest',
      pathCoords: [
        { x: fromStation.x ?? 500, y: fromStation.y ?? 400 },
        { x: 680, y: 380 },
        { x: toStation.x ?? 900, y: toStation.y ?? 600 }
      ],
      pathLatLngs: microbusLine.detailedPathLatLngs,
      streetGuide: [
        '١. اركب ميكروباص خط التجمع المباشر من موقف أحمد حلمي بجوار محطة رمسيس.',
        '٢. سيسير المركب عبر شارع امتداد رمسيس ← محور المشير طنطاوي ← شارع التسعين الجنوبي بالتجمع الخامس.',
        '٣. انزل في موقف اللوتس / الجامعة الأمريكية AUC (الزمن التقديري ٤٥ دقيقة - التعريفة الرسمية ١٤ ج.م).'
      ],
      legs: [
        {
          mode: 'microbus',
          lineName: microbusLine.name,
          lineCode: microbusLine.lineCode,
          fromStation: fromStation.name,
          toStation: toStation.name,
          stopsCount: 3,
          durationMins: 45,
          fare: 14.0,
          color: microbusLine.color,
          stopsList: [fromStation.name, 'محور المشير طنطاوي', 'أول التسعين', toStation.name],
          streetDirections: microbusLine.streetsList,
          legPathLatLngs: microbusLine.detailedPathLatLngs
        }
      ]
    };
  }

  // 2. Direct Metro Route Strategy
  const directLine = CAIRO_TRANSIT_LINES.find(line => 
    line.stationIds.includes(fromStation.id) && line.stationIds.includes(toStation.id)
  );

  if (directLine) {
    const fromIdx = directLine.stationIds.indexOf(fromStation.id);
    const toIdx = directLine.stationIds.indexOf(toStation.id);
    const stopsCount = Math.abs(fromIdx - toIdx);
    const duration = stopsCount * 3 + 5;
    const fare = directLine.mode === 'metro' ? (stopsCount <= 9 ? 8 : stopsCount <= 16 ? 10 : 15) : 16;

    return {
      id: `route-direct-cairo-${fromStation.id}-${toStation.id}`,
      fromStation: fromStation.name,
      toStation: toStation.name,
      totalDurationMins: duration,
      totalStops: stopsCount,
      totalFare: fare,
      transfersCount: 0,
      type: 'fastest',
      pathCoords: [
        { x: fromStation.x ?? 0, y: fromStation.y ?? 0 },
        { x: toStation.x ?? 0, y: toStation.y ?? 0 }
      ],
      pathLatLngs: directLine.detailedPathLatLngs,
      streetGuide: [
        `اركب مباشرة ${directLine.name} من محطة ${fromStation.name}.`,
        `المسار يمر بدون تبديل عبر: ${directLine.streetPathDescription}`,
        `الوصول المباشر إلى محطة ${toStation.name}.`
      ],
      legs: [
        {
          mode: directLine.mode,
          lineName: directLine.name,
          lineCode: directLine.lineCode,
          fromStation: fromStation.name,
          toStation: toStation.name,
          stopsCount,
          durationMins: duration,
          fare,
          color: directLine.color,
          stopsList: [fromStation.name, toStation.name],
          streetDirections: directLine.streetsList,
          legPathLatLngs: directLine.detailedPathLatLngs
        }
      ]
    };
  }

  // 3. Fallback Transfer Strategy via Sadat / Ramses Interchange Hub
  const hubStation = CAIRO_STATIONS.find(s => s.id === 'metro-sadat-tahrir')!;

  return {
    id: `route-cairo-transfer-${fromStation.id}-${toStation.id}`,
    fromStation: fromStation.name,
    toStation: toStation.name,
    totalDurationMins: 35,
    totalStops: 6,
    totalFare: 18.0,
    transfersCount: 1,
    type: 'fastest',
    pathCoords: [
      { x: fromStation.x ?? 0, y: fromStation.y ?? 0 },
      { x: hubStation.x ?? 480, y: hubStation.y ?? 520 },
      { x: toStation.x ?? 0, y: toStation.y ?? 0 }
    ],
    pathLatLngs: [
      [fromStation.lat, fromStation.lng],
      [hubStation.lat, hubStation.lng],
      [toStation.lat, toStation.lng]
    ],
    streetGuide: [
      `١. استقل المترو من محطة ${fromStation.name} متجهاً نحو محطة السادات التبادلية بوسط البلد.`,
      `٢. في محطة السادات، بَدِّل الخط باتجاه خط ${toStation.name}.`,
      `٣. واصل طريقك حتى الوصول لمحطة ${toStation.name}.`
    ],
    legs: [
      {
        mode: 'metro',
        lineName: 'شبكة المترو (المرحلة الأولى)',
        lineCode: 'مترو الأنفاق',
        fromStation: fromStation.name,
        toStation: hubStation.name,
        stopsCount: 3,
        durationMins: 15,
        fare: 10.0,
        color: 'var(--color-rail-blue)',
        stopsList: [fromStation.name, hubStation.name],
        legPathLatLngs: [[fromStation.lat, fromStation.lng], [hubStation.lat, hubStation.lng]]
      },
      {
        mode: 'metro',
        lineName: 'شبكة المترو (المرحلة الثانية)',
        lineCode: 'مترو الأنفاق',
        fromStation: hubStation.name,
        toStation: toStation.name,
        stopsCount: 3,
        durationMins: 20,
        fare: 8.0,
        color: 'var(--color-rail-gold)',
        stopsList: [hubStation.name, toStation.name],
        legPathLatLngs: [[hubStation.lat, hubStation.lng], [toStation.lat, toStation.lng]]
      }
    ]
  };
}

// ==========================================
// 7. INITIAL USER PROFILE - CAIRO EDITION
// ==========================================
export const CAIRO_INITIAL_USER_PROFILE: UserProfileData = {
  name: 'م. كريم المصري',
  email: 'kareem.cairo@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  tier: 'عضو بلاتيني • ركاب القاهرة الكبرى',
  balance: 320.0,
  monthlyTrips: 52,
  carbonSavedKg: 48.2,
  weeklyActivity: [
    { day: 'السبت', trips: 6 },
    { day: 'الأحد', trips: 8 },
    { day: 'الاثنين', trips: 7 },
    { day: 'الثلاثاء', trips: 9 },
    { day: 'الأربعاء', trips: 8 },
    { day: 'الخميس', trips: 10 },
    { day: 'الجمعة', trips: 4 }
  ],
  favoriteRoutes: [
    {
      id: 'fav-cairo-1',
      title: 'التجمع من موقف رمسيس',
      from: 'محطة رمسيس ومحطة مترو الشهداء',
      to: 'موقف الجامعة الأمريكية والتجمع الخامس',
      duration: '٤٥ دقيقة',
      transfers: [
        { name: 'ميكروباص خط التجمع السريع', mode: 'microbus', color: 'var(--color-microbus)' }
      ]
    },
    {
      id: 'fav-cairo-2',
      title: 'العاصمة من الاستاد (المونوريل)',
      from: 'محطة مترو ومونوريل الاستاد (مدينة نصر)',
      to: 'العاصمة الإدارية الجديدة',
      duration: '٣٥ دقيقة',
      transfers: [
        { name: 'مونوريل شرق النيل', mode: 'monorail', color: 'var(--color-rail-purple)' }
      ]
    },
    {
      id: 'fav-cairo-3',
      title: 'الجامعة من الجيزة',
      from: 'محطة قطارات ومترو الجيزة',
      to: 'محطة مترو جامعة القاهرة',
      duration: '١٠ دقائق',
      transfers: [
        { name: 'مترو الخط الثاني', mode: 'metro', color: 'var(--color-rail-gold)' }
      ]
    }
  ],
  travelHistory: [
    {
      id: 'hist-cairo-1',
      from: 'محطة رمسيس ومحطة مترو الشهداء',
      to: 'موقف الجامعة الأمريكية والتجمع الخامس',
      date: 'اليوم، ٠٨:٠٠ ص',
      details: 'ميكروباص مباشر عبر محور المشير طنطاوي والتسعين',
      mode: 'microbus',
      fare: 14.0,
      status: 'مكتملة'
    },
    {
      id: 'hist-cairo-2',
      from: 'محطة عدلي منصور التبادلية الكبرى',
      to: 'محطة مترو العتبة',
      date: 'أمس، ٠٥:٣٠ م',
      details: 'مترو الخط الثالث السريع',
      mode: 'metro',
      fare: 15.0,
      status: 'مكتملة'
    }
  ]
};