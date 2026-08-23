import React, { useState } from 'react';
import { TRANSIT_LINES, STATIONS } from '../data/transitData';
import { TRANSPORT_FILTERS, matchesModeFilter, getTransportIcon, getTransportLabel } from '../data/transportHelpers';

export const RouteExplorer = ({
  selectedLine,
  onSelectLine,
  onSelectStation,
  onPlanTripWithLine,
  onClose
}) => {
  const [filterMode, setFilterMode] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredLines = TRANSIT_LINES.filter((line) => {
    if (!matchesModeFilter(line.mode, filterMode)) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        line.name.toLowerCase().includes(q) ||
        line.lineCode.toLowerCase().includes(q) ||
        line.origin.toLowerCase().includes(q) ||
        line.destination.toLowerCase().includes(q) ||
        (line.streetPathDescription && line.streetPathDescription.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border)] w-full max-w-md md:max-w-lg flex flex-col max-h-[85vh] overflow-hidden text-right">
      
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">alt_route</span>
          </div>
          <div>
            <h2 className="text-[16px] font-bold">دليل مسارات النقل في مصر</h2>
            <p className="text-[11px] text-white/80">تتبع خطوط النقل ومساراتها في المدن والمحافظات</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-3 bg-[var(--color-bg)] border-b border-[var(--color-border)] flex flex-col gap-2.5">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث باسم الشارع أو الميدان أو رقم الخط..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full h-9 pr-9 pl-3 rounded-lg bg-white border border-[var(--color-border-strong)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-subtle)] focus:border-[var(--color-primary)] outline-none"
          />
          <span className="material-symbols-outlined text-[var(--color-text-subtle)] text-[18px] absolute right-2.5 top-1/2 -translate-y-1/2">
            search
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[12px]">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${filterMode === 'all' ? 'bg-[var(--color-primary)] text-white' : 'bg-white border border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:bg-[var(--color-control)]'}`}
          >
            كل المسارات ({TRANSIT_LINES.length})
          </button>
          {TRANSPORT_FILTERS.map((filter) => {
            const count = TRANSIT_LINES.filter((line) => matchesModeFilter(line.mode, filter.id)).length;
            return (
              <button
                key={filter.id}
                onClick={() => setFilterMode(filter.id)}
                className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${filterMode === filter.id ? 'text-white' : 'bg-white border border-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:bg-[var(--color-control)]'}`}
                style={filterMode === filter.id ? { backgroundColor: filter.color } : undefined}
              >
                {filter.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {/* If a line is selected, show its deep street-by-street path */}
        {selectedLine ? (
          <div className="space-y-4">
            {/* Back Button & Title */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
              <button
                onClick={() => onSelectLine(null)}
                className="flex items-center gap-1 text-[12px] font-bold text-[var(--color-primary)] hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                <span>العودة لقائمة المسارات</span>
              </button>

              <span
                className="px-2.5 py-0.5 rounded-md text-[11px] font-bold text-white shadow-sm"
                style={{ backgroundColor: selectedLine.color }}
              >
                {selectedLine.lineCode}
              </span>
            </div>

            {/* Line Summary Card */}
            <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
              <h3 className="text-[15px] font-bold text-[var(--color-text)]">{selectedLine.name}</h3>
              
              <div className="grid grid-cols-2 gap-2 text-[12px] text-[var(--color-text-muted)]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[var(--color-danger)]">payments</span>
                  <span>الأجرة: <strong>{selectedLine.fareRange}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">schedule</span>
                  <span>التقاطر: <strong>{selectedLine.frequency}</strong></span>
                </div>
                {selectedLine.operatingHours && (
                  <div className="col-span-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[var(--color-success)]">timelapse</span>
                    <span>ساعات العمل: <strong>{selectedLine.operatingHours}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Street-by-Street Route Narrative */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--color-primary)]">
                <span className="material-symbols-outlined text-[18px]">route</span>
                <h4>تفاصيل المسار خطوة بخطوة:</h4>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[12px] leading-relaxed text-[var(--color-text)]">
                {selectedLine.streetPathDescription || 'مسار سير مباشر يربط بين المحطات والميادين المحددة.'}
              </div>
            </div>

            {/* Streets List Chips */}
            {selectedLine.streetsList && selectedLine.streetsList.length > 0 && (
              <div className="space-y-1.5">
                <h5 className="text-[12px] font-bold text-[var(--color-text-muted)]">الشوارع والميادين المقطوعة:</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLine.streetsList.map((street, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[var(--color-control)] border border-[var(--color-primary-soft)] text-[11px] font-medium text-[var(--color-primary)] flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[12px]">turn_sharp_right</span>
                      {street}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Landmarks along the route */}
            {selectedLine.landmarks && selectedLine.landmarks.length > 0 && (
              <div className="space-y-1.5">
                <h5 className="text-[12px] font-bold text-[var(--color-text-muted)]">أبرز المعالم على هذا المسار:</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLine.landmarks.map((lm, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {lm}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stop Sequence Waypoint List */}
            <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
              <h5 className="text-[12px] font-bold text-[var(--color-text)]">محطات ونقاط الركوب على المسار:</h5>
              <div className="relative pl-2 pr-4 space-y-3">
                <div
                  className="absolute right-1.5 top-2 bottom-2 w-0.5"
                  style={{ backgroundColor: selectedLine.color }}
                />

                {selectedLine.stationIds.map((sId, idx) => {
                  const station = STATIONS.find((s) => s.id === sId);
                  const isFirst = idx === 0;
                  const isLast = idx === selectedLine.stationIds.length - 1;

                  return (
                    <div key={sId} className="flex items-start gap-3 relative">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 border-white z-10 flex-shrink-0 mt-0.5 ${
                          isFirst
                            ? 'bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]'
                            : isLast
                            ? 'bg-[var(--color-danger)] ring-2 ring-[var(--color-danger)]'
                            : 'bg-white border-gray-400'
                        }`}
                        style={!isFirst && !isLast ? { borderColor: selectedLine.color } : {}}
                      />

                      <div className="flex-1">
                        <button
                          onClick={() => station && onSelectStation(station.name)}
                          className="text-[13px] font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] text-right block"
                        >
                          {station ? station.name : sId}
                        </button>
                        {station?.transfers && (
                          <p className="text-[11px] text-[var(--color-text-subtle)]">
                            تبديل مع: {station.transfers.slice(0, 2).join(' • ')}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            {onPlanTripWithLine && (
              <div className="pt-3">
                <button
                  onClick={() => onPlanTripWithLine(selectedLine)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                  <span>تخطيط رحلة باستخدام هذا المسار</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* List of All Transit Lines / Routes */
          <div className="space-y-2.5">
            {filteredLines.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-text-subtle)]">
                <span className="material-symbols-outlined text-[36px] text-[var(--color-border-strong)] mb-2">
                  search_off
                </span>
                <p className="text-[13px]">لا توجد مسارات مطابقة للبحث</p>
              </div>
            ) : (
              filteredLines.map((line) => (
                <div
                  key={line.id}
                  onClick={() => onSelectLine(line)}
                  className="p-3.5 rounded-xl bg-white hover:bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all cursor-pointer shadow-sm relative overflow-hidden group"
                >
                  {/* Color Accent Bar */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1.5 rounded-r-xl"
                    style={{ backgroundColor: line.color }}
                  />

                  <div className="pr-2 space-y-1.5">
                    {/* Header line info */}
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-[14px] font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                        {line.name}
                      </h4>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: line.color }}
                      >
                        {line.lineCode}
                      </span>
                    </div>

                    {/* Street preview */}
                    <p className="text-[11px] text-[var(--color-text-subtle)] line-clamp-1">
                      {line.streetPathDescription || `${line.origin} ← ${line.destination}`}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)] pt-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[var(--color-primary)]">
                          {getTransportIcon(line.mode)}
                        </span>
                        <span>{getTransportLabel(line.mode)}</span>
                      </span>

                      <span className="w-1 h-1 rounded-full bg-[var(--color-border-strong)]" />

                      <span>الأجرة: {line.fareRange}</span>

                      <span className="w-1 h-1 rounded-full bg-[var(--color-border-strong)]" />

                      <span className="text-[var(--color-success)] font-medium">{line.frequency}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
};
