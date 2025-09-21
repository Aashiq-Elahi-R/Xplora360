import { useState, useEffect } from "react";
import { Menu, Clock, Train, Plane, Cloud, Calendar, AlertTriangle, Wifi } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { useQuery } from "@tanstack/react-query";

export default function UpdatesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [weatherData, setWeatherData] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch travel updates from database
  const { data: updates = [], isLoading, refetch } = useQuery({
    queryKey: ['travel-updates', selectedTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedTab !== 'all') params.append('type', selectedTab);
      
      const response = await fetch(`/api/travel-updates?${params}`);
      if (!response.ok) throw new Error('Failed to fetch updates');
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch weather data for major cities
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];
        const weatherPromises = cities.map(async (city) => {
          const response = await fetch(`/integrations/weather-by-city/weather/${city}`);
          return response.json();
        });
        
        const weatherResults = await Promise.all(weatherPromises);
        setWeatherData(weatherResults);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'all', name: 'All Updates', icon: Clock },
    { id: 'train', name: 'Trains', icon: Train },
    { id: 'flight', name: 'Flights', icon: Plane },
    { id: 'weather', name: 'Weather', icon: Cloud },
    { id: 'event', name: 'Events', icon: Calendar },
  ];

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'train':
        return Train;
      case 'flight':
        return Plane;
      case 'weather':
        return Cloud;
      case 'event':
        return Calendar;
      default:
        return Clock;
    }
  };

  const getUpdateColor = (type, isUrgent) => {
    if (isUrgent) return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
    
    switch (type) {
      case 'train':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'flight':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
      case 'weather':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'event':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const updateTime = new Date(dateString);
    const diffInMinutes = Math.floor((now - updateTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
            Live Updates
          </h1>
          <div className="w-8" />
        </div>

        {/* Header */}
        <header className="bg-white dark:bg-[#1E1E1E] px-6 lg:px-8 py-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <Clock size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-poppins font-bold text-gray-800 dark:text-white">
                  Live Travel Updates
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time information about trains, flights, weather, and events
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Wifi size={16} className="text-green-500" />
              <span>Live</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white'
                      : 'bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Weather Strip (only show when weather tab is selected or all) */}
        {(selectedTab === 'all' || selectedTab === 'weather') && weatherData && (
          <div className="bg-white dark:bg-[#1E1E1E] px-6 lg:px-8 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Current Weather in Major Cities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {weatherData.map((weather, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 text-center">
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
                    {weather.location?.name}
                  </h4>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {weather.current?.temp_c}°C
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {weather.current?.condition?.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Updates List */}
        <div className="px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-[#262626] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : updates.length > 0 ? (
              <div className="space-y-4">
                {updates.map((update) => {
                  const IconComponent = getUpdateIcon(update.update_type);
                  const colorClass = getUpdateColor(update.update_type, update.is_urgent);
                  
                  return (
                    <div
                      key={update.id}
                      className={`bg-white dark:bg-[#262626] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 ${
                        update.is_urgent ? 'border-red-500' : 'border-blue-500'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${colorClass}`}>
                          <IconComponent size={24} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                              {update.title}
                              {update.is_urgent && (
                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                                  <AlertTriangle size={12} className="mr-1" />
                                  Urgent
                                </span>
                              )}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(update.update_date)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            {update.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              {update.location_name && (
                                <span className="flex items-center">
                                  📍 {update.location_name}
                                </span>
                              )}
                              <span className="capitalize">
                                {update.update_type}
                              </span>
                            </div>
                            
                            {update.source_url && (
                              <a
                                href={update.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                              >
                                View Source
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Clock size={32} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                  No updates available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  All systems are running smoothly. Check back later for new updates.
                </p>
                <button
                  onClick={() => refetch()}
                  className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                >
                  Refresh Updates
                </button>
              </div>
            )}
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