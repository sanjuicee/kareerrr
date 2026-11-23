import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Download } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Career Pilot Error Boundary Caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('career_pilot_profile_v1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  private handleDownloadDiagnostics = () => {
    const diagnosticData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      errorMessage: this.state.error?.message,
      errorStack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(diagnosticData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `career-pilot-diagnostic-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#080A0D] text-[#F0F4F8] flex items-center justify-center p-6 font-mono">
          <div className="max-w-xl w-full border border-rose-500/40 bg-[#0E1217] p-8 shadow-[0_0_30px_rgba(244,63,94,0.15)] space-y-6">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-rose-500 block">SYSTEM ANOMALY ENCOUNTERED</span>
                <h1 className="text-xl font-serif text-white">Application State Interruption</h1>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Career Pilot encountered an unexpected state error. Your local storage remains preserved. You can export a diagnostic dump or reset the local session cache below.
            </p>

            {this.state.error && (
              <div className="p-3 bg-black/60 border border-white/10 text-[11px] text-rose-300 overflow-x-auto max-h-36">
                <code>{this.state.error.message}</code>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10 text-xs">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#00F0B4] hover:bg-[#00F0B4]/90 text-black font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleDownloadDiagnostics}
                className="px-4 py-2 border border-white/20 hover:border-white/40 text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Diagnostics</span>
              </button>

              <button
                onClick={this.handleReset}
                className="px-4 py-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                Purge Cache & Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
