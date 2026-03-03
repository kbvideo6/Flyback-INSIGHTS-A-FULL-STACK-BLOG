import { BrowserRouter, Routes, Route } from 'react-router-dom'

// ── Public layout & pages ────────────────────────────────────────────────
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Topics from './pages/Topics'
import DeepDives from './pages/DeepDives'
import Analysis from './pages/Analysis'
import ArticlePage from './pages/ArticlePage'
import About from './pages/About'
import Contact from './pages/Contact'

// ── Admin layout & pages ─────────────────────────────────────────────────
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ArticleEditor from './pages/admin/ArticleEditor'

// ── Auth guard ───────────────────────────────────────────────────────────
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public site ── */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="topics" element={<Topics />} />
          <Route path="DeepDives" element={<DeepDives />} />
          <Route path="Analysis" element={<Analysis />} />
          <Route path="article/:slug" element={<ArticlePage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* ── Admin: public login page ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Admin: protected pages (require auth) ── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="articles" element={<AdminDashboard />} />
            <Route path="articles/new" element={<ArticleEditor />} />
            <Route path="articles/:id/edit" element={<ArticleEditor />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
