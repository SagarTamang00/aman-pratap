import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Loader from './components/Loader'
import ClientAdSection from './components/ClientAdSection'

import Hero from './pages/Hero'
import Work from './pages/Work'
import Project from './pages/Project'
import ReelsStudio from './pages/ReelsStudio'
import About from './pages/About'
import Academic from './pages/Academic'
import Footer from './components/Footer'
import News from './pages/News'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'

const Home = () => {
  const [loaderDone, setLoaderDone] = useState(false)

  return (
    <>
      <Loader onComplete={() => setLoaderDone(true)} />
      <Hero videoSrc="/intro.mp4" canPlay={loaderDone} />
      <Work />

      <Project />
      <ReelsStudio />
      <ClientAdSection />
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
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </main>
  </>
)

export default App