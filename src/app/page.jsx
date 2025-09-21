import { useState } from "react";
import { Menu, Bell, Navigation } from "lucide-react";
import Sidebar from "../components/Sidebar";
import useUser from "@/utils/useUser";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: user, loading } = useUser();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const quickFilters = [
    { name: "Food", color: "bg-orange-500", textColor: "text-orange-600", bgLight: "bg-orange-50", icon: "🍽️" },
    { name: "Culture", color: "bg-purple-500", textColor: "text-purple-600", bgLight: "bg-purple-50", icon: "🎭" },
    { name: "Heritage", color: "bg-indigo-500", textColor: "text-indigo-600", bgLight: "bg-indigo-50", icon: "🏛️" },
    { name: "Nature", color: "bg-green-500", textColor: "text-green-600", bgLight: "bg-green-50", icon: "🌿" },
    { name: "Events", color: "bg-pink-500", textColor: "text-pink-600", bgLight: "bg-pink-50", icon: "🎪" },
  ];

  const recommendedDestinations = [
    {
      id: 1,
      name: "Red Fort",
      location: "New Delhi",
      image: "https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Heritage",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Gateway of India",
      location: "Mumbai",
      image: "https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Heritage",
      rating: 4.7,
    },
    {
      id: 3,
      name: "Hawa Mahal",
      location: "Jaipur",
      image: "https://images.pexels.com/photos/3532550/pexels-photo-3532550.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Heritage",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Meenakshi Temple",
      location: "Madurai",
      image: "https://images.pexels.com/photos/2743666/pexels-photo-2743666.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Culture",
      rating: 4.8,
    },
  ];

  const handleFilterClick = (filterName) => {
    window.location.href = `/search?category=${filterName.toLowerCase()}`;
  };

  const handleDestinationClick = (destination) => {
    window.location.href = `/search?place=${destination.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[280px] transition-all duration-300">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-700 px-3 py-2.5 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <Menu size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-[18px] font-poppins font-semibold text-black dark:text-white">
            Xplora360
          </h1>
          <div className="w-8" />
        </div>

        {/* Header */}
        <header className="bg-white dark:bg-[#1E1E1E] w-full h-[70px] flex items-center px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">
            {/* Left group - User Info */}
            <div className="flex items-center">
              {!loading && user ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-black dark:text-white text-[16px] font-poppins font-semibold leading-tight">
                      Welcome, {user.name || user.email.split('@')[0]}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-[12px] font-poppins leading-tight">
                      Ready to explore? 🌟
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mr-3"></div>
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right group - Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#262626] flex items-center justify-center hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                <Bell size={18} className="text-gray-700 dark:text-gray-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>

              {!loading && !user && (
                <a
                  href="/account/signin"
                  className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="bg-white dark:bg-[#1E1E1E] px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-poppins font-bold text-gray-800 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                Local Voyage
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 font-poppins mb-8">
              Discover, Experience, Connect Locally
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Explore India's hidden gems, discover local culture, find safe routes, and get real-time travel updates - all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/search'}
                className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 hover:scale-[1.02] text-lg"
              >
                Start Exploring
              </button>
              <button
                onClick={() => window.location.href = '/assistant'}
                className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 hover:scale-[1.02] text-lg"
              >
                Plan Your Trip
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filters Section */}
        <div className="bg-white dark:bg-[#1E1E1E] px-6 lg:px-8 py-8 border-t border-gray-100 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-poppins font-bold text-gray-800 dark:text-white mb-8 text-center">
              What interests you?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {quickFilters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => handleFilterClick(filter.name)}
                  className={`${filter.bgLight} dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded-2xl p-6 text-center transition-all duration-200 hover:scale-[1.05] active:scale-[0.98] group`}
                >
                  <div className="text-3xl mb-3">{filter.icon}</div>
                  <h3 className={`${filter.textColor} dark:text-white font-semibold text-lg`}>
                    {filter.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Destinations */}
        <div className="bg-white dark:bg-[#1E1E1E] px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-poppins font-bold text-gray-800 dark:text-white">
                Recommended for You
              </h2>
              <a
                href="/search"
                className="text-blue-500 hover:text-blue-600 font-medium text-lg"
              >
                View All
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedDestinations.map((destination) => (
                <div
                  key={destination.id}
                  onClick={() => handleDestinationClick(destination)}
                  className="bg-white dark:bg-[#262626] rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="relative h-48">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-sm font-semibold text-gray-800 dark:text-white">
                      ⭐ {destination.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-1">
                      {destination.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      📍 {destination.location}
                    </p>
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                      {destination.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}