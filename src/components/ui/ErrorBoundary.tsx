import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-8">
          <div className="bg-card border border-red-500/30 rounded-2xl p-6 max-w-lg w-full">
            <h2 className="text-red-400 font-semibold mb-2">Chyba aplikace</h2>
            <pre className="text-xs text-muted whitespace-pre-wrap break-all">
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
