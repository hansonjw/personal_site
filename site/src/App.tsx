import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Background from './pages/Background'
import Books from './pages/Books'
import Interests from './pages/Interests'
import LogoTest from './pages/LogoTest'
import Design from './pages/Design'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="md:ml-48 min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
<Route path="/background" element={<Background />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/books" element={<Books />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/logo" element={<LogoTest />} />
          <Route path="/design" element={<Design />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
