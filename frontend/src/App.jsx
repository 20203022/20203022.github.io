import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ParticleNetwork from './components/ParticleNetwork';
import CursorGlow from './components/CursorGlow';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import Navbar from './components/Navbar';
import PageShell from './components/PageShell';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Timeline from './pages/Timeline';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Footer from './components/Footer';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <ParticleNetwork />
              <CursorGlow />
              <ScrollProgress />
              <Navbar />
              <main style={{ minHeight: '100vh' }}>
                <Routes>
                  <Route path="/" element={<PageShell><Home /></PageShell>} />
                  <Route path="/about" element={<PageShell><About /></PageShell>} />
                  <Route path="/projects" element={<PageShell><Projects /></PageShell>} />
                  <Route path="/projects/:id" element={<PageShell><ProjectDetail /></PageShell>} />
                  <Route path="/timeline" element={<PageShell><Timeline /></PageShell>} />
                  <Route path="/blog" element={<PageShell><Blog /></PageShell>} />
                  <Route path="/blog/:id" element={<PageShell><BlogDetail /></PageShell>} />
                  <Route path="/contact" element={<PageShell><Contact /></PageShell>} />
                  <Route path="/login" element={<PageShell><Login /></PageShell>} />
                  <Route path="/admin" element={<PageShell><Admin /></PageShell>} />
                  <Route path="/profile" element={<PageShell><Profile /></PageShell>} />
                </Routes>
              </main>
              <Footer />
              <BackToTop />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
