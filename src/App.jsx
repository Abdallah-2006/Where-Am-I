import React, { useState } from 'react';
import { STATIONS, INITIAL_USER_PROFILE, calculateTripRoute } from './data/transitData';
import { Header } from './components/Header';
import { InteractiveMap } from './components/InteractiveMap';
import { StationBottomSheet } from './components/StationBottomSheet';
import { StationDetailSidebar } from './components/StationDetailSidebar';
import { TripPlannerCard } from './components/TripPlannerCard';
import { RouteExplorer } from './components/RouteExplorer';
import { TariffDirectory } from './components/TariffDirectory';
import { UserProfile } from './components/UserProfile';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation tabs: 'map-view' | 'routes' | 'tariffs' | 'plan-trip' | 'profile'
  const [activeTab, setActiveTab] = useState('map-view');
  
  // Transit Mode filter
  const [selectedMode, setSelectedMode] = useState('all');
  
  // Search query in Header
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Station for detail / bottom sheet
  const [selectedStation, setSelectedStation] = useState(null);
  
  // Selected Transit Line / Street Path for deep inspection
  const [selectedLine, setSelectedLine] = useState(null);

  // Sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Trip Planner state
  const defaultOrigin = STATIONS.find((station) => station.id === 'cairo-ramses-central')?.name || STATIONS[0]?.name || '';
  const defaultDestination = STATIONS.find((station) => station.id === 'metro-sadat-tahrir')?.name || STATIONS[1]?.name || '';
  const [originName, setOriginName] = useState(defaultOrigin);
  const [destName, setDestName] = useState(defaultDestination);
  const [activeRoute, setActiveRoute] = useState(() => calculateTripRoute(defaultOrigin, defaultDestination));

  // User Profile state
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);

  // Handle station selection from Map, Search, or Cards
  const handleSelectStation = (station) => {
    setSelectedStation(station);
    // If on profile or tariffs, switch to map view
    if (activeTab === 'profile' || activeTab === 'tariffs') {
      setActiveTab('map-view');
    }
  };

  const handleSelectStationByName = (name) => {
    const st = STATIONS.find((s) => s.name === name);
    if (st) {
      setSelectedStation(st);
      setIsSidebarOpen(true);
    }
  };

  // Trigger Plan Trip from a specific station
  const handlePlanTripFrom = (station) => {
    setOriginName(station.name);
    setActiveTab('plan-trip');
    setIsSidebarOpen(false);
    const newRoute = calculateTripRoute(station.name, destName);
    setActiveRoute(newRoute);
  };

  const handlePlanTripTo = (station) => {
    setDestName(station.name);
    setActiveTab('plan-trip');
    setIsSidebarOpen(false);
    const newRoute = calculateTripRoute(originName, station.name);
    setActiveRoute(newRoute);
  };

  // Plan trip from Favorite Route in Profile
  const handlePlanTripWithRoute = (from, to) => {
    setOriginName(from);
    setDestName(to);
    const route = calculateTripRoute(from, to);
    setActiveRoute(route);
    setActiveTab('plan-trip');
  };

  // Plan trip with a specific transit line
  const handlePlanTripWithLine = (line) => {
    setOriginName(line.origin);
    setDestName(line.destination);
    const route = calculateTripRoute(line.origin, line.destination);
    setActiveRoute(route);
    setActiveTab('plan-trip');
  };

  // Select terminal from Directory on Map
  const handleSelectTerminalOnMap = (terminal) => {
    const matchingStation = STATIONS.find(s => 
      s.name.includes(terminal.name) || 
      terminal.name.includes(s.name) ||
      (Math.abs(s.lat - terminal.lat) < 0.005 && Math.abs(s.lng - terminal.lng) < 0.005)
    );

    if (matchingStation) {
      setSelectedStation(matchingStation);
    } else {
      // Create temporary station object for map focusing
      const tempStation = {
        id: terminal.id,
        name: terminal.name,
        nameEn: terminal.city,
        city: terminal.region,
        mode: 'microbus',
        lines: terminal.serves,
        lat: terminal.lat,
        lng: terminal.lng,
        isHub: terminal.isMainHub,
        fareInfo: 'موقف سيارات معتمد',
        description: `يخدم: ${terminal.serves.join(' • ')}`
      };
      setSelectedStation(tempStation);
    }
    setActiveTab('map-view');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-between text-[var(--color-text)] font-sans antialiased overflow-x-hidden">
      
      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'profile' || tab === 'tariffs') {
            setIsSidebarOpen(false);
          }
        }}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        onSelectStation={handleSelectStation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full pt-20 relative flex flex-col">
        
        {/* TAB 1, 2, 3: Map Canvas Viewport */}
        {activeTab !== 'profile' && activeTab !== 'tariffs' && (
          <div className="relative w-full h-[calc(100vh-80px-50px)] min-h-[580px] flex overflow-hidden">
            
            {/* Interactive OpenStreetMap Canvas (Full screen background with real street polylines) */}
            <div className="absolute inset-0 z-0">
              <InteractiveMap
                selectedStation={selectedStation}
                onSelectStation={handleSelectStation}
                activeRoute={activeTab === 'plan-trip' ? activeRoute : null}
                selectedMode={selectedMode}
                selectedLine={selectedLine}
                onSelectLine={(line) => {
                  setSelectedLine(line);
                  if (line && activeTab !== 'routes') {
                    setActiveTab('routes');
                  }
                }}
                onPlanTripFromStation={handlePlanTripFrom}
                onPlanTripToStation={handlePlanTripTo}
              />
            </div>

            {/* TAB: Route Explorer Floating Panel (When "مسارات السرفيس" is active) */}
            {activeTab === 'routes' && (
              <div className="absolute top-4 right-4 md:right-8 z-30 max-h-[calc(100%-32px)] overflow-y-auto pr-1 pb-4">
                <RouteExplorer
                  selectedLine={selectedLine}
                  onSelectLine={setSelectedLine}
                  onSelectStation={handleSelectStationByName}
                  onPlanTripWithLine={handlePlanTripWithLine}
                  onClose={() => setActiveTab('map-view')}
                />
              </div>
            )}

            {/* TAB: Trip Planner Card (When "خطط رحلة" is active) */}
            {activeTab === 'plan-trip' && (
              <div className="absolute top-4 right-4 md:right-8 z-30 max-h-[calc(100%-32px)] overflow-y-auto pr-1 pb-4">
                <TripPlannerCard
                  originStationName={originName}
                  setOriginStationName={setOriginName}
                  destStationName={destName}
                  setDestStationName={setDestName}
                  onRouteCalculated={setActiveRoute}
                  calculatedRoute={activeRoute}
                  onSelectStation={handleSelectStation}
                />
              </div>
            )}

            {/* Station Bottom Sheet (When station is clicked in Map View) */}
            {activeTab === 'map-view' && selectedStation && !isSidebarOpen && (
              <StationBottomSheet
                station={selectedStation}
                onOpenDetails={() => setIsSidebarOpen(true)}
                onPlanTrip={() => handlePlanTripFrom(selectedStation)}
                onClose={() => setSelectedStation(null)}
              />
            )}

            {/* Station Detail Sidebar (When "التفاصيل الكاملة" is clicked) */}
            {activeTab === 'map-view' && selectedStation && isSidebarOpen && (
              <div className="absolute top-0 right-0 bottom-0 z-40 max-w-full">
                <StationDetailSidebar
                  station={selectedStation}
                  onClose={() => setIsSidebarOpen(false)}
                  onPlanTripFrom={handlePlanTripFrom}
                  onPlanTripTo={handlePlanTripTo}
                />
              </div>
            )}

          </div>
        )}

        {/* TAB 4: Tariff and Terminals Directory View */}
        {activeTab === 'tariffs' && (
          <TariffDirectory
            onSelectTerminalOnMap={handleSelectTerminalOnMap}
            onNavigateToTripPlanner={handlePlanTripWithRoute}
          />
        )}

        {/* TAB 5: User Profile View */}
        {activeTab === 'profile' && (
          <UserProfile
            profile={userProfile}
            onUpdateProfile={setUserProfile}
            onPlanTripWithRoute={handlePlanTripWithRoute}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

