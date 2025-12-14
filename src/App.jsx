import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader"; // Import Loader
import MainLayout from "./layouts/MainLayout";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Use Loader Component */}
      {loading && <Loader duration={3000} message="Code Along With Videos" />}

      {/* Main Content */}
      <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: '#F5EFE7' }}>
         {loading && <Loader />}

 <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
    </Routes>
 </Router>
      </div>
    </>
  );
}

export default App;