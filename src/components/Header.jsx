import React, { useState, useRef, useEffect } from 'react';
import { STATIONS } from '../data/transitData';
import { TRANSPORT_FILTERS, getTransportColor, getTransportLabel } from '../data/transportHelpers';

export const Header = ({
  activeTab,
  setActiveTab,
  selectedMode,
  setSelectedMode,
  onSelectStation,
  searchQuery,
  setSearchQuery
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const filteredStations = searchQuery.trim()
    ? STATIONS.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModeToggle = (mode) => {
    if (selectedMode === mode) {
      setSelectedMode('all');
    } else {
      setSelectedMode(mode);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[var(--color-bg)]/85 backdrop-blur-xl shadow-[0_1px_8px_var(--shadow-header-color)] border-b border-[var(--color-border)]">
      <div className="h-20 w-full px-4 md:px-8 flex items-center justify-between gap-3 md:gap-6">
        
        {/* Search & Main Nav Tabs */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-2xl">
          
          {/* Search Box */}
          <div ref={searchContainerRef} className="relative flex-1">
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none text-[20px]">
              search
            </span>
            <input
              type="text"
              className="w-full h-12 pr-12 pl-4 rounded-xl bg-[var(--color-surface)] border border-transparent focus:border-[var(--color-primary)] focus:bg-white text-[14px] text-[var(--color-text)] placeholder-[var(--color-text-subtle)] outline-none transition-all"
              placeholder="ابحث عن مواقف ومحطات وأماكن في مصر..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)] hover:text-[var(--color-text)] p-1 rounded-full hover:bg-[var(--color-border)]"
                aria-label="مسح البحث"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {isSearchOpen && filteredStations.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-1 bg-white rounded-xl shadow-xl border border-[var(--color-border)] overflow-hidden z-50">
                <div className="p-2 text-[11px] font-semibold text-[var(--color-text-subtle)] bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                  المحطات المطابقة
                </div>
                {filteredStations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => {
                      onSelectStation(station);
                      setSearchQuery(station.name);
                      setIsSearchOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-right flex items-center justify-between hover:bg-[var(--color-surface)] transition-colors border-b border-[var(--color-surface)] last:border-none group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getTransportColor(station.mode) }} />
                      <div>
                        <div className="text-[14px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                          {station.name}
                        </div>
                        <div className="text-[12px] text-[var(--color-text-subtle)]">
                          {station.nameEn} • {station.city}
                        </div>
                      </div>
                    </div>
                    <span className="text-[12px] px-2 py-0.5 rounded bg-[var(--color-control)] text-[var(--color-text-muted)]">
                      {getTransportLabel(station.mode)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Pill Switch: الخريطة / مسارات السرفيس / دليل التعريفة والمواقف / خطط رحلة */}
          <nav className="hidden sm:flex items-center gap-1 p-1 bg-[var(--color-control)] rounded-full shrink-0">
            <button
              onClick={() => setActiveTab('map-view')}
              className={`px-3.5 md:px-4 py-2 text-[13px] md:text-[14px] font-semibold rounded-full transition-all duration-200 ${
                activeTab === 'map-view'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              الخريطة
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-3.5 md:px-4 py-2 text-[13px] md:text-[14px] font-semibold rounded-full transition-all duration-200 ${
                activeTab === 'routes'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              مسارات السرفيس
            </button>
            <button
              onClick={() => setActiveTab('tariffs')}
              className={`px-3.5 md:px-4 py-2 text-[13px] md:text-[14px] font-semibold rounded-full transition-all duration-200 ${
                activeTab === 'tariffs'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              دليل التعريفة والمواقف
            </button>
            <button
              onClick={() => setActiveTab('plan-trip')}
              className={`px-3.5 md:px-4 py-2 text-[13px] md:text-[14px] font-semibold rounded-full transition-all duration-200 ${
                activeTab === 'plan-trip'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              خطط رحلة
            </button>
          </nav>
        </div>

        {/* Right Controls: Mode Filters & User Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Grouped transport filters */}
          <div className="flex gap-1.5 md:gap-2 border-l border-[var(--color-border-strong)] pl-2 md:pl-4">
            {TRANSPORT_FILTERS.map((filter) => {
              const active = selectedMode === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleModeToggle(filter.id)}
                  className="px-3 md:px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all border"
                  style={{
                    backgroundColor: active ? filter.color : 'var(--color-control)',
                    color: active ? 'var(--color-white)' : 'var(--color-text-muted)',
                    borderColor: active ? filter.color : 'transparent',
                  }}
                  title={`عرض ${filter.label} في جميع المدن`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* User Profile Button */}
          {/* <button
            onClick={() => setActiveTab('profile')}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'profile'
                ? 'ring-2 ring-offset-2 ring-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md'
                : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]'
            }`}
            title="الملف الشخصي والحساب"
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
          </button> */}
        </div>

      </div>

      {/* Mobile Sub-Nav Switcher */}
      <div className="flex sm:hidden w-full px-2 pb-2 justify-center">
        <div className="flex w-full items-center justify-around bg-[var(--color-control)] p-1 rounded-xl overflow-x-auto no-scrollbar gap-1">
          <button
            onClick={() => setActiveTab('map-view')}
            className={`px-2.5 py-1.5 text-[12px] font-semibold rounded-lg text-center whitespace-nowrap ${
              activeTab === 'map-view' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)]'
            }`}
          >
            الخريطة
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-2.5 py-1.5 text-[12px] font-semibold rounded-lg text-center whitespace-nowrap ${
              activeTab === 'routes' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)]'
            }`}
          >
            المسارات
          </button>
          <button
            onClick={() => setActiveTab('tariffs')}
            className={`px-2.5 py-1.5 text-[12px] font-semibold rounded-lg text-center whitespace-nowrap ${
              activeTab === 'tariffs' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)]'
            }`}
          >
            التعريفة
          </button>
          <button
            onClick={() => setActiveTab('plan-trip')}
            className={`px-2.5 py-1.5 text-[12px] font-semibold rounded-lg text-center whitespace-nowrap ${
              activeTab === 'plan-trip' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)]'
            }`}
          >
            خطط رحلة
          </button>
          {/* <button
            onClick={() => setActiveTab('profile')}
            className={`px-2.5 py-1.5 text-[12px] font-semibold rounded-lg text-center whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)]'
            }`}
          >
            حسابي
          </button> */}
        </div>
      </div>
    </header>
  );
};
