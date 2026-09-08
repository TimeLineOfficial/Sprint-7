import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in Sprint 7 wizard:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-rose-950 border border-rose-800 rounded-full flex items-center justify-center mx-auto text-rose-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold">Application Error Encountered</h2>
            <p className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl overflow-x-auto text-left">
              {this.state.error?.toString() || 'Unknown runtime error'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center space-x-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
