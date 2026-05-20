import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Loader from './components/Loader'

import Hero from './pages/Hero'
import Awards from './pages/Award'
import Project from './pages/Project'
import About from './pages/About'
import Academic from './pages/Academic'
import Footer from './components/Footer'
import News from './pages/News'
import Contact from './pages/Contact'

const Home = () => {
  const [loaderDone, setLoaderDone] = useState(false)

  return (
    <>
    <Loader onComplete={() => setLoaderDone(true)} />
    <Hero videoSrc="/introduction.mp4" canPlay={loaderDone} />
      <Awards />
      <Project />
      <Footer />
    </>
  )
}

const AboutPage = () => (
  <>
    <About />
    <Academic />
  </>
)

const App = () => (
  <>
    <ScrollToTop />
    <Navbar />
    <main>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/news"    element={<News />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </main>
  </>
)

export default App