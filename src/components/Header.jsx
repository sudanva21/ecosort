import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Home, Camera, BookOpen, Trophy, LogOut, User, Users, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/classify', icon: Camera, label: 'Classify' },
    { path: '/guide', icon: BookOpen, label: 'Guide' },
    { path: '/social', icon: Users, label: 'Community' },
    { path: '/gamification', icon: Trophy, label: 'Achievements' },
  ];

  const NavLink = ({ item, onClick }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Link
        to={item.path}
        className="relative"
        onClick={onClick}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            isActive
              ? 'bg-green-100 text-green-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium">
            {item.label}
          </span>
        </motion.div>
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"
          />
        )}
      </Link>
    );
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Leaf className="w-8 h-8 text-green-600" />
            </motion.div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              EcoSort
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hidden lg:inline font-medium">
                        {item.label}
                      </span>
                    </motion.div>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {user ? (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                <Link to="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition-all cursor-pointer"
                  >
                    <User className="w-5 h-5 text-green-600" />
                    <span className="hidden lg:inline text-sm font-medium text-gray-700">
                      {user.user_metadata?.username || user.email?.split('@')[0]}
                    </span>
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm font-medium">Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    item={item}
                    onClick={() => setMobileMenuOpen(false)}
                  />
                ))}
                
                {user ? (
                  <>
                    <div className="border-t border-gray-200 my-2 pt-2">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-lg text-green-700"
                        >
                          <User className="w-5 h-5" />
                          <span className="font-medium">
                            {user.user_metadata?.username || user.email?.split('@')[0]}
                          </span>
                        </motion.div>
                      </Link>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </motion.button>
                  </>
                ) : (
                  <div className="border-t border-gray-200 my-2 pt-2 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-4 py-2 text-green-600 font-medium rounded-lg bg-green-50"
                      >
                        Login
                      </motion.button>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg"
                      >
                        Sign Up
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
