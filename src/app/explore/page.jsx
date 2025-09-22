import { useState, useEffect } from "react";
import { Menu, MapPin, Navigation, Route, Eye, Filter } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { useQuery } from "@tanstack/react-query";

export default function ExplorePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi
  const [safeRoutesOnly, setSafeRoutesOnly] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch places for the map
  const { data: places = [] } = useQuery({
    queryKey: ['map-places', safeRoutesOnly],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (safeRoutesOnly) params.append('safe_routes_only', 'true');
      
      const response = await fetch(`/api/places/map?${params}`);
      if (!response.ok) throw new Error('Failed to fetch places');
      return response.json();
    },
  });

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Keep default location (Delhi)
        }
      );
    }
  }, []);

  const enableARNavigation = () => {
    if ('DeviceOrientationEvent' in window) {
      alert('AR Navigation would be activated here. This feature requires device sensors and camera access.');
    } else {
      alert('AR Navigation is not supported on this device.');
    }
  };

  const showDirections = (place) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const placeLat = place.latitude;
          const placeLng = place.longitude;
          
          // Open Google Maps with directions
          const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${placeLat},${placeLng}`;
          window.open(googleMapsUrl, '_blank');
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to just opening the place location
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
          window.open(googleMapsUrl, '_blank');
        }
      );
    }
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
      <div className="flex-1 lg:ml-[280px] transition-all duration-300 flex">
        {/* Map Section */}
        <div className="flex-1 relative">
          {/* Mobile Header Bar */}
          <div className="lg:hidden bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-700 px-3 py-2.5 flex items-center justify-between absolute top-0 left-0 right-0 z-30">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Menu size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-[18px] font-poppins font-semibold text-black dark:text-white">
              Explore Map
            </h1>
            <div className="w-8" />
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 relative">
            {/* Map would be rendered here with Google Maps or similar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg max-w-md mx-4">
                <MapPin size={48} className="mx-auto mb-4 text-blue-500" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Interactive Map View
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This would show an interactive map with tourist places, safe routes, and real-time navigation. 
                  Google Maps integration would be implemented here.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  Map centered at: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
              <button
                onClick={enableARNavigation}
                className="w-12 h-12 bg-white dark:bg-[#262626] rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="AR Navigation"
              >
                <Eye size={20} className="text-blue-500" />
              </button>
              
              <button
                onClick={() => setSafeRoutesOnly(!safeRoutesOnly)}
                className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-colors ${
                  safeRoutesOnly 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                title="Safe Routes Only"
              >
                <Route size={20} />
              </button>
              
              <button
                className="w-12 h-12 bg-white dark:bg-[#262626] rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="My Location"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setMapCenter({
                          lat: position.coords.latitude,
                          lng: position.coords.longitude,
                        });
                      }
                    );
                  }
                }}
              >
                <Navigation size={20} className="text-blue-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Places Sidebar */}
        <div className="w-80 bg-white dark:bg-[#1E1E1E] border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Nearby Attractions
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Filter size={16} />
              <span>{safeRoutesOnly ? 'Safe routes only' : 'All places'}</span>
            </div>
          </div>

          {/* Places List */}
          <div className="flex-1 overflow-y-auto">
            {places.length > 0 ? (
              <div className="p-4 space-y-4">
                {places.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPlace?.id === place.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                        : 'bg-gray-50 dark:bg-[#262626] border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={place.image_url || 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={place.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
                          {place.name}
                        </h3>
                        
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <MapPin size={12} className="mr-1" />
                          <span className="truncate">{place.location_name}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                            {place.category}
                          </span>
                          
                          {place.is_safe_route && (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Safe Route ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <MapPin size={32} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  No places found in this area
                </p>
              </div>
            )}
          </div>

          {/* Selected Place Details */}
          {selectedPlace && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#262626]">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                {selectedPlace.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {selectedPlace.description}
              </p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => showDirections(selectedPlace)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] text-sm"
                >
                  Get Directions
                </button>
                
                <button
                  onClick={() => window.location.href = `/place/${selectedPlace.id}`}
                  className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
}