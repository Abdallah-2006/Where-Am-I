import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Tag, 
  MapPin, 
  Compass, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  PhoneCall, 
  Navigation2, 
  Info,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { OFFICIAL_TARIFFS_2026, TERMINAL_LOCATIONS, OFFICIAL_TAXI_METER } from '../data/transitData';
import { getTariffCategoryLabel } from '../data/transportHelpers';

export const TariffDirectory = ({
  onSelectTerminalOnMap,
  onNavigateToTripPlanner
}) => {
  const [activeSubTab, setActiveSubTab] = useState('tariffs');
  const [tariffCategory, setTariffCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [terminalRegion, setTerminalRegion] = useState('all');

  // Taxi & Fare Calculator State
  const [taxiDistanceKm, setTaxiDistanceKm] = useState(5);
  const [taxiWaitHours, setTaxiWaitHours] = useState(0);
  const [selectedTariffForCompare, setSelectedTariffForCompare] = useState(() => OFFICIAL_TARIFFS_2026[0]?.id || '');

  // Filtered Tariffs
  const filteredTariffs = useMemo(() => {
    return OFFICIAL_TARIFFS_2026.filter(item => {
      const matchCat = tariffCategory === 'all' || item.category === tariffCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.from.toLowerCase().includes(q) || 
        item.to.toLowerCase().includes(q) || 
        (item.terminalFrom && item.terminalFrom.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [tariffCategory, searchQuery]);

  // Filtered Terminals
  const filteredTerminals = useMemo(() => {
    return TERMINAL_LOCATIONS.filter(item => {
      const matchRegion = terminalRegion === 'all' || item.region === terminalRegion;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.name.toLowerCase().includes(q) || 
        (item.city || '').toLowerCase().includes(q) || 
        item.serves.some(s => s.toLowerCase().includes(q));
      return matchRegion && matchSearch;
    });
  }, [terminalRegion, searchQuery]);

  // Taxi fare calculation
  const calculatedTaxiFare = useMemo(() => {
    let total = OFFICIAL_TAXI_METER.baseFare;
    if (taxiDistanceKm > 1) {
      total += (taxiDistanceKm - 1) * OFFICIAL_TAXI_METER.perKmRate;
    }
    if (taxiWaitHours > 0) {
      total += OFFICIAL_TAXI_METER.firstHourWaitRate;
      if (taxiWaitHours > 1) {
        total += (taxiWaitHours - 1) * OFFICIAL_TAXI_METER.additionalHourWaitRate;
      }
    }
    return Math.round(total * 10) / 10;
  }, [taxiDistanceKm, taxiWaitHours]);

  const selectedTariffObj = OFFICIAL_TARIFFS_2026.find(t => t.id === selectedTariffForCompare);

  const tariffCategories = [
    { id: 'all', label: 'كل التعريفات' },
    ...Array.from(new Set(OFFICIAL_TARIFFS_2026.map(item => item.category))).map(category => ({ id: category, label: getTariffCategoryLabel(category) })),
  ];
  const terminalRegions = [
    { id: 'all', label: 'كل المناطق' },
    ...Array.from(new Set(TERMINAL_LOCATIONS.map(item => item.region))).map(region => ({ id: region, label: region })),
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white p-6 md:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[12px] font-semibold text-amber-300 border border-white/10">
            <CheckCircle2 size={14} />
            بيانات التعريفة الرسمية المتاحة في مصر (تحديث مارس ٢٠٢٦)
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            دليل مواصلات وتعريفة المدن والمحافظات
          </h1>
          <p className="text-white/80 text-[14px] md:text-[15px] leading-relaxed">
            مرجع موحّد لأسعار الميكروباص والسرفيس والمترو والسكك الحديدية والأتوبيسات، مع إحداثيات المواقف والمحطات التي تمت إضافة بياناتها.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--color-border)] no-scrollbar">
        <button
          onClick={() => { setActiveSubTab('tariffs'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'tariffs'
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
          }`}
        >
          <Tag size={16} />
          قائمة التعريفات الرسمية ({OFFICIAL_TARIFFS_2026.length})
        </button>

        <button
          onClick={() => { setActiveSubTab('terminals'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'terminals'
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
          }`}
        >
          <MapPin size={16} />
          إحداثيات المواقف GPS ({TERMINAL_LOCATIONS.length})
        </button>

        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'calculator'
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
          }`}
        >
          <Calculator size={16} />
          حاسبة الأجرة وعداد التاكسي
        </button>

        <button
          onClick={() => setActiveSubTab('network_levels')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'network_levels'
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
          }`}
        >
          <Layers size={16} />
          هيكلية شبكة النقل (٣ مستويات)
        </button>

        <button
          onClick={() => setActiveSubTab('tips')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'tips'
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
          }`}
        >
          <Info size={16} />
          نصائح الركاب والشكاوى
        </button>
      </div>

      {/* TAB 1: TARIFF LIST */}
      {activeSubTab === 'tariffs' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-[var(--color-border)] space-y-4">
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
                {tariffCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setTariffCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
                      tariffCategory === cat.id
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" size={16} />
                <input
                  type="text"
                  placeholder="ابحث عن خط أو مركز أو موقف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--color-surface)] pl-3 pr-9 py-2 text-[13px] rounded-xl border border-transparent focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tariffs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTariffs.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-[var(--color-border)] p-4 flex flex-col justify-between hover:shadow-md hover:border-[var(--color-primary)]/30 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[12px] text-[var(--color-text-subtle)] font-medium flex items-center gap-1">
                        {getTariffCategoryLabel(item.category)}
                      </div>
                      <h3 className="text-[16px] font-bold text-[var(--color-text)] mt-0.5">
                        {item.from} ← {item.to}
                      </h3>
                    </div>
                    <div className="text-left">
                      <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[15px] rounded-lg">
                        {item.fareDisplay}
                      </span>
                    </div>
                  </div>

                  {item.terminalFrom && (
                    <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)] bg-[var(--color-surface)] p-2 rounded-lg">
                      <MapPin size={14} className="text-[var(--color-danger)] shrink-0" />
                      <span className="truncate">{item.terminalFrom}</span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-[12px] text-[var(--color-text-subtle)] italic">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-surface)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--color-text-subtle)] flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    {item.status}
                  </span>

                  {onNavigateToTripPlanner && (
                    <button
                      onClick={() => onNavigateToTripPlanner(item.from, item.to)}
                      className="text-[12px] font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] flex items-center gap-1 group-hover:translate-x-[-2px] transition-all"
                    >
                      تخطيط المسار
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredTariffs.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-[var(--color-border-strong)] p-12 text-center space-y-3">
              <Search size={32} className="mx-auto text-[var(--color-text-subtle)]" />
              <p className="text-[var(--color-text-muted)] font-semibold">لم يتم العثور على خطوط تطابق بحثك</p>
              <button 
                onClick={() => { setSearchQuery(''); setTariffCategory('all'); }}
                className="text-[13px] text-[var(--color-primary)] font-bold underline"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TERMINALS GPS DIRECTORY */}
      {activeSubTab === 'terminals' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-[var(--color-border)] space-y-4">
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
              {/* Region Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
                {terminalRegions.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setTerminalRegion(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
                      terminalRegion === r.id
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" size={16} />
                <input
                  type="text"
                  placeholder="ابحث عن موقف أو خط يخدمه..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--color-surface)] pl-3 pr-9 py-2 text-[13px] rounded-xl border border-transparent focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Terminals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerminals.map(term => (
              <div 
                key={term.id}
                className="bg-white rounded-2xl border border-[var(--color-border)] p-5 flex flex-col justify-between hover:shadow-md hover:border-[var(--color-primary)]/30 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-[var(--color-control)] text-[var(--color-text-muted)] font-semibold">
                        {term.region}
                      </span>
                      <h3 className="text-[16px] font-bold text-[var(--color-text)] flex items-center gap-1.5">
                        <MapPin size={16} className="text-[var(--color-danger)]" />
                        {term.name}
                      </h3>
                    </div>
                    {term.isMainHub && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[var(--color-primary)] border border-blue-200">
                        موقف رئيسي
                      </span>
                    )}
                  </div>

                  {/* Coordinates pill */}
                  <div className="flex items-center gap-2 text-[12px] font-mono text-[var(--color-text-subtle)] bg-[var(--color-surface)] px-3 py-1.5 rounded-lg">
                    <Navigation2 size={13} className="text-[var(--color-primary)]" />
                    <span>{term.lat.toFixed(6)}, {term.lng.toFixed(6)}</span>
                  </div>

                  {/* Serves list */}
                  <div className="space-y-1">
                    <div className="text-[12px] font-bold text-[var(--color-text-muted)]">الخطوط المخدومة:</div>
                    <div className="flex flex-wrap gap-1">
                      {term.serves.map((s, idx) => (
                        <span key={idx} className="text-[11px] bg-[var(--color-control)] text-[var(--color-primary)] px-2 py-0.5 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {term.notes && (
                    <p className="text-[12px] text-[var(--color-text-subtle)] bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                      {term.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--color-surface)] flex items-center justify-between">
                  <button
                    onClick={() => onSelectTerminalOnMap && onSelectTerminalOnMap(term)}
                    className="w-full py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Compass size={14} />
                    عرض على الخريطة التفاعلية
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CALCULATOR & TAXI METER */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Calculator Controls */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[var(--color-border)] space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                <Calculator className="text-[var(--color-primary)]" size={20} />
                حاسبة تعريفة التاكسي بالعداد (المدن المصرية)
              </h2>
              <p className="text-[13px] text-[var(--color-text-subtle)]">
                احسب تكلفة مشوار التاكسي بالعداد داخل المدن المصرية، وقارنها بتكلفة السرفيس والميكروباص.
              </p>
            </div>

            {/* Distance Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[14px] font-bold text-[var(--color-text)]">مسافة المشوار التقديرية:</label>
                <span className="text-[16px] font-extrabold text-[var(--color-primary)]">{taxiDistanceKm} كم</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.5}
                value={taxiDistanceKm}
                onChange={(e) => setTaxiDistanceKm(parseFloat(e.target.value))}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[var(--color-text-subtle)]">
                <span>١ كم (وسط البلد)</span>
                <span>١٠ كم (المواقف والمستشفيات)</span>
                <span>٣٠ كم (خارج المدينة)</span>
              </div>
            </div>

            {/* Wait Hours */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[14px] font-bold text-[var(--color-text)]">ساعات الانتظار (إن وُجدت):</label>
                <span className="text-[16px] font-extrabold text-[var(--color-danger)]">{taxiWaitHours} ساعة</span>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map(h => (
                  <button
                    key={h}
                    onClick={() => setTaxiWaitHours(h)}
                    className={`flex-1 py-2 rounded-xl text-[13px] font-bold transition-all ${
                      taxiWaitHours === h
                        ? 'bg-[var(--color-danger)] text-white shadow-sm'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'
                    }`}
                  >
                    {h === 0 ? 'بدون انتظار' : `${h} ساعة`}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Meter Breakdown */}
            <div className="bg-[var(--color-surface)] p-4 rounded-xl space-y-2.5 border border-[var(--color-border)]">
              <div className="text-[13px] font-bold text-[var(--color-text)] mb-1">تفاصيل احتساب العداد المعتمد:</div>
              <div className="flex justify-between text-[13px] text-[var(--color-text-muted)]">
                <span>فتح البنديرة (يشمل أول كم):</span>
                <span className="font-bold text-[var(--color-text)]">{OFFICIAL_TAXI_METER.baseFare.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between text-[13px] text-[var(--color-text-muted)]">
                <span>المسافة الإضافية ({Math.max(0, taxiDistanceKm - 1)} كم × ٣.٠٠ ج):</span>
                <span className="font-bold text-[var(--color-text)]">{(Math.max(0, taxiDistanceKm - 1) * OFFICIAL_TAXI_METER.perKmRate).toFixed(2)} ج.م</span>
              </div>
              {taxiWaitHours > 0 && (
                <div className="flex justify-between text-[13px] text-[var(--color-text-muted)]">
                  <span>رسوم الانتظار ({taxiWaitHours} ساعة):</span>
                  <span className="font-bold text-[var(--color-danger)]">
                    {(OFFICIAL_TAXI_METER.firstHourWaitRate + Math.max(0, taxiWaitHours - 1) * OFFICIAL_TAXI_METER.additionalHourWaitRate).toFixed(2)} ج.م
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-[var(--color-border)] flex justify-between items-center text-[15px] font-bold">
                <span className="text-[var(--color-primary)]">إجمالي قيمة العداد الرسمية:</span>
                <span className="text-[20px] font-black text-emerald-700">{calculatedTaxiFare.toFixed(2)} ج.م</span>
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Microbus / Transit Tariffs */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[var(--color-border)] space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                <TrendingUp className="text-[var(--color-primary)]" size={20} />
                مقارنة أسعار المواصلات العامة
              </h2>
              <p className="text-[13px] text-[var(--color-text-subtle)]">
                قارن تكلفة التاكسي بتكلفة السرفيس والميكروباص المباشر.
              </p>
            </div>

            {/* Select Route for comparison */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[var(--color-text-muted)]">اختر خطاً للمقارنة:</label>
              <select
                value={selectedTariffForCompare}
                onChange={(e) => setSelectedTariffForCompare(e.target.value)}
                className="w-full bg-[var(--color-surface)] px-3 py-2.5 rounded-xl text-[14px] font-semibold border border-transparent focus:border-[var(--color-primary)] outline-none"
              >
                {OFFICIAL_TARIFFS_2026.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.from} ← {t.to} ({t.fareDisplay})
                  </option>
                ))}
              </select>
            </div>

            {selectedTariffObj && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 p-4 rounded-xl space-y-2">
                  <span className="text-[12px] font-bold text-[var(--color-primary)]">أجرة الميكروباص/السرفيس</span>
                  <div className="text-2xl font-black text-[var(--color-primary)]">
                    {selectedTariffObj.fareDisplay}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    للفرد الواحد عبر {selectedTariffObj.terminalFrom || 'المواقف الرسمية'}.
                  </p>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-2">
                  <span className="text-[12px] font-bold text-amber-900">سعر التاكسي بالعداد لمسافة المشوار ({taxiDistanceKm} كم)</span>
                  <div className="text-2xl font-black text-amber-900">
                    {calculatedTaxiFare.toFixed(1)} ج.م
                  </div>
                  <p className="text-[11px] text-amber-800">
                    يخدم حتى ٤ ركاب بالعداد المعتمد.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-[13px] text-emerald-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                تنويه هام بشأن عدادات التاكسي بالمدن المصرية:
              </div>
              <p className="text-[12px] leading-relaxed text-emerald-800">
                يحق للراكب طلب تشغيل العداد من بداية الرحلة. في حال امتناع السائق أو المطالبة بأجرة جزافية، يمكن الإبلاغ فوراً لإدارة المواقف وغرفة العمليات برقم لوحة السيارة.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 3-LEVEL NETWORK HIERARCHY */}
      {activeSubTab === 'network_levels' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-border)] space-y-6">
            <div className="max-w-3xl space-y-2">
              <h2 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
                <Layers className="text-[var(--color-primary)]" size={20} />
                الهيكل التنظيمي لشبكة النقل في مصر
              </h2>
              <p className="text-[14px] text-[var(--color-text-muted)] leading-relaxed">
                تعتمد حركة النقل الجماعي في مصر على مستويات مترابطة تربط المدن الرئيسية بالمراكز والقرى والمدن الصناعية:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level 1 Card */}
              <div className="bg-gradient-to-b from-blue-50/60 to-white p-5 rounded-2xl border border-blue-200 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-[16px]">
                  ١
                </div>
                <h3 className="text-[16px] font-bold text-[var(--color-primary)]">
                  المستوى الأول: الخطوط الشعاعية (Hub-and-Spoke)
                </h3>
                <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
                  خطوط رئيسية تنطلق من المراكز ومحطات التبادل إلى المدن والمحافظات المجاورة.
                </p>
                <div className="text-[12px] font-semibold text-[var(--color-primary)] bg-white p-2.5 rounded-xl border border-blue-100">
                  أمثلة: خطوط المدن إلى المراكز المجاورة، وخطوط الربط بين المحافظات.
                </div>
              </div>

              {/* Level 2 Card */}
              <div className="bg-gradient-to-b from-emerald-50/60 to-white p-5 rounded-2xl border border-emerald-200 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-[16px]">
                  ٢
                </div>
                <h3 className="text-[16px] font-bold text-emerald-900">
                  المستوى الثاني: خطوط الربط الأفقية (Cross-Links)
                </h3>
                <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
                  خطوط مباشرة تربط بين المراكز والمدن الفرعية دون الحاجة للمرور بمدينة رئيسية لتوفير الوقت والتكلفة.
                </p>
                <div className="text-[12px] font-semibold text-emerald-900 bg-white p-2.5 rounded-xl border border-emerald-100">
                  أمثلة: فاقوس - أبو كبير (٥ ج)، كفر صقر - المنصورة (١٥ ج)، منيا القمح - بنها (٦ ج).
                </div>
              </div>

              {/* Level 3 Card */}
              <div className="bg-gradient-to-b from-amber-50/60 to-white p-5 rounded-2xl border border-amber-200 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold text-[16px]">
                  ٣
                </div>
                <h3 className="text-[16px] font-bold text-amber-900">
                  المستوى الثالث: خطوط القرى والتغذية (Feeder Lines)
                </h3>
                <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
                  خطوط سيارات الميكروباص المحلية وسيارات الـ ٧ راكب التي تنقل الركاب من مواقف القرى إلى المراكز الرئيسية والسرفيس الداخلي.
                </p>
                <div className="text-[12px] font-semibold text-amber-900 bg-white p-2.5 rounded-xl border border-amber-100">
                  أمثلة: خطوط القرى، وخطوط التغذية المحلية، وسرفيس الأحياء داخل المدن.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMMUTER TIPS & COMPLAINTS */}
      {activeSubTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commuter Tips */}
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-border)] space-y-4">
            <h3 className="text-[18px] font-bold text-[var(--color-text)] flex items-center gap-2">
              <Compass className="text-[var(--color-primary)]" size={20} />
              إرشادات التنقل اليومي في مصر
            </h3>
            <ul className="space-y-3 text-[13px] text-[var(--color-text-muted)] leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>التأكد من ملصق الأجرة:</strong> تأكد من وجود ستيكر التعريفة الرسمية على الزجاج الأمامي والخلفي لسيارة السرفيس أو الميكروباص قبل الركوب.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>ساعات الذروة الصباحية (٠٧:٠٠ - ٠٩:٣٠ ص):</strong> تشهد خطوط الجامعة وموقف الأحرار وميدان الزراعة كثافة عالية؛ يفضل التواجد بالموقف مبكراً بـ ١٥ دقيقة.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>فترة ما بعد المغرب والعشاء:</strong> تقل كثافة سيارات القرى الفرعية؛ ينصح بالتواجد في الموقف العمومي للمركز قبل الساعة ٠٨:٠٠ مساءً.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>الفكة والعملات الصغيرة:</strong> يفضل دائماً توفير العملات النقدية الصغيرة (٥، ١٠، ٢٠ جنيهاً) لتسهيل سداد الأجرة وتجنب تأخير التحصيل.</span>
              </li>
            </ul>
          </div>

          {/* Complaints & Operations Center */}
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-danger)]/30 bg-gradient-to-b from-red-50/30 to-white space-y-4">
            <h3 className="text-[18px] font-bold text-[var(--color-danger)] flex items-center gap-2">
              <AlertTriangle size={20} />
              منظومة الشكاوى وغرفة العمليات
            </h3>
            <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
              في حالة مخالفة التعريفة المقررة، أو تقسيم خط السير، أو الامتناع عن تشغيل عداد التاكسي، يمكنك تقديم بلاغ فوري عبر القنوات الرسمية:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-white rounded-xl border border-red-200 flex items-center gap-3">
                <PhoneCall size={18} className="text-[var(--color-danger)]" />
                <div>
                  <div className="text-[12px] text-[var(--color-text-subtle)]">غرفة عمليات المحافظة وإدارة المواقف:</div>
                  <div className="text-[14px] font-bold text-[var(--color-text)]">الخط الساخن: 114 / 055-2303693</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-red-200 flex items-center gap-3">
                <PhoneCall size={18} className="text-[var(--color-danger)]" />
                <div>
                  <div className="text-[12px] text-[var(--color-text-subtle)]">منظومة الشكاوى الحكومية الموحدة:</div>
                  <div className="text-[14px] font-bold text-[var(--color-text)]">16528 (مجلس الوزراء)</div>
                </div>
              </div>
            </div>

            <p className="text-[12px] text-[var(--color-text-subtle)] italic">
              * يرجى تدوين رقم لوحة السيارة (أرقام وحروف)، اسم الموقف أو الخط، ووقت الواقعة لسرعة اتخاذ الإجراء القانوني وسحب الترخيص.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
