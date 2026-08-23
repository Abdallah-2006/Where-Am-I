import React from 'react';
import { getTransportColor, getTransportIcon, getTransportLabel } from '../data/transportHelpers';

export const StationBottomSheet = ({
  station,
  onOpenDetails,
  onPlanTrip,
  onClose
}) => {
  return (
    <div className="absolute bottom-0 inset-x-0 z-20 w-full flex justify-center pb-4 md:pb-8 px-4 md:px-0 pointer-events-none animate-in slide-in-from-bottom-6 duration-300">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-t-3xl md:rounded-3xl shadow-2xl border border-[var(--color-border-strong)]/60 pointer-events-auto transform translate-y-0 transition-transform duration-300 ease-out flex flex-col gap-4 p-5 md:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[var(--color-control)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)] flex items-center justify-center transition-colors"
          aria-label="إغلاق"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Drag Handle for Mobile */}
        <div className="w-12 h-1.5 bg-[var(--color-border)] rounded-full mx-auto md:hidden -mt-2 mb-1" />

        {/* Content Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-[22px] md:text-[24px] font-bold text-[var(--color-text)] m-0">
              {station.name}
            </h2>
            <p className="text-[14px] text-[var(--color-text-muted)] m-0">
              يمر منها: {station.lines.length || 1} خط/وسيلة • {station.city}
            </p>
          </div>
        </div>

        {/* Transit Indicators */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full shadow-sm text-white text-[12px] font-bold" style={{ backgroundColor: getTransportColor(station.mode) }}>
            <span className="material-symbols-outlined text-[16px]">{getTransportIcon(station.mode)}</span>
            <span>{getTransportLabel(station.mode)}</span>
          </div>

          {station.isHub && (
            <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-full text-[12px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">hub</span>
              محطة تبادلية
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2">
          <button
            onClick={onPlanTrip}
            className="flex-1 h-12 md:h-[52px] flex items-center justify-center bg-[var(--color-orange-dark)] text-white rounded-xl text-[14px] font-bold shadow-sm hover:shadow-md hover:bg-[var(--color-orange-deep)] transition-all active:scale-[0.99] gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">directions</span>
            خطط رحلة من هنا
          </button>
          
          <button
            onClick={onOpenDetails}
            className="flex-1 h-12 md:h-[52px] flex items-center justify-center bg-[var(--color-primary)] text-white rounded-xl text-[14px] font-bold shadow-sm hover:shadow-md hover:bg-[var(--color-primary-hover)] transition-all active:scale-[0.99] gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">info</span>
            التفاصيل الكاملة
          </button>
        </div>

      </div>
    </div>
  );
};
