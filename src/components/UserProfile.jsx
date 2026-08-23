import React, { useState } from 'react';
import { getTransportIcon, getTransportColor } from '../data/transportHelpers';

export const UserProfile = ({
  profile,
  onUpdateProfile,
  onPlanTripWithRoute
}) => {
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('50');
  const [isAddFavoriteOpen, setIsAddFavoriteOpen] = useState(false);
  const [newFavTitle, setNewFavTitle] = useState('');
  const [newFavFrom, setNewFavFrom] = useState('');
  const [newFavTo, setNewFavTo] = useState('');
  const [newFavDuration, setNewFavDuration] = useState('30 دقيقة');
  const [activeSettingsModal, setActiveSettingsModal] = useState(null);

  // Recharge Balance Handler
  const handleRecharge = (e) => {
    e.preventDefault();
    const amount = parseFloat(rechargeAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateProfile({
        ...profile,
        balance: profile.balance + amount
      });
      setIsRechargeModalOpen(false);
    }
  };

  // Add Favorite Route Handler
  const handleAddFavorite = (e) => {
    e.preventDefault();
    if (newFavTitle && newFavFrom && newFavTo) {
      const newFav = {
        id: `fav-${Date.now()}`,
        title: newFavTitle,
        from: newFavFrom,
        to: newFavTo,
        duration: newFavDuration || '35 دقيقة',
        transfers: [
          { name: 'خط نقل محلي', mode: 'bus', color: 'var(--color-primary)' }
        ]
      };
      onUpdateProfile({
        ...profile,
        favoriteRoutes: [newFav, ...profile.favoriteRoutes]
      });
      setIsAddFavoriteOpen(false);
      setNewFavTitle('');
      setNewFavFrom('');
      setNewFavTo('');
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 flex flex-col gap-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
      
      {/* Profile Header Section (Screenshot 3) */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[var(--color-control)] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm border border-[var(--color-border)]">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--color-orange-dark)]/5 rounded-full blur-3xl pointer-events-none" />

        {/* User Info */}
        <div className="flex items-center gap-6 z-10">
          <div className="relative group">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-md transition-transform duration-300 group-hover:scale-105 border-2 border-white"
            />
            <button
              onClick={() => setActiveSettingsModal('إدارة الملف الشخصي')}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors"
              title="تعديل الصورة"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] font-bold text-[var(--color-text)]">{profile.name}</h1>
            <p className="text-[14px] text-[var(--color-text-muted)]">{profile.email}</p>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-[var(--color-border)] rounded-full text-[12px] font-medium text-[var(--color-text-muted)] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[var(--color-primary)]">star</span>
                {profile.tier}
              </span>

              <span className="px-3 py-1 bg-[var(--color-primary-soft)] rounded-full text-[12px] font-bold text-[var(--color-primary-dark)] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">payments</span>
                رصيد: {profile.balance} ج.م
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: شحن الرصيد */}
        <button
          onClick={() => setIsRechargeModalOpen(true)}
          className="w-full md:w-auto px-6 h-[52px] bg-[var(--color-primary)] text-white rounded-full text-[14px] font-bold hover:bg-[var(--color-primary-hover)] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 z-10 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[20px]">add_card</span>
          شحن الرصيد
        </button>
      </section>

      {/* Bento Grid Layout for Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Column 1: Stats & Settings (Left Side in RTL) */}
        <div className="md:col-span-4 flex flex-col gap-6 order-2 md:order-1">
          
          {/* Statistics Card (Screenshot 3) */}
          <div className="bg-[var(--color-control)] rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden border border-[var(--color-border)]">
            <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l from-[var(--color-primary)] via-[var(--color-orange-dark)] to-[var(--color-text)]" />
            
            <h2 className="text-[18px] font-bold text-[var(--color-text)] flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--color-primary)]">bar_chart</span>
              إحصائيات الشهر
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-1">
              <div className="bg-white rounded-2xl p-4 flex flex-col gap-1 justify-center items-center text-center shadow-sm border border-[var(--color-border)]">
                <span className="text-[28px] font-bold text-[var(--color-primary)]">{profile.monthlyTrips}</span>
                <span className="text-[12px] text-[var(--color-text-subtle)]">رحلة مكتملة</span>
              </div>

              <div className="bg-white rounded-2xl p-4 flex flex-col gap-1 justify-center items-center text-center shadow-sm border border-[var(--color-border)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[var(--color-orange-dark)]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="text-[28px] font-bold text-[var(--color-orange-dark)] relative z-10">{profile.carbonSavedKg} كجم</span>
                <span className="text-[12px] text-[var(--color-text-subtle)] relative z-10">توفير كربون</span>
              </div>
            </div>

            {/* Weekly Activity SVG Line Chart */}
            <div className="mt-4 pt-4 border-t border-[var(--color-border-strong)]/40 flex flex-col gap-2">
              <span className="text-[12px] font-semibold text-[var(--color-text-muted)]">نشاط الرحلات الأسبوعي</span>
              
              <div className="w-full h-14 relative flex items-end">
                <svg className="w-full h-14 text-[var(--color-primary)]" preserveAspectRatio="none" viewBox="0 0 100 30">
                  <path
                    d="M0,30 L0,20 Q10,15 20,25 T40,10 T60,20 T80,5 L100,15 L100,30 Z"
                    fill="currentColor"
                    fillOpacity="0.12"
                  />
                  <path
                    d="M0,20 Q10,15 20,25 T40,10 T60,20 T80,5 L100,15"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              <div className="flex justify-between text-[11px] font-medium text-[var(--color-text-subtle)] mt-1">
                {profile.weeklyActivity.map((w, idx) => (
                  <span key={idx}>{w.day}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Account Settings List (Screenshot 3) */}
          <div className="bg-[var(--color-control)] rounded-3xl p-6 shadow-sm flex flex-col gap-2 border border-[var(--color-border)]">
            <h2 className="text-[18px] font-bold text-[var(--color-text)] mb-2 px-1">إعدادات الحساب</h2>

            <button
              onClick={() => setActiveSettingsModal('إدارة الملف الشخصي')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[var(--color-surface)] transition-colors group shadow-sm border border-[var(--color-border)] text-right"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary-hover)] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                </div>
                <span className="text-[14px] font-semibold text-[var(--color-text)]">إدارة الملف الشخصي</span>
              </div>
              <span className="material-symbols-outlined text-[var(--color-text-subtle)] rotate-180">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveSettingsModal('طرق الدفع')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[var(--color-surface)] transition-colors group shadow-sm border border-[var(--color-border)] text-right"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-orange)] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">credit_card</span>
                </div>
                <span className="text-[14px] font-semibold text-[var(--color-text)]">طرق الدفع</span>
              </div>
              <span className="material-symbols-outlined text-[var(--color-text-subtle)] rotate-180">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveSettingsModal('إعدادات الإشعارات')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[var(--color-surface)] transition-colors group shadow-sm border border-[var(--color-border)] text-right"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-text)] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                </div>
                <span className="text-[14px] font-semibold text-[var(--color-text)]">إعدادات الإشعارات</span>
              </div>
              <span className="material-symbols-outlined text-[var(--color-text-subtle)] rotate-180">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveSettingsModal('تسجيل الخروج')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] transition-colors group shadow-sm border border-[var(--color-border)] mt-1 text-right"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-border)] text-[var(--color-text-muted)] flex items-center justify-center group-hover:bg-[var(--color-danger)] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </div>
                <span className="text-[14px] font-semibold text-[var(--color-text)] group-hover:text-[var(--color-danger)]">تسجيل الخروج</span>
              </div>
            </button>
          </div>

        </div>

        {/* Column 2: Saved Routes & Travel History (Right Side in RTL) */}
        <div className="md:col-span-8 flex flex-col gap-6 order-1 md:order-2">
          
          {/* Favorite Routes Section (Screenshot 3) */}
          <div className="bg-[var(--color-control)] rounded-3xl p-6 shadow-sm flex flex-col gap-4 border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[var(--color-text)] flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-orange-dark)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                المسارات المفضلة
              </h2>
              <button
                onClick={() => setIsAddFavoriteOpen(true)}
                className="text-[var(--color-primary)] text-[13px] font-bold hover:underline"
              >
                إضافة مسار
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
              {profile.favoriteRoutes.map((fav) => (
                <div
                  key={fav.id}
                  onClick={() => onPlanTripWithRoute(fav.from, fav.to)}
                  className="bg-white rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-[var(--color-border)]"
                >
                  {/* Right colored vertical bar */}
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-[var(--color-primary)]" />

                  <div className="flex justify-between items-start pl-2">
                    <div className="flex flex-col gap-1 pr-3">
                      <h3 className="text-[14px] font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                        {fav.title}
                      </h3>
                      <p className="text-[13px] text-[var(--color-text-muted)]">
                        {fav.from} ← {fav.to}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // quick plan
                        onPlanTripWithRoute(fav.from, fav.to);
                      }}
                      className="w-8 h-8 rounded-full bg-[var(--color-control)] text-[var(--color-text-muted)] flex items-center justify-center opacity-70 group-hover:opacity-100 hover:bg-[var(--color-border)]"
                      title="بدء الرحلة فوراً"
                    >
                      <span className="material-symbols-outlined text-[16px]">navigation</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pr-3 pt-2 border-t border-[var(--color-border-strong)]/30">
                    {fav.transfers.map((tr, idx) => (
                      <React.Fragment key={idx}>
                        <span
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1"
                          style={{ backgroundColor: tr.color }}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {getTransportIcon(tr.mode)}
                          </span>
                          {tr.name}
                        </span>
                        {idx < fav.transfers.length - 1 && (
                          <span className="material-symbols-outlined text-[var(--color-text-subtle)] text-[14px]">arrow_left_alt</span>
                        )}
                      </React.Fragment>
                    ))}
                    <span className="mr-auto text-[11px] text-[var(--color-text-subtle)] flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[13px]">schedule</span>
                      {fav.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel History Section (Screenshot 3) */}
          <div className="bg-[var(--color-control)] rounded-3xl p-6 shadow-sm flex flex-col gap-4 flex-1 border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[var(--color-text)] flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-primary)]">history</span>
                سجل الرحلات
              </h2>
              <button className="text-[var(--color-text-muted)] text-[12px] font-semibold hover:text-[var(--color-primary)] transition-colors flex items-center gap-1">
                عرض الكل
                <span className="material-symbols-outlined text-[16px]">arrow_left</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-1">
              {profile.travelHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-[var(--color-border)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner" style={{ backgroundColor: getTransportColor(item.mode) }}>
                      <span className="material-symbols-outlined text-[24px]">{getTransportIcon(item.mode)}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[var(--color-text)]">
                        {item.from} إلى {item.to}
                      </span>
                      <span className="text-[12px] text-[var(--color-text-subtle)]">
                        {item.details}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[14px] font-bold text-[var(--color-text)]">
                      {item.fare.toFixed(2)} ج.م
                    </span>
                    <span className="px-2.5 py-0.5 bg-[var(--color-border)] text-[var(--color-text-muted)] rounded text-[10px] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-[var(--color-primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Recharge Wallet Modal */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[var(--color-border)] flex flex-col gap-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[var(--color-text)] flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-primary)]">add_card</span>
                شحن المحفظة الذكية
              </h3>
              <button
                onClick={() => setIsRechargeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--color-control)] flex items-center justify-center text-[var(--color-text-muted)]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[13px] text-[var(--color-text-subtle)]">
              اشحن رصيد بطاقتك لاستخدام المترو والقطارات بدون انتظار في طوابير التذاكر.
            </p>

            <form onSubmit={handleRecharge} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[var(--color-text-muted)]">المبلغ بالجنيه المصري:</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['20', '50', '100', '200', '300'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setRechargeAmount(amt)}
                      className={`py-2 rounded-xl text-[13px] font-bold border transition-all ${
                        rechargeAmount === amt
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]'
                      }`}
                    >
                      {amt} ج.م
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[15px] font-bold text-[var(--color-text)]"
                />
              </div>

              <div className="p-3 bg-[var(--color-primary-soft)]/50 rounded-xl text-[12px] text-[var(--color-primary-dark)] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>الدفع آمن ومباشر عبر فوري، المحافظ الإلكترونية، وبطاقات الدفع.</span>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[var(--color-primary)] text-white rounded-xl font-bold text-[14px] hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                تأكيد الشحن فوراً
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Favorite Route Modal */}
      {isAddFavoriteOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[var(--color-border)] flex flex-col gap-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[var(--color-text)] flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-orange-dark)]">favorite</span>
                إضافة مسار جديد إلى المفضلة
              </h3>
              <button
                onClick={() => setIsAddFavoriteOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--color-control)] flex items-center justify-center text-[var(--color-text-muted)]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddFavorite} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[12px] font-bold text-[var(--color-text-muted)] block mb-1">اسم المسار:</label>
                <input
                  type="text"
                  placeholder="مثال: الذهاب إلى الجامعة"
                  required
                  value={newFavTitle}
                  onChange={(e) => setNewFavTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[14px]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[var(--color-text-muted)] block mb-1">نقطة الانطلاق (من):</label>
                <input
                  type="text"
                  placeholder="مثال: المعادي"
                  required
                  value={newFavFrom}
                  onChange={(e) => setNewFavFrom(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[14px]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[var(--color-text-muted)] block mb-1">نقطة الوصول (إلى):</label>
                <input
                  type="text"
                  placeholder="مثال: جامعة القاهرة"
                  required
                  value={newFavTo}
                  onChange={(e) => setNewFavTo(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[14px]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[var(--color-text-muted)] block mb-1">الوقت المتوقع:</label>
                <input
                  type="text"
                  placeholder="مثال: ٤٠ دقيقة"
                  value={newFavDuration}
                  onChange={(e) => setNewFavDuration(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[14px]"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 mt-2 bg-[var(--color-primary)] text-white rounded-xl font-bold text-[14px] hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                حفظ في المفضلة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Settings Action Dialog Feedback */}
      {activeSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-[var(--color-border)] flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">settings</span>
            </div>
            <h3 className="text-[18px] font-bold text-[var(--color-text)]">{activeSettingsModal}</h3>
            <p className="text-[13px] text-[var(--color-text-subtle)]">
              تم تسجيل التعديل بنجاح. حسابك متصل ومحدث بأحدث تفضيلات شبكة النقل العام.
            </p>
            <button
              onClick={() => setActiveSettingsModal(null)}
              className="w-full h-11 bg-[var(--color-primary)] text-white rounded-xl font-bold text-[13px] hover:bg-[var(--color-primary-hover)]"
            >
              تم
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
