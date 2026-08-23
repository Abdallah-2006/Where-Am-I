import React from 'react';

export const Footer = () => (
  <footer className="w-full bg-[var(--color-bg)] border-t border-[var(--color-border)] py-4 px-6 md:px-8 text-[12px] text-[var(--color-text-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 z-30 relative">
    <div><span>© ٢٠٢٦ دليل مواصلات مصر</span></div>
    <div className="flex items-center gap-4">
      <span className="w-1 h-1 rounded-full bg-[var(--color-border-strong)]" aria-hidden="true" />
      <span className="hover:text-[var(--color-primary)] transition-colors cursor-default">بيانات OpenStreetMap</span>
    </div>
  </footer>
);
