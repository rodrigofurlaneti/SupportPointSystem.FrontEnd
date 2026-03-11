import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-6">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-4">Algo deu errado</h2>
              <p className="text-slate-400 mb-6">{this.state.error?.message}</p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-lime-400 text-slate-900 font-bold px-6 py-3 rounded-xl"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
