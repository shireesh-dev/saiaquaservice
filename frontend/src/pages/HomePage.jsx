import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Features from "../components/Features";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const HomePage = () => {
  useEffect(() => {
    if (window.WOW) {
      new window.WOW().init();
    }
  }, []);

  return (
    <div className="App">
      <Navbar />
      <About />
      <Features />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
