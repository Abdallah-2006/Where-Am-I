import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { STATIONS, TRANSIT_LINES } from '../data/transitData';
import { matchesModeFilter, getTransportColor, getTransportIcon, getTransportLabel, getTransportGroup, resolveCssColor } from '../data/transportHelpers';

// Tile Layer configurations from OpenStreetMap & Carto OSM
const TILE_LAYERS = {
  osmVoyager: {
    name: 'خريطة النقل والشوارع (OSM)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
  },
  osmStandard: {
    name: 'OpenStreetMap القياسية',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
  },
  osmHot: {
    name: 'OpenStreetMap الإنسانية',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by HOT'
  }
};

export const InteractiveMap = ({
  selectedStation,
  onSelectStation,
  activeRoute,
  selectedMode,
  selectedLine,
  onSelectLine,
  onPlanTripFromStation,
  onPlanTripToStation
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const linesLayerGroupRef = useRef(null);
  const selectedLineLayerGroupRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const routeLayerGroupRef = useRef(null);

  const [activeTileStyle, setActiveTileStyle] = useState('osmVoyager');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Egypt-wide fallback; the browser location is preferred when permission is available.
    const map = L.map(mapContainerRef.current, {
      center: [26.8206, 30.8025],
      zoom: 6,
      minZoom: 7,
      maxZoom: 18,
      zoomControl: false // Using custom sleek UI controls
    });

    // Add Tile Layer
    const currentConfig = TILE_LAYERS[activeTileStyle];
    tileLayerRef.current = L.tileLayer(currentConfig.url, {
      attribution: currentConfig.attribution,
      maxZoom: 19
    }).addTo(map);

    // Initialize Layer Groups
    linesLayerGroupRef.current = L.layerGroup().addTo(map);
    selectedLineLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => map.flyTo([coords.latitude, coords.longitude], 13, { duration: 1.2 }),
        () => {},
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
      );
    }

    // Clean up
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const currentConfig = TILE_LAYERS[activeTileStyle];
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(currentConfig.url, {
      attribution: currentConfig.attribution,
      maxZoom: 19
    }).addTo(mapInstanceRef.current);
  }, [activeTileStyle]);

  // Render All Transit Lines Real Street Polylines
  useEffect(() => {
    if (!mapInstanceRef.current || !linesLayerGroupRef.current) return;
    linesLayerGroupRef.current.clearLayers();

    TRANSIT_LINES.forEach((line) => {
      // Check mode filter
      if (!matchesModeFilter(line.mode, selectedMode)) {
        return;
      }

      // If a single line is specifically selected, reduce opacity of others
      const isThisLineSelected = selectedLine?.id === line.id;
      const isAnyLineSelected = !!selectedLine;

      const latLngs =
        line.detailedPathLatLngs && line.detailedPathLatLngs.length > 1
          ? line.detailedPathLatLngs
          : line.stationIds
              .map((sId) => {
                const st = STATIONS.find((s) => s.id === sId);
                return st ? [st.lat, st.lng] : null;
              })
              .filter((pt) => pt !== null);

      if (latLngs.length < 2) return;

      // Glow casing for street path visibility
      const casing = L.polyline(latLngs, {
        color: resolveCssColor('var(--color-white)'),
        weight: getTransportGroup(line.mode) === 'rail' ? 7 : 6,
        opacity: isAnyLineSelected ? (isThisLineSelected ? 0.9 : 0.2) : 0.75,
        lineCap: 'round',
        lineJoin: 'round'
      });
      linesLayerGroupRef.current?.addLayer(casing);

      // Main line street polyline
      const poly = L.polyline(latLngs, {
        color: resolveCssColor(line.color),
        weight: getTransportGroup(line.mode) === 'rail' ? 5 : isThisLineSelected ? 6 : 4,
        opacity: isAnyLineSelected ? (isThisLineSelected ? 1.0 : 0.35) : 0.85,
        dashArray:
          getTransportGroup(line.mode) === 'rail'
            ? '10, 8'
            : line.mode === 'microbus'
            ? '6, 6'
            : undefined,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Interactive tooltips with street route information
      poly.bindTooltip(
        `<div class="font-bold text-[12px] text-right" dir="rtl">
          <div class="text-[var(--color-primary)]">${line.name}</div>
          <div class="text-[10px] text-[var(--color-text-subtle)] font-normal mt-0.5">${line.streetPathDescription || ''}</div>
          <div class="text-[10px] text-[var(--color-success)] font-medium mt-0.5">الأجرة: ${line.fareRange} • ${line.frequency}</div>
        </div>`,
        { sticky: true, direction: 'top', className: 'shadow-lg rounded-xl border border-[var(--color-border)] p-2' }
      );

      // Click on line to select it
      poly.on('click', () => {
        if (onSelectLine) {
          onSelectLine(line);
        }
      });

      linesLayerGroupRef.current?.addLayer(poly);
    });
  }, [selectedMode, selectedLine, onSelectLine]);

  // Render Selected Line Street Highlight Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLineLayerGroupRef.current) return;
    selectedLineLayerGroupRef.current.clearLayers();

    if (!selectedLine || !selectedLine.detailedPathLatLngs || selectedLine.detailedPathLatLngs.length < 2) {
      return;
    }

    const latLngs = selectedLine.detailedPathLatLngs;

    // Glowing vibrant pulse underlay
    const glow = L.polyline(latLngs, {
      color: resolveCssColor(selectedLine.color),
      weight: 12,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    });
    selectedLineLayerGroupRef.current.addLayer(glow);

    // Sharp white border
    const border = L.polyline(latLngs, {
      color: resolveCssColor('var(--color-white)'),
      weight: 7,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    });
    selectedLineLayerGroupRef.current.addLayer(border);

    // Highlighted street core
    const highlight = L.polyline(latLngs, {
      color: resolveCssColor(selectedLine.color),
      weight: 4.5,
      opacity: 1.0,
      lineCap: 'round',
      lineJoin: 'round'
    });
    selectedLineLayerGroupRef.current.addLayer(highlight);

    // Start Landmark Pin
    const startPt = latLngs[0];
    const startIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center">
          <div class="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-[11px] shadow-md border-2 border-white">
            ١
          </div>
        </div>
      `,
      className: 'custom-path-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    });
    const startMarker = L.marker(startPt, { icon: startIcon });
    startMarker.bindTooltip(
      `<div class="font-bold text-[12px] text-right" dir="rtl">بداية المسار: ${selectedLine.origin}</div>`,
      { direction: 'top' }
    );
    selectedLineLayerGroupRef.current.addLayer(startMarker);

    // End Landmark Pin
    const endPt = latLngs[latLngs.length - 1];
    const endIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center">
          <div class="w-7 h-7 rounded-full bg-[var(--color-danger)] text-white flex items-center justify-center font-bold text-[11px] shadow-md border-2 border-white">
            نهاية
          </div>
        </div>
      `,
      className: 'custom-path-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    });
    const endMarker = L.marker(endPt, { icon: endIcon });
    endMarker.bindTooltip(
      `<div class="font-bold text-[12px] text-right" dir="rtl">نهاية المسار: ${selectedLine.destination}</div>`,
      { direction: 'top' }
    );
    selectedLineLayerGroupRef.current.addLayer(endMarker);

    // Fit map bounds to show complete street path
    const bounds = L.latLngBounds(latLngs);
    mapInstanceRef.current.fitBounds(bounds, {
      padding: [70, 70],
      maxZoom: 15
    });
  }, [selectedLine]);

  // Render Station Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;
    markersLayerGroupRef.current.clearLayers();

    const visibleStations = STATIONS.filter((st) => {
      if (selectedMode === 'all') return true;
      return matchesModeFilter(st.mode, selectedMode);
    });

    visibleStations.forEach((station) => {
      const isSelected = selectedStation?.id === station.id;
      const isHub = station.isHub;

      const nodeColor = getTransportColor(station.mode);

      // Custom Clean HTML Marker Pin
      const icon = L.divIcon({
        html: `
          <div class="group relative cursor-pointer transition-transform duration-200 hover:scale-110 ${
            isSelected ? 'scale-125 z-50' : ''
          }">
            <div class="relative flex items-center justify-center">
              ${
                isSelected
                  ? `<div class="absolute -inset-2 rounded-full animate-ping opacity-75" style="background-color: ${nodeColor}"></div>`
                  : ''
              }
              <div 
                class="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white transition-colors"
                style="background-color: ${nodeColor}"
              >
                <span class="material-symbols-outlined text-white text-[14px] md:text-[16px]">
                  ${
                    getTransportIcon(station.mode)
                  }
                </span>
              </div>
              ${
                isHub
                  ? '<div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white"></div>'
                  : ''
              }
            </div>
          </div>
        `,
        className: 'custom-station-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([station.lat, station.lng], { icon });

      // Click Event
      marker.on('click', () => {
        onSelectStation(station);
      });

      // Tooltip with station information and rapid action buttons
      const tooltipContent = `
        <div class="p-2 text-right max-w-[240px]" dir="rtl">
          <div class="flex items-center gap-1.5 justify-between">
            <span class="text-[13px] font-bold text-[var(--color-text)]">${station.name}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded font-semibold text-white" style="background-color: ${nodeColor}">
              ${getTransportLabel(station.mode)}
            </span>
          </div>
          <div class="text-[11px] text-[var(--color-text-subtle)] mt-1 line-clamp-2">${station.description || ''}</div>
          <div class="text-[11px] font-semibold text-[var(--color-primary)] mt-1.5 border-t border-gray-100 pt-1">
            ${station.fareInfo || '٤.٥ جنيه'}
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -14],
        className: 'custom-station-tooltip shadow-lg rounded-xl border border-[var(--color-border)] p-0 overflow-hidden'
      });

      markersLayerGroupRef.current?.addLayer(marker);
    });
  }, [selectedMode, selectedStation, onSelectStation, onPlanTripFromStation, onPlanTripToStation]);

  // Center map on Selected Station
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedStation) return;
    mapInstanceRef.current.flyTo([selectedStation.lat, selectedStation.lng], 15, {
      duration: 0.8,
      easeLinearity: 0.25
    });
  }, [selectedStation]);

  // Render Calculated Active Route Polyline & Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerGroupRef.current) return;
    routeLayerGroupRef.current.clearLayers();

    if (!activeRoute || !activeRoute.pathLatLngs || activeRoute.pathLatLngs.length < 2) {
      return;
    }

    const latLngs = activeRoute.pathLatLngs;

    // Glowing wider street path layer
    const glowPath = L.polyline(latLngs, {
      color: resolveCssColor('var(--color-danger)'),
      weight: 12,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    });
    routeLayerGroupRef.current.addLayer(glowPath);

    // Route white border
    const borderPath = L.polyline(latLngs, {
      color: resolveCssColor('var(--color-white)'),
      weight: 8,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    });
    routeLayerGroupRef.current.addLayer(borderPath);

    // Main vibrant street polyline
    const mainPath = L.polyline(latLngs, {
      color: resolveCssColor('var(--color-danger)'),
      weight: 5,
      opacity: 1.0,
      lineCap: 'round',
      lineJoin: 'round'
    });
    routeLayerGroupRef.current.addLayer(mainPath);

    // Start Pin Icon
    const startLatLng = latLngs[0];
    const startIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-[12px] shadow-lg border-2 border-white animate-bounce">
            أ
          </div>
        </div>
      `,
      className: 'custom-route-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
    const startMarker = L.marker(startLatLng, { icon: startIcon });
    startMarker.bindTooltip(
      `<div class="font-bold text-[12px] text-right" dir="rtl">نقطة الانطلاق: ${activeRoute.fromStation}</div>`,
      { permanent: false, direction: 'top' }
    );
    routeLayerGroupRef.current.addLayer(startMarker);

    // End Pin Icon
    const endLatLng = latLngs[latLngs.length - 1];
    const endIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-[var(--color-danger)] text-white flex items-center justify-center font-bold text-[12px] shadow-lg border-2 border-white animate-bounce">
            ب
          </div>
        </div>
      `,
      className: 'custom-route-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
    const endMarker = L.marker(endLatLng, { icon: endIcon });
    endMarker.bindTooltip(
      `<div class="font-bold text-[12px] text-right" dir="rtl">الوجهة: ${activeRoute.toStation}</div>`,
      { permanent: false, direction: 'top' }
    );
    routeLayerGroupRef.current.addLayer(endMarker);

    // Fit map bounds to view entire route
    const bounds = L.latLngBounds(latLngs);
    mapInstanceRef.current.fitBounds(bounds, {
      padding: [80, 80],
      maxZoom: 15
    });
  }, [activeRoute]);

  // Handlers for Map Controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetEgypt = () => {
    mapInstanceRef.current?.flyTo([26.8206, 30.8025], 6, { duration: 0.8 });
  };

  const handleFitAllNetwork = () => {
    if (!mapInstanceRef.current) return;
    const allCoords = STATIONS.map((s) => [s.lat, s.lng]);
    const bounds = L.latLngBounds(allCoords);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) {
      handleResetEgypt();
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        mapInstanceRef.current?.flyTo([latitude, longitude], 15, { duration: 1 });

        // Add temporary user location pulsing circle
        if (mapInstanceRef.current) {
          const userCircle = L.circleMarker([latitude, longitude], {
            radius: 9,
            fillColor: resolveCssColor('var(--color-primary)'),
            fillOpacity: 0.9,
            color: resolveCssColor('var(--color-white)'),
            weight: 3
          }).addTo(mapInstanceRef.current);
          userCircle.bindTooltip('موقعك الحالي', { permanent: true, direction: 'top' }).openTooltip();
        }
      },
      () => {
        setIsLocating(false);
        handleResetEgypt();
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[var(--color-surface)]">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Control Tools (Top Left) */}
      <div className="absolute top-20 md:top-24 left-4 md:left-8 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-[var(--color-border)] p-1.5">
        <button
          onClick={handleZoomIn}
          aria-label="تكبير الخريطة"
          className="w-10 h-10 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] rounded-xl transition-colors"
          title="تكبير (+)"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
        </button>
        <div className="w-6 h-px bg-[var(--color-border)] mx-auto" />
        <button
          onClick={handleZoomOut}
          aria-label="تصغير الخريطة"
          className="w-10 h-10 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] rounded-xl transition-colors"
          title="تصغير (-)"
        >
          <span className="material-symbols-outlined text-[22px]">remove</span>
        </button>
        <div className="w-6 h-px bg-[var(--color-border)] mx-auto" />
        <button
          onClick={handleResetEgypt}
          aria-label="إعادة ضبط مركز مصر"
          className="w-10 h-10 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] rounded-xl transition-colors"
          title="مركز مصر"
        >
          <span className="material-symbols-outlined text-[22px]">near_me</span>
        </button>
        <button
          onClick={handleFitAllNetwork}
          aria-label="عرض كامل شبكة مصر"
          className="w-10 h-10 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] rounded-xl transition-colors"
          title="عرض كامل الشبكة والمحافظات"
        >
          <span className="material-symbols-outlined text-[22px]">zoom_out_map</span>
        </button>
        <div className="w-6 h-px bg-[var(--color-border)] mx-auto" />
        <button
          onClick={handleLocateMe}
          aria-label="تحديد موقعي"
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
            isLocating ? 'bg-[var(--color-primary)] text-white animate-pulse' : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)]'
          }`}
          title="تحديد موقعي الحالي"
        >
          <span className="material-symbols-outlined text-[22px]">my_location</span>
        </button>
      </div>

      {/* Map Layer Switcher (Top Right floating under Header) */}
      <div className="absolute top-20 md:top-24 right-4 md:right-8 z-20">
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-[var(--color-border)] text-[13px] font-semibold text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">layers</span>
            <span>خرائط OpenStreetMap</span>
            <span className="material-symbols-outlined text-[16px] text-[var(--color-text-subtle)]">expand_more</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[var(--color-border)] p-1.5 z-30 space-y-1">
              {Object.entries(TILE_LAYERS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTileStyle(key);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-right px-3 py-2 rounded-lg text-[12px] flex items-center justify-between transition-colors ${
                    activeTileStyle === key
                      ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  <span>{config.name}</span>
                  {activeTileStyle === key && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Line Banner (If a street path is highlighted) */}
      {selectedLine && (
        <div className="absolute top-20 md:top-24 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-[var(--color-border)] flex items-center gap-3 text-[13px]">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: selectedLine.color }}
          />
          <span className="font-bold text-[var(--color-text)]">{selectedLine.name}</span>
          <span className="text-[11px] text-[var(--color-text-subtle)] hidden md:inline">({selectedLine.fareRange})</span>
          {onSelectLine && (
            <button
              onClick={() => onSelectLine(null)}
              className="text-[var(--color-text-subtle)] hover:text-[var(--color-danger)] flex items-center p-0.5"
              title="إلغاء تحديد المسار"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      )}

      {/* Bottom Map Legend & OpenStreetMap Attribution (Bottom Left) */}
      <div className="absolute bottom-4 left-4 md:left-8 z-20 flex flex-col gap-2 max-w-[280px] md:max-w-xs">
        {showLegend && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-[var(--color-border)] text-[11px] space-y-2">
            <div className="flex items-center justify-between font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-1.5">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">legend_toggle</span>
                مسارات النقل والمواصلات في مصر
              </span>
              <button
                onClick={() => setShowLegend(false)}
                className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
                title="إخفاء دليل الرموز"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[var(--color-text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--color-public-bus)]" />
                <span>نقل محلي</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--color-rail)]" />
                <span>السكك الحديدية</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--color-microbus)]" />
                <span>الميكروباص والمواقف الإقليمية</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-black/20" />
                <span>نقطة تبديل ومحور رئيسي</span>
              </div>
            </div>

            <div className="text-[10px] text-[var(--color-text-subtle)] pt-1 border-t border-gray-100 flex items-center justify-between">
              <span>بيانات OpenStreetMap المتاحة</span>
            </div>
          </div>
        )}

        {!showLegend && (
          <button
            onClick={() => setShowLegend(true)}
            className="self-start px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">legend_toggle</span>
            <span>دليل الرموز والمسارات</span>
          </button>
        )}
      </div>

    </div>
  );
};
