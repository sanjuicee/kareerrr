import React, { Suspense } from 'react';
import { CareerPilotProvider } from './context/CareerPilotProvider';
import { useCareerPilot } from './context/useCareerPilot';
import { Header } from './components/common/Header';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Lazy-load destination modules for bundle performance & code splitting
const DiscoveryView = React.lazy(() =>
  import('./components/destinations/DiscoveryView').then((m) => ({ default: m.DiscoveryView }))
);
const ProfileView = React.lazy(() =>
  import('./components/destinations/ProfileView').then((m) => ({ default: m.ProfileView }))
);
const AtlasView = React.lazy(() =>
  import('./components/destinations/AtlasView').then((m) => ({ default: m.AtlasView }))
);
const PathwaysView = React.lazy(() =>
  import('./components/destinations/PathwaysView').then((m) => ({ default: m.PathwaysView }))
);
const CompareView = React.lazy(() =>
  import('./components/destinations/CompareView').then((m) => ({ default: m.CompareView }))
);
const RoadmapView = React.lazy(() =>
  import('./components/destinations/RoadmapView').then((m) => ({ default: m.RoadmapView }))
);

const ViewLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 font-mono text-xs text-slate-400">
    <div className="w-6 h-6 border-2 border-[#00F0B4] border-t-transparent rounded-full animate-spin" />
    <span className="tracking-widest uppercase text-[11px] text-slate-300">
      Loading Career Pilot...
    </span>
  </div>
);

const MainContent: React.FC = () => {
  const { destination } = useCareerPilot();

  const renderView = () => {
    switch (destination) {
      case 'discovery':
        return <DiscoveryView />;
      case 'profile':
        return <ProfileView />;
      case 'atlas':
        return <AtlasView />;
      case 'pathways':
        return <PathwaysView />;
      case 'compare':
        return <CompareView />;
      case 'roadmap':
        return <RoadmapView />;
      default:
        return <DiscoveryView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0D] text-[#F0F4F8] flex flex-col justify-between selection:bg-[#00F0B4]/20 selection:text-[#00F0B4]">
      <div>
        <Header />
        <main className="pb-16" id="main-content">
          <Suspense fallback={<ViewLoadingFallback />}>{renderView()}</Suspense>
        </main>
      </div>

      {/* Product Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090B0E] py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0B4]" />
              <span>Career Pilot</span>
            </span>
            <span className="text-white/10">|</span>
            <span className="text-[11px] text-slate-500">
              Private, explainable career discovery & planning · 100% private in your browser
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Client-side storage</span>
            <span className="text-[#00F0B4]">Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <CareerPilotProvider>
        <MainContent />
      </CareerPilotProvider>
    </ErrorBoundary>
  );
}

export default App;
