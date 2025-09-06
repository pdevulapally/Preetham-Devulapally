import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { personal } from "./data/cv";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { Hero } from "./sections/Hero";
import { Skills } from "./sections/Skills";
import { Projects } from "./sections/Projects";
import { Experience } from "./sections/Experience";
import { Education } from "./sections/Education";
import { Achievements } from "./sections/Achievements";
import { Contact } from "./sections/Contact";
import { About } from "./sections/About";
import { AdminPage } from "./components/AdminPage";
import { trackPageView, trackScrollDepth, trackTimeOnPage, trackBounce, trackReturnVisitor } from "./lib/analytics";

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [startTime] = useState(Date.now());
  const [hasScrolled, setHasScrolled] = useState(false);
  const [maxScrollDepth, setMaxScrollDepth] = useState(0);

  useEffect(() => setMounted(true), []);

  // Track page view when component mounts
  useEffect(() => {
    if (mounted) {
      trackPageView('portfolio');
      
      // Check if user is a return visitor
      const isReturnVisitor = localStorage.getItem('portfolio_visited');
      if (isReturnVisitor) {
        trackReturnVisitor();
      } else {
        localStorage.setItem('portfolio_visited', 'true');
      }
    }
  }, [mounted]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
      }
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((scrollTop / scrollHeight) * 100);
      
      if (scrollDepth > maxScrollDepth) {
        setMaxScrollDepth(scrollDepth);
        
        // Track scroll depth milestones
        if (scrollDepth >= 25 && scrollDepth < 50) {
          trackScrollDepth(25);
        } else if (scrollDepth >= 50 && scrollDepth < 75) {
          trackScrollDepth(50);
        } else if (scrollDepth >= 75 && scrollDepth < 90) {
          trackScrollDepth(75);
        } else if (scrollDepth >= 90) {
          trackScrollDepth(90);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled, maxScrollDepth]);

  // Track time on page and bounce rate
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      trackTimeOnPage(timeOnPage);
      
      // Track bounce if user leaves quickly (less than 30 seconds) and hasn't scrolled much
      if (timeOnPage < 30 && maxScrollDepth < 25) {
        trackBounce();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [startTime, maxScrollDepth]);

  // Check if we're on the admin route
  const isAdminRoute = window.location.pathname === '/admin';

  if (isAdminRoute) {
    return <AdminPage />;
  }

  return (
    <div>
      <div className="absolute inset-0 -z-10 bg-grid bg-grid" style={{ backgroundSize: 'grid' }} />
      <Navbar />
      <main className="container space-y-24 pt-24 pb-20">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
