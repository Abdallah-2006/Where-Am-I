import React, { useState, useEffect } from 'react';
import { STATIONS, calculateTripRoute } from '../data/transitData';
import { getTransportLabel } from '../data/transportHelpers';

export const TripPlannerCard = ({
  originStationName,
  setOriginStationName,
  destStationName,
  setDestStationName,
  onRouteCalculated,
  calculatedRoute,
  onSelectStation
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [departureTime, setDepartureTime] = useState('الآن');
  const [selectedPreference, setSelectedPreference] = useState('fastest');
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Suggestions for autocomplete
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  // Auto-calculate on initial load using the currently selected Egypt-wide endpoints
  useEffect(() => {
    if (!calculatedRoute && originStationName && destStationName) {
      const initialRoute = calculateTripRoute(originStationName, destStationName);
      onRouteCalculated(initialRoute);
    }
  }, []);

  const handleOriginChange = (text) => {
    setOriginStationName(text);
    if (text.trim()) {
      setOriginSuggestions(
        STATIONS.filter(s => s.name.includes(text) || s.nameEn.toLowerCase().includes(text.toLowerCase())).slice(0, 5)
      );
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestChange = (text) => {
    setDestStationName(text);
    if (text.trim()) {
      setDestSuggestions(
        STATIONS.filter(s => s.name.includes(text) || s.nameEn.toLowerCase().includes(text.toLowerCase())).slice(0, 5)
      );
    } else {
      setDestSuggestions([]);
    }
  };

  const handleSwap = () => {
    const temp = originStationName;
    setOriginStationName(destStationName);
    setDestStationName(temp);
    if (destStationName && temp) {
      const route = calculateTripRoute(destStationName, temp);
      onRouteCalculated(route);
    }
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    const from = originStationName.trim() || STATIONS[0]?.name || '';
    const to = destStationName.trim() || STATIONS[1]?.name || '';
    
    if (!originStationName) setOriginStationName(from);
    if (!destStationName) setDestStationName(to);

    const route = calculateTripRoute(from, to);
    onRouteCalculated(route);
    setActiveInput(null);
  };

  const handleUseCurrentLocation = () => {
    setOriginStationName('موقعي الحالي');
    setActiveInput(null);
  };

  return (
    <div className="w-full md:w-[420px] shrink-0 flex flex-col gap-4 pointer-events-auto z-20">
      
      {/* Trip Planning Input Card (Screenshot 4 & 6) */}
      <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border)] flex flex-col overflow-hidden">
        
        {/* Card Header & Inputs */}
        <div className="p-5 md:p-6 bg-white flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[var(--color-text)] flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--color-primary)] text-[24px]">route</span>
              تخطيط المسار
            </h2>
            <span className="text-[12px] bg-[var(--color-control)] text-[var(--color-text-muted)] px-2.5 py-1 rounded-full font-medium">
              مباشر وسريع
            </span>
          </div>

          {/* Form Inputs Container with Timeline Line & Swap */}
          <div className="flex flex-col gap-3 relative">
            
            {/* Connecting Vertical Line */}
            <div className="absolute right-[23px] top-[26px] bottom-[26px] w-[2px] bg-[var(--color-border-strong)] border-l border-dashed border-[var(--color-border-strong)] z-0" />

            {/* FROM INPUT */}
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[var(--color-text-subtle)] text-[22px]">
                    my_location
                  </span>
                </div>
                <div className="flex-1 relative">
                  <label className="absolute -top-2 right-3 px-1.5 bg-white text-[11px] font-semibold text-[var(--color-text-muted)] z-10">
                    من
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-strong)]/80 focus:border-[var(--color-primary)] focus:bg-white text-[15px] text-[var(--color-text)] outline-none transition-all"
                    placeholder="اسم المحطة أو الموقف..."
                    value={originStationName}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    onFocus={() => setActiveInput('origin')}
                  />
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-primary)] transition-colors p-1"
                    title="استخدم موقعي الحالي"
                  >
                    <span className="material-symbols-outlined text-[18px]">gps_fixed</span>
                  </button>
                </div>
              </div>

              {/* Origin Autocomplete Suggestions */}
              {activeInput === 'origin' && originSuggestions.length > 0 && (
                <div className="absolute top-full right-12 left-0 mt-1 bg-white rounded-xl shadow-xl border border-[var(--color-border)] z-50 overflow-hidden">
                  {originSuggestions.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setOriginStationName(st.name);
                        onSelectStation(st);
                        setActiveInput(null);
                      }}
                      className="w-full px-4 py-2 text-right hover:bg-[var(--color-surface)] text-[13px] flex items-center justify-between border-b border-[var(--color-surface)] last:border-none"
                    >
                      <span className="font-medium text-[var(--color-text)]">{st.name}</span>
                      <span className="text-[11px] text-[var(--color-text-subtle)]">{st.city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SWAP BUTTON */}
            <div className="absolute right-[9px] top-1/2 -translate-y-1/2 z-20">
              <button
                type="button"
                onClick={handleSwap}
                className="w-8 h-8 rounded-full bg-white border border-[var(--color-border-strong)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-control)] hover:text-[var(--color-primary)] transition-colors shadow-sm"
                title="تبديل نقطة البداية والنهاية"
              >
                <span className="material-symbols-outlined text-[18px]">swap_vert</span>
              </button>
            </div>

            {/* TO INPUT */}
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[var(--color-primary)] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    location_on
                  </span>
                </div>
                <div className="flex-1 relative">
                  <label className="absolute -top-2 right-3 px-1.5 bg-white text-[11px] font-semibold text-[var(--color-text-muted)] z-10">
                    إلى
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-strong)]/80 focus:border-[var(--color-primary)] focus:bg-white text-[15px] text-[var(--color-text)] outline-none transition-all"
                    placeholder="اسم المحطة أو الموقف..."
                    value={destStationName}
                    onChange={(e) => handleDestChange(e.target.value)}
                    onFocus={() => setActiveInput('dest')}
                  />
                </div>
              </div>

              {/* Destination Autocomplete Suggestions */}
              {activeInput === 'dest' && destSuggestions.length > 0 && (
                <div className="absolute top-full right-12 left-0 mt-1 bg-white rounded-xl shadow-xl border border-[var(--color-border)] z-50 overflow-hidden">
                  {destSuggestions.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setDestStationName(st.name);
                        onSelectStation(st);
                        setActiveInput(null);
                      }}
                      className="w-full px-4 py-2 text-right hover:bg-[var(--color-surface)] text-[13px] flex items-center justify-between border-b border-[var(--color-surface)] last:border-none"
                    >
                      <span className="font-medium text-[var(--color-text)]">{st.name}</span>
                      <span className="text-[11px] text-[var(--color-text-subtle)]">{st.city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Quick Filter Options: غادر الآن / خيارات متقدمة */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowTimePicker(!showTimePicker)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${
                departureTime !== 'الآن'
                  ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border-strong)]/40 hover:bg-[var(--color-control)]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>{departureTime === 'الآن' ? 'غادر الآن' : `مغادرة: ${departureTime}`}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${
                showAdvanced
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border-strong)]/40 hover:bg-[var(--color-control)]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>خيارات متقدمة</span>
            </button>
          </div>

          {/* Time Picker Popup */}
          {showTimePicker && (
            <div className="p-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] flex items-center justify-between gap-2 text-[12px]">
              <span className="font-semibold text-[var(--color-text)]">وقت المغادرة:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => { setDepartureTime('الآن'); setShowTimePicker(false); }}
                  className={`px-2.5 py-1 rounded-md ${departureTime === 'الآن' ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-text-muted)]'}`}
                >
                  الآن
                </button>
                <button
                  onClick={() => { setDepartureTime('٠٨:٠٠ ص'); setShowTimePicker(false); }}
                  className={`px-2.5 py-1 rounded-md ${departureTime === '٠٨:٠٠ ص' ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-text-muted)]'}`}
                >
                  صباحاً
                </button>
                <button
                  onClick={() => { setDepartureTime('٠٥:٣٠ م'); setShowTimePicker(false); }}
                  className={`px-2.5 py-1 rounded-md ${departureTime === '٠٥:٣٠ م' ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-text-muted)]'}`}
                >
                  مساءً
                </button>
              </div>
            </div>
          )}

          {/* Advanced Options Drawer */}
          {showAdvanced && (
            <div className="p-3.5 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] flex flex-col gap-2 text-[12px]">
              <span className="font-bold text-[var(--color-text)]">أولويات المسار:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPreference('fastest')}
                  className={`p-2 rounded-lg font-medium text-center ${
                    selectedPreference === 'fastest' ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-text-muted)]'
                  }`}
                >
                  الأسرع وقتاً
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreference('cheapest')}
                  className={`p-2 rounded-lg font-medium text-center ${
                    selectedPreference === 'cheapest' ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-text-muted)]'
                  }`}
                >
                  الأقل تكلفة
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreference('fewer_transfers')}
                  className={`p-2 rounded-lg font-medium text-center ${
                    selectedPreference === 'fewer_transfers' ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-text-muted)]'
                  }`}
                >
                  أقل تبديلات
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Calculate Button Area */}
        <div className="p-5 md:p-6 bg-white border-t border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => handleCalculate()}
            className="w-full h-[52px] rounded-xl bg-[var(--color-primary)] text-white text-[15px] font-bold hover:bg-[var(--color-primary-hover)] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[22px]">directions_transit</span>
            احسب المسار
          </button>
        </div>

      </div>

      {/* Results Card (Matches Screenshot 4) */}
      {calculatedRoute && (
        <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* Result Card Header */}
          <div className="px-5 py-4 border-b border-[var(--color-border)] bg-white flex justify-between items-center">
            <h3 className="text-[15px] font-bold text-[var(--color-text)] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[var(--color-orange-dark)] text-[20px]">bolt</span>
              أفضل مسار
            </h3>
            <span className="text-[12px] font-semibold text-[var(--color-text-muted)] bg-[var(--color-control)] px-3 py-1 rounded-full">
              {calculatedRoute.totalDurationMins} دقيقة • {calculatedRoute.totalStops} محطات
            </span>
          </div>

          {/* Journey Legs */}
          <div className="p-5 bg-white flex flex-col gap-4">
            {calculatedRoute.legs.map((leg, index) => (
              <div key={index} className="flex items-start gap-4">
                
                {/* Transit Icon & Line */}
                <div className="flex flex-col items-center pt-1 shrink-0 relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm z-10 relative font-bold text-[13px]"
                    style={{ backgroundColor: leg.color }}
                  >
                    {leg.lineCode || 'خط'}
                  </div>
                  {/* Vertical Route Line */}
                  <div
                    className="w-1.5 h-full min-h-[50px] mt-1 rounded-full absolute top-10"
                    style={{ backgroundColor: leg.color }}
                  />
                </div>

                {/* Leg Details */}
                <div className="flex-1 flex flex-col gap-1 pb-4">
                  <h4 className="text-[15px] font-bold text-[var(--color-text)]">
                    اركب {getTransportLabel(leg.mode)}: {leg.lineName}
                  </h4>
                  <p className="text-[12px] text-[var(--color-text-subtle)]">
                    ({leg.stopsCount} محطات • حوالي {leg.durationMins} دقيقة)
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full border-2 bg-white shrink-0"
                      style={{ borderColor: leg.color }}
                    />
                    <span className="text-[12px] text-[var(--color-text-muted)]">
                      نقطة الركوب: <strong>{leg.fromStation}</strong>
                    </span>
                  </div>

                  {/* Street Directions along this leg */}
                  {leg.streetDirections && leg.streetDirections.length > 0 && (
                    <div className="my-1.5 p-2 bg-[var(--color-surface)] rounded-lg text-[11px] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      <span className="font-semibold text-[var(--color-primary)] block mb-0.5">مسار الشوارع:</span>
                      <div className="flex flex-wrap gap-1">
                        {leg.streetDirections.map((st, sIdx) => (
                          <span key={sIdx} className="inline-flex items-center gap-0.5 text-[var(--color-text)]">
                            {st}
                            {sIdx < leg.streetDirections.length - 1 && <span className="text-[var(--color-border-strong)]">←</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full border-2 shrink-0"
                      style={{ borderColor: leg.color, backgroundColor: leg.color }}
                    />
                    <span className="text-[12px] text-[var(--color-text)] font-bold">
                      النزول عند: <strong>{leg.toStation}</strong>
                    </span>
                  </div>
                </div>

              </div>
            ))}

            {/* Step-by-Step Street Navigation Box */}
            {calculatedRoute.streetGuide && calculatedRoute.streetGuide.length > 0 && (
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-[12px] flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[var(--color-primary)]">
                  <span className="material-symbols-outlined text-[16px]">turn_sharp_right</span>
                  <span>تفاصيل خط السير في الشوارع:</span>
                </div>
                <div className="space-y-1 text-[var(--color-text)] leading-relaxed">
                  {calculatedRoute.streetGuide.map((step, sIdx) => (
                    <p key={sIdx}>{step}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Expanded Stations List if requested */}
            {showFullDetails && (
              <div className="mt-2 p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] text-[12px] flex flex-col gap-2 animate-in fade-in">
                <span className="font-bold text-[var(--color-text)]">تفاصيل المحطات بالترتيب:</span>
                {calculatedRoute.legs.flatMap(l => l.stopsList).map((stop, i) => (
                  <div key={i} className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                    <span>{stop}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Summary Bar */}
          <div className="px-5 py-3.5 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">payments</span>
              <span className="text-[13px] font-bold">التكلفة التقريبية: {calculatedRoute.totalFare} جنيه</span>
            </div>
            <button
              onClick={() => setShowFullDetails(!showFullDetails)}
              className="text-[var(--color-primary)] text-[12px] font-bold hover:underline"
            >
              {showFullDetails ? 'إخفاء التفاصيل' : 'تفاصيل أكثر'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
