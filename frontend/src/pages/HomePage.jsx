import React from "react";
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";

const HomePage = () => {
  return (
    <div className="flex flex-col overflow-auto h-full">
      <Header />
      <Hero />
    </div>
  );
};

export default HomePage;
