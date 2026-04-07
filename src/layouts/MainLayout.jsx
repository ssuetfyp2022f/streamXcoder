import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#EFECE3]">
      <Navbar />
      <main className="flex-1">
      {/* <main className="grow container mx-auto px-4 py-8"> */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;