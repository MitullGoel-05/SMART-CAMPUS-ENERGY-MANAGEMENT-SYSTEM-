import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiLogOut,
  FiUser,
  FiMenu
} from 'react-icons/fi';
import { useEnergy } from '../../context/EnergyContext';
import { userProfile } from '../../data/mockData';


const Navbar = () => {
  const location = useLocation();
  const { state, actions } = useEnergy();
  const { alertPanelOpen } = state;


  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome }
  ];


  const isActive = (path) => location.pathname === path;


  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">
                {/* Energy Dashboard */}
              </span>
            </div>


            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${isActive(item.href)
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                      }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>


          {/* Right side - Alerts, Settings, Profile */}
          <div className="flex items-center space-x-4">
            {/* Alert Toggle Button */}
            <button
              onClick={actions.toggleAlertPanel}
              className={`relative p-2 rounded-lg transition-colors duration-200 ${alertPanelOpen
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              aria-label="Toggle alerts panel"
              aria-expanded={alertPanelOpen}
            >
              <FiBell className="w-5 h-5" />
              {!alertPanelOpen && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" aria-label="New alerts available"></span>
              )}
            </button>


            {/* Settings */}
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Settings"
            >
              <FiSettings className="w-5 h-5" />
            </button>


            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                  <p className="text-xs text-gray-500">{userProfile.role}</p>
                </div>
              </button>


              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                    <p className="text-xs text-gray-500">{userProfile.role}</p>
                    <p className="text-xs text-gray-400">{userProfile.department}</p>
                  </div>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <FiUser className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <FiSettings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                    <FiLogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>


            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;







