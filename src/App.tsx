import { Header } from './components/layout/Header'
import { LibraryGrid } from './components/library/LibraryGrid'
import { SearchModal } from './components/search/SearchModal'
import { DetailModal } from './components/detail/DetailModal'
import { ToastProvider } from './components/ui/Toast'

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <LibraryGrid />
        </main>
        <SearchModal />
        <DetailModal />
      </div>
    </ToastProvider>
  )
}

export default App
