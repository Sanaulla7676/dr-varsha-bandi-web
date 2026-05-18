import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside React Tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 font-sans selection:bg-pink-500 selection:text-white">
          {/* Subtle background radial glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[120px]" />
          </div>

          <div className="w-full max-w-lg bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl premium-shadow relative z-10 text-center animate-slide-up">
            <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/20 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/5">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-neutral-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              An unexpected error occurred in the application rendering engine. We've logged the incident and are working to resolve it.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 text-left bg-black/40 border border-white/5 rounded-2xl p-4 max-h-[150px] overflow-y-auto scrollbar-thin">
                <p className="text-xs text-pink-400 font-bold mb-1">Error Trace:</p>
                <code className="text-[11px] text-neutral-300 font-mono block whitespace-pre-wrap leading-normal">
                  {this.state.error.stack || this.state.error.message}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-pink-600/10 active:scale-95"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
