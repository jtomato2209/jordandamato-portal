import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, LogOut } from 'lucide-react';

const JordanDamatoPortal = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isSoundOn && currentPage !== 'login') {
      playTransitionSound();
    }
  }, [currentPage, isSoundOn]);

  const playTransitionSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {}
  };

  const handleToggle = (page) => {
    if (page === 'work' && !isLoggedIn) {
      setCurrentPage('login');
    } else {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentPage(page);
        setFadeOut(false);
      }, 300);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        setIsLoggedIn(true);
        setCredentials({ username: '', password: '' });
        setLoginError('');
        setFadeOut(true);
        setTimeout(() => {
          setCurrentPage('work');
          setFadeOut(false);
        }, 300);
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (error) {
      setLoginError('Connection error. Check your API endpoint.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setCredentials({ username: '', password: '' });
    setFadeOut(true);
    setTimeout(() => {
      setCurrentPage('home');
      setFadeOut(false);
    }, 300);
  };

  const bgColor = isDarkMode ? 'bg-black' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const accentColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const inputBg = isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300';

  return (
    <div className={`${bgColor} ${textColor} min-h-screen transition-colors duration-500 overflow-hidden`}>
      <div className="fixed top-6 right-6 z-50 flex gap-4">
        <button onClick={() => setIsSoundOn(!isSoundOn)} className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-200'} transition-all hover:scale-110`} title={isSoundOn ? 'Mute' : 'Unmute'}>
          {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-200'} transition-all hover:scale-110`} title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className={`transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        {currentPage === 'home' && (
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="mb-24 animate-fade-in">
              <img src={isDarkMode ? '/logo-dark.svg' : '/logo-light.svg'} alt="Jordan D'Amato" className="h-32 md:h-40 transition-opacity duration-300" />
            </div>

            <div className="mb-24 w-full max-w-3xl">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center">
                <button onClick={() => handleToggle('home')} className={`transition-all duration-500 transform ${currentPage === 'home' ? 'scale-100' : 'scale-75 md:scale-90 opacity-60 hover:opacity-80'}`}>
                  <img src="/button-home.svg" alt="Home" className="h-20 md:h-24 w-auto drop-shadow-lg hover:drop-shadow-xl transition-all" style={{minHeight: "80px"}} />
                </button>
                <div className="hidden md:block text-4xl font-light opacity-40">•</div>
                <button onClick={() => handleToggle('work')} className={`transition-all duration-500 transform ${currentPage === 'work' ? 'scale-100' : 'scale-75 md:scale-90 opacity-60 hover:opacity-80'}`}>
                  <img src="/button-work.svg" alt="Work" className="h-20 md:h-24 w-auto drop-shadow-lg hover:drop-shadow-xl transition-all" style={{minHeight: "80px"}} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl animate-fade-in-delay w-full">
              <a href="https://jellyfin.jordandamato.com" target="_blank" rel="noopener noreferrer" className={`group p-8 rounded-lg border transition-all duration-300 ${isDarkMode ? 'border-gray-800 hover:border-gray-600 hover:bg-gray-950' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Jellyfin</h3>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity"><Play size={18} /></span>
                </div>
                <p className={`text-sm ${accentColor}`}>Media Server</p>
              </a>

              <a href="https://plex.jordandamato.com" target="_blank" rel="noopener noreferrer" className={`group p-8 rounded-lg border transition-all duration-300 ${isDarkMode ? 'border-gray-800 hover:border-gray-600 hover:bg-gray-950' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Plex</h3>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity"><Play size={18} /></span>
                </div>
                <p className={`text-sm ${accentColor}`}>Entertainment</p>
              </a>
            </div>
          </div>
        )}

        {currentPage === 'login' && (
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">
              <div className="mb-12 flex justify-center">
                <img src={isDarkMode ? '/logo-dark.svg' : '/logo-light.svg'} alt="Jordan D'Amato" className="h-24" />
              </div>
              <h1 className="text-4xl font-light text-center mb-12">Work Portal</h1>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input type="text" placeholder="Username" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} className={`w-full px-4 py-3 rounded-lg border ${inputBg} focus:outline-none focus:border-gray-500 transition-colors`} />
                </div>
                <div>
                  <input type="password" placeholder="Password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} className={`w-full px-4 py-3 rounded-lg border ${inputBg} focus:outline-none focus:border-gray-500 transition-colors`} />
                </div>
                {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
                <button type="submit" className={`w-full py-3 rounded-lg font-semibold transition-all ${isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-200 hover:bg-gray-300'}`}>Sign In</button>
              </form>
              <button onClick={() => handleToggle('home')} className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all ${isDarkMode ? 'border border-gray-800 hover:border-gray-600' : 'border border-gray-300 hover:border-gray-400'}`}>Back to Home</button>
            </div>
          </div>
        )}

        {currentPage === 'work' && isLoggedIn && (
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-4xl animate-fade-in">
              <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl font-light">Work Portal</h1>
                <button onClick={handleLogout} className={`p-3 rounded-lg transition-all ${isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-200 hover:bg-gray-300'}`} title="Logout"><LogOut size={20} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`group p-8 rounded-lg border transition-all duration-300 ${isDarkMode ? 'border-gray-800 hover:border-gray-600 hover:bg-gray-950' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Tools</h3>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">📊</span>
                  </div>
                  <p className={`text-sm ${accentColor}`}>Coming soon</p>
                </div>
              </div>
              <p className={`text-center text-sm ${accentColor}`}>Welcome to your work portal. Links managed by OpenClaw.</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDelay { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        .animate-fade-in-delay { animation: fadeInDelay 1s ease-out 0.2s both; }
      `}</style>
    </div>
  );
};

export default JordanDamatoPortal;
