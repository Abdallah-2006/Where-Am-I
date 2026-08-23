export const RAIL_MODES = new Set(['train', 'metro', 'monorail', 'lrt']);
export const PUBLIC_BUS_MODES = new Set(['bus', 'public_bus', 'brt']);

export const TRANSPORT_FILTERS = [
  { id: 'rail', label: 'السكك الحديدية', icon: 'train', color: 'var(--color-rail)' },
  { id: 'public_bus', label: 'النقل العام', icon: 'directions_bus', color: 'var(--color-public-bus)' },
  { id: 'microbus', label: 'الميكروباص', icon: 'airport_shuttle', color: 'var(--color-microbus)' },
];

export function getTransportGroup(mode) {
  if (RAIL_MODES.has(mode)) return 'rail';
  if (PUBLIC_BUS_MODES.has(mode)) return 'public_bus';
  if (mode === 'microbus') return 'microbus';
  return 'other';
}

export function matchesModeFilter(mode, filter) {
  return filter === 'all' || filter === mode || getTransportGroup(mode) === filter;
}

export function getTransportLabel(mode) {
  if (RAIL_MODES.has(mode)) {
    if (mode === 'metro') return 'مترو';
    if (mode === 'monorail') return 'مونوريل';
    if (mode === 'lrt') return 'قطار كهربائي';
    return 'قطار السكة الحديد';
  }
  if (mode === 'brt') return 'أتوبيس ترددي سريع';
  if (PUBLIC_BUS_MODES.has(mode)) return 'نقل عام';
  if (mode === 'microbus') return 'ميكروباص';
  return 'مواصلات';
}

export function getTransportIcon(mode) {
  if (mode === 'metro') return 'subway';
  if (mode === 'monorail') return 'tram';
  if (mode === 'lrt') return 'electric_train';
  if (RAIL_MODES.has(mode)) return 'train';
  if (PUBLIC_BUS_MODES.has(mode)) return 'directions_bus';
  return 'airport_shuttle';
}

export function getTransportColor(mode) {
  if (RAIL_MODES.has(mode)) return 'var(--color-rail)';
  if (mode === 'brt') return 'var(--color-brt)';
  if (PUBLIC_BUS_MODES.has(mode)) return 'var(--color-public-bus)';
  if (mode === 'microbus') return 'var(--color-microbus)';
  return 'var(--color-primary)';
}

export function resolveCssColor(value) {
  if (!value || typeof window === 'undefined' || !value.startsWith('var(')) return value;
  const token = value.slice(4, -1).trim();
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim() || value;
}

export function getTariffCategoryLabel(category) {
  const labels = {
    internal_from_zag: 'خطوط داخلية', external_from_zag: 'خطوط بين المحافظات', from_10th: 'خطوط المدن',
    city_service: 'سرفيس ونقل مدن', cross_link: 'ربط مراكز فرعية', village_feeder: 'خطوط القرى',
    metro: 'مترو الأنفاق', monorail: 'مونوريل', lrt: 'قطار كهربائي LRT', brt: 'أتوبيس ترددي سريع',
    cta_bus: 'أتوبيس النقل العام', internal_microbus: 'ميكروباص داخلي',
  };
  return labels[category] || 'تعريفة مواصلات';
}
