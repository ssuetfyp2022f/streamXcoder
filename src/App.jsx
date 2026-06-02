// export default App;
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./App.css"
import Videos from "./pages/Videos";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courespage from "./pages/Coursespage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Editor from "./pages/Editor";
import Users from "./pages/Users";
import Playlists from "./pages/Playlists";
// import Loader from "./components/Loader";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarFooter = ['/login', '/signup'].includes(location.pathname);

  if (hideNavbarFooter) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EEEEEE' }}>
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

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
      {/* Show Loader */}
      {/* {loading && <Loader duration={3000} message="Code Along With Videos" />} */}

      {/* Main App Content */}
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/admin" element={
              <Layout>
                <Admin />
              </Layout>
            } />
            
            <Route path="/admin/videos" element={
              <Layout>
                <Videos />
              </Layout>
            } />

            <Route path="/admin/playlists" element={
              <Layout>
                <Playlists />
              </Layout>
            } />
            
            <Route path="/admin/users" element={
              <Layout>
                <Users />
              </Layout>
            } />

            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />

            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />

            <Route path="/editor/:videoId?" element={
              <Layout>
                <Editor />
              </Layout>
            } />
            {/* <Route path="/editor" element={
              <Layout>
                <Editor />
              </Layout>
            } /> */}

            <Route path="/courses" element={
              <Layout>
                <Courespage />
              </Layout>
            } />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
