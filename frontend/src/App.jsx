import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Layout
import Layout from './components/layout/Layout'

// Pages
import Home from './pages/Home'
import Topics from './pages/Topics'
import DeepDives from './pages/DeepDives'
import Analysis from './pages/Analysis'
import ArticlePage from './pages/ArticlePage'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="topics" element={<Topics />} />
          <Route path="DeepDives" element={<DeepDives />} />
          <Route path="Analysis" element={<Analysis />} />
          <Route path="article/:slug" element={<ArticlePage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
