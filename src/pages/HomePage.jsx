import React, { useState, useEffect } from 'react';
import {auth,getAuth} from '../firebase/firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

import { motion } from "framer-motion";

// Home page component
const HomePage = ({ navigateToAuth, user, handleSignOut }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => {
      
      clearTimeout(timer)
      let u=localStorage.getItem("username")
      if(u){

      if (u.includes("@opt"))
        setTimeout(() => window.location.replace("/order"), 2000);
        
}
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background effect */}
      <div 
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-[-2]"
        style={{
          backgroundImage: "url('https://img.freepik.com/premium-photo/3d-pharmacy-drug-health-pharmaceutical-purple-background-cartoon-minimal-first-aid-health-care-medical-symbol-emergency-help-3d-aid-medicine-icon-vector-render-illustration_839035-353275.jpg')",
          filter: "blur(10px)",
          transform: "scale(1.1)"
        }}
      />

      {/* Navbar */}
      

      {/* Splash screen */}
      {showSplash && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 2.5, delay: 2.5 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-white"
        >
          <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_20%_30%,rgba(183,131,255,0.4),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(110,70,255,0.4),transparent_50%)] blur-[100px] animate-pulse infinite alternate z-[-1]" />
          <motion.h1
            initial={{ x: "-100%", scale: 0.9, opacity: 0 }}
            animate={{ x: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-[20vw] font-black uppercase bg-clip-text text-transparent bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://img.freepik.com/premium-photo/3d-pharmacy-drug-health-pharmaceutical-purple-background-cartoon-minimal-first-aid-health-care-medical-symbol-emergency-help-3d-aid-medicine-icon-vector-render-illustration_839035-353275.jpg')",
            }}
          >
            MEDILIFE
          </motion.h1>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative w-[80vw] h-screen mx-auto backdrop-blur-md rounded-xl shadow-xl flex flex-col items-center justify-center overflow-hidden"
      >
        <img
          src="https://img.freepik.com/premium-photo/3d-pharmacy-drug-health-pharmaceutical-purple-background-cartoon-minimal-first-aid-health-care-medical-symbol-emergency-help-3d-aid-medicine-icon-vector-render-illustration_839035-353275.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-right filter brightness-105 contrast-110 animate-pulse z-[-1]"
        />
        {
           
      <div className="fixed top-0 w-full px-4 py-3 md:px-8 md:py-4 flex justify-between items-center z-50 bg-gradient-to-r text-white rounded-b-2xl">
        <div className="text-xl font-extrabold tracking-wide animate-[fadeIn_1s_ease-out_forwards] opacity-0 animation-delay-100">
          {/* You can add logo/text here */}
        </div>
        <div className="flex items-center space-x-4 md:space-x-6 text-sm md:text-base font-semibold">
          {user ? (
            <>
              <span className="opacity-0 animate-[fadeIn_1s_ease-out_forwards] animation-delay-150">
                Welcome, {user.email.split('@')[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-1 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-lg opacity-0 animate-[fadeIn_1s_ease-out_forwards] animation-delay-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={navigateToAuth}
                className="px-4 py-1 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow-lg opacity-0 animate-[fadeIn_1s_ease-out_forwards] animation-delay-150"
              >
                Sign In
              </button>
              <button
                onClick={navigateToAuth}
                className="px-4 py-1 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-lg opacity-0 animate-[fadeIn_1s_ease-out_forwards] animation-delay-200"
              >
                Login
              </button>
            </>
          )}
          <a
            href="#"
            className="px-4 py-1 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 shadow-md opacity-0 animate-[fadeIn_1s_ease-out_forwards] animation-delay-300"
          >
            About
          </a>
        </div>
      </div>  
      }
        

        <div className="absolute top-12 left-14 z-10">
          <h2 className="text-6xl font-extrabold text-white tracking-wide">MEDILIFE</h2>
        </div>
      {
        !user ? 
        <a
           
          onClick={navigateToAuth}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[#7245a0] hover:bg-[#250545] text-white px-8 py-3 rounded-full text-lg font-bold shadow-md transition-transform duration-300 hover:scale-105 z-10 cursor-pointer"
        >
          Get Started
        </a>
        :
        <a
          href="/dashboard"
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[#7245a0] hover:bg-[#250545] text-white px-8 py-3 rounded-full text-lg font-bold shadow-md transition-transform duration-300 hover:scale-105 z-10"
        >
          Go to Dasboard
        </a>
      }
        
      </motion.div>
    </div>
  );
};

 


// Auth page component with both sign-in and login
const AuthPage = ({ navigateToHome }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Account created successfully! Redirecting...');
      localStorage.setItem("username",email)
      if (!email.includes("@opt"))
        setTimeout(() => navigateToHome(), 2000);
      else
        setTimeout(() => window.location.replace("/order"), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Login successful! Redirecting...');
      localStorage.setItem("username",email)
      if (!email.includes("@opt"))
        setTimeout(() => navigateToHome(), 2000);
      else
        setTimeout(() => window.location.replace("/order"), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background effect */}
      <div 
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-[-2]"
        style={{
          backgroundImage: "url('https://img.freepik.com/premium-photo/3d-pharmacy-drug-health-pharmaceutical-purple-background-cartoon-minimal-first-aid-health-care-medical-symbol-emergency-help-3d-aid-medicine-icon-vector-render-illustration_839035-353275.jpg')",
          filter: "blur(10px)",
          transform: "scale(1.1)"
        }}
      />
      
      {/* Back button */}
      <button 
        onClick={navigateToHome}
        className="absolute top-4 md:top-6 left-4 md:left-6 text-white text-base md:text-lg font-bold z-10 hover:underline"
      >
        ← Back to Home
      </button>
      
      {/* Auth container */}
      <div className="min-h-screen flex flex-col items-center justify-center py-8 md:py-16 px-4 md:px-5">
        {/* Tabs */}
        <div className="bg-white/20 backdrop-blur-md rounded-t-2xl overflow-hidden w-[90%] sm:w-80 flex mb-0">
          <button 
            className={`flex-1 p-3 md:p-4 text-center font-bold transition-all ${activeTab === 'signin' ? 'bg-[#7245a0] text-white' : 'bg-white/20 text-gray-700'}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button 
            className={`flex-1 p-3 md:p-4 text-center font-bold transition-all ${activeTab === 'login' ? 'bg-[#7245a0] text-white' : 'bg-white/20 text-gray-700'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
        </div>
        
        {/* Form container */}
        <div className="bg-white/20 backdrop-blur-md p-6 md:p-10 rounded-b-2xl shadow-xl w-[90%] sm:w-80 z-10">
          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          {/* Success message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm">
              {success}
            </div>
          )}
          
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignUp}>
              <h2 className="text-[rgb(105,33,144)] text-center mb-4 md:mb-6">Sign In</h2>
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full mb-4 md:mb-5 p-2.5 md:p-3 border-none rounded-lg text-sm md:text-base outline-none" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full mb-4 md:mb-5 p-2.5 md:p-3 border-none rounded-lg text-sm md:text-base outline-none" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                type="password" 
                placeholder="Create Password" 
                className="w-full mb-4 md:mb-5 p-2.5 md:p-3 border-none rounded-lg text-sm md:text-base outline-none" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full p-2.5 md:p-3 bg-[#7245a0] border-none rounded-lg text-white text-sm md:text-base font-bold cursor-pointer transition-all duration-300 hover:bg-[#250545] hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <h2 className="text-[rgb(102,25,156)] text-center mb-4 md:mb-6">Login</h2>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full mb-4 md:mb-5 p-2.5 md:p-3 border-none rounded-lg text-sm md:text-base outline-none" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full mb-4 md:mb-5 p-2.5 md:p-3 border-none rounded-lg text-sm md:text-base outline-none" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full p-2.5 md:p-3 bg-[#7245a0] border-none rounded-lg text-white text-sm md:text-base font-bold cursor-pointer transition-all duration-300 hover:bg-[#250545] hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App component
const MediLife = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const navigateToAuth = () => setCurrentPage('auth');
  const navigateToHome = () => setCurrentPage('home');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'home' ? (
        <HomePage 
          navigateToAuth={navigateToAuth} 
          user={user} 
          handleSignOut={handleSignOut} 
        />
      ) : (
        <AuthPage navigateToHome={navigateToHome} />
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          scroll-behavior: smooth;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes floatInLeft {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px) translateX(-50%); }
          100% { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        
        @keyframes pulseZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-1200 {
          animation-delay: 1.2s;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 640px) {
          .center-box {
            width: 95vw !important;
          }
          
          .left-section h2 {
            font-size: 1.75rem !important;
          }
          
          .get-started-btn {
            font-size: 1rem !important;
            padding: 10px 20px !important;
          }
          
          .signin-box, .login-box {
            width: 90% !important;
            padding: 25px !important;
          }
          
          input {
            padding: 10px !important;
            margin-bottom: 15px !important;
          }
          
          button {
            padding: 10px !important;
          }
        }
      `}</style>
    </>
  );
};

export default MediLife;