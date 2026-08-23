import React from 'react';
import { TRANSIT_LINES } from '../data/transitData';
import { getTransportColor, getTransportIcon, getTransportLabel, resolveCssColor } from '../data/transportHelpers';

export const StationDetailSidebar = ({
  station,
  onClose,
  onPlanTripFrom,
  onPlanTripTo
}) => {
  // Find lines passing through this station
  const stationLines = TRANSIT_LINES.filter(line => 
    line.stationIds.includes(station.id) || station.lines.includes(line.id)
  );

  return (
    <aside
      aria-label="تفاصيل المحطة"
      className="relative z-30 w-full md:w-[420px] h-full bg-[var(--color-bg)] shadow-2xl flex flex-col border-l border-[var(--color-border)] transition-all duration-300 animate-in slide-in-from-right-8"
    >
      {/* Header Area */}
      <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--color-control)] text-[var(--color-text-muted)] transition-colors"
            title="رجوع"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
          </button>
          <div>
            <h1 className="text-[22px] font-bold text-[var(--color-text)]">{station.name}</h1>
            <p className="text-[12px] text-[var(--color-text-subtle)]">{station.nameEn} • {station.city}</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-sm" style={{ backgroundColor: getTransportColor(station.mode) }}>
          {getTransportLabel(station.mode)}
        </span>
      </div>

      {/* Optional Photo Header (e.g. for Ramses Main Station) */}
      {station.image && (
        <div className="relative h-36 w-full bg-[var(--color-text)] overflow-hidden shrink-0">
          <img
            src={station.image}
            alt={station.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 right-4 text-white">
            <span className="text-[12px] bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
              صورة المحطة الرئيسية
            </span>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 bg-[var(--color-bg)] flex flex-col gap-5">
        
        {/* Description / Summary */}
        {station.description && (
          <div className="p-3.5 bg-white rounded-xl border border-[var(--color-border)] text-[13px] text-[var(--color-text-muted)] leading-relaxed">
            {station.description}
          </div>
        )}

        {/* Section: الخطوط والوسائل المارة من هنا */}
        <div>
          <h2 className="text-[14px] font-bold text-[var(--color-text-muted)] mb-3 flex items-center justify-between">
            <span>الخطوط والوسائل المارة من هنا</span>
            <span className="text-[11px] font-normal text-[var(--color-text-subtle)]">
              {stationLines.length || 1} خط/وسيلة
            </span>
          </h2>

          <div className="flex flex-col gap-3">
            {stationLines.length > 0 ? (
              stationLines.map((line) => (
                <div
                  key={line.id}
                  className="w-full text-right bg-white hover:bg-[var(--color-surface)] transition-colors rounded-xl p-4 flex gap-4 shadow-sm border border-[var(--color-border)] relative overflow-hidden group"
                >
                  {/* Colored Line Indicator on right edge */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1.5 rounded-r-xl"
                    style={{ backgroundColor: resolveCssColor(line.color) }}
                  />

                  {/* Content */}
                  <div className="flex-1 pr-2">
                    <h3 className="text-[15px] font-bold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                      {line.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-subtle)]">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          {getTransportIcon(line.mode)}
                        </span>
                        {getTransportLabel(line.mode)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[var(--color-border-strong)]" />
                      <span>{line.fareRange || station.fareInfo || '٤.٥ جنيه'}</span>
                    </div>

                    {line.frequency && (
                      <div className="mt-2 text-[11px] text-[var(--color-primary-hover)] font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>معدل التقاطر: {line.frequency}</span>
                      </div>
                    )}
                  </div>

                  {/* Route Diagram Node */}
                  <div className="flex flex-col items-center justify-center relative pl-1">
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 bg-white z-10 shadow-sm"
                      style={{ borderColor: line.color }}
                    />
                    <div
                      className="absolute top-1/2 bottom-[-40px] w-0.5 z-0 opacity-40"
                      style={{ backgroundColor: resolveCssColor(line.color) }}
                    />
                  </div>
                </div>
              ))
            ) : (
              /* Fallback card for a station without a registered line */
              <div className="w-full text-right bg-white hover:bg-[var(--color-surface)] transition-colors rounded-xl p-4 flex gap-4 shadow-sm border border-[var(--color-border)] relative overflow-hidden group">
                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[var(--color-primary)] rounded-r-xl" />
                <div className="flex-1 pr-2">
                  <h3 className="text-[15px] font-bold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                    سرفيس (الزراعة - المحطة - الجامعة)
                  </h3>
                  <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-subtle)]">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">directions_bus</span>
                      سرفيس
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-border-strong)]" />
                    <span>٤.٥ جنيه</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center relative">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--color-primary)] bg-white z-10" />
                  <div className="absolute top-1/2 bottom-[-40px] w-0.5 bg-[var(--color-primary)]/30 z-0" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Departures / Platforms if available */}
        {station.departures && station.departures.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-[13px] font-bold text-[var(--color-text-muted)]">مواعيد الرحلات والأرصفة</h2>
            <div className="space-y-2">
              {station.departures.map((dep, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-[var(--color-border)] flex items-center justify-between text-[12px]"
                >
                  <div>
                    <div className="font-bold text-[var(--color-text)]">{dep.destination}</div>
                    <div className="text-[var(--color-text-subtle)]">{dep.platform} • {dep.frequency}</div>
                  </div>
                  <div className="text-left">
                    <span className="px-2 py-0.5 rounded bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold">
                      {dep.time}
                    </span>
                    <div className="text-[10px] text-[var(--color-text-subtle)] mt-0.5">{dep.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transfers */}
        {station.transfers && station.transfers.length > 0 && (
          <div className="p-3.5 bg-[var(--color-control)] rounded-xl text-[12px] text-[var(--color-text-muted)]">
            <div className="font-bold text-[var(--color-text)] mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">sync_alt</span>
              محطات ووسائل التحويل المتاحة:
            </div>
            <ul className="list-disc list-inside text-[var(--color-text-muted)] space-y-0.5 mr-2">
              {station.transfers.map((tr, i) => (
                <li key={i}>{tr}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-[var(--color-border)] flex flex-col gap-2">
        <button
          onClick={() => onPlanTripFrom(station)}
          className="w-full h-12 bg-[var(--color-orange-dark)] text-white rounded-xl font-bold text-[14px] shadow-sm hover:bg-[var(--color-orange-deep)] transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">directions</span>
          خطط رحلة من هنا
        </button>
        <button
          onClick={() => onPlanTripTo(station)}
          className="w-full h-11 bg-[var(--color-primary)] text-white rounded-xl font-medium text-[13px] hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">place</span>
          الوصول إلى هذه المحطة
        </button>
      </div>
    </aside>
  );
};
