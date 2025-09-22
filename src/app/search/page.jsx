import { useState, useEffect } from "react";
import { Menu, Search, Heart, MapPin, Clock, Star } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { useQuery } from "@tanstack/react-query";

export default function SearchPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch places from database
  const { data: places = [], isLoading } = useQuery({
    queryKey: ['places', searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await fetch(`/api/places?${params}`);
      if (!response.ok) throw new Error('Failed to fetch places');
      return response.json();
    },
  });

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`/integrations/google-search/search?q=${encodeURIComponent(searchQuery + ' tourist places India')}`);
          const data = await response.json();
          if (data.status === 'success') {
            setSuggestions(data.items.slice(0, 5));
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      };
      
      const debounceTimer = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const categories = [
    { name: "All", value: "" },
    { name: "Heritage", value: "heritage" },
    { name: "Culture", value: "culture" },
    { name: "Food", value: "food" },
    { name: "Nature", value: "nature" },
    { name: "Events", value: "events" },
  ];

  const handleSaveToItinerary = async (placeId) => {
    try {
      const response = await fetch('/api/saved-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place_id: placeId }),
      });
      
      if (!response.ok) throw new Error('Failed to save place');
      // Could add a toast notification here
      alert('Place saved to your itinerary!');
    } catch (error) {
      console.error('Error saving place:', error);
      alert('Please sign in to save places to your itinerary');
    }
  };

  const handlePlaceClick = (place) => {
    window.location.href = `/place/${place.id}`;
  };

  // Get URL parameters on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category');
      const search = urlParams.get('search');
      
      if (category) setSelectedCategory(category);
      if (search) setSearchQuery(search);
    }
  }, []);

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
            Search Places
          </h1>
          <div className="w-8" />
        </div>

        {/* Header */}
        <header className="bg-white dark:bg-[#1E1E1E] px-6 lg:px-8 py-6 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-poppins font-bold text-gray-800 dark:text-white mb-6">
              Discover Amazing Places
            </h1>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for destinations, cities, or attractions..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-600 rounded-2xl mt-2 shadow-lg z-10">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion.title);
                        setSuggestions([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-2xl last:rounded-b-2xl transition-colors"
                    >
                      <div className="font-medium text-gray-800 dark:text-white">
                        {suggestion.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {suggestion.snippet}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white'
                      : 'bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Results Section */}
        <div className="px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-[#262626] rounded-2xl shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : places.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white dark:bg-[#262626] rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  >
                    <div 
                      className="relative h-48"
                      onClick={() => handlePlaceClick(place)}
                    >
                      <img
                        src={place.image_url || 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveToItinerary(place.id);
                        }}
                        className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Heart size={18} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>

                    <div className="p-6">
                      <h3 className="font-semibold text-xl text-gray-800 dark:text-white mb-2">
                        {place.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">{place.location_name}</span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {place.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full font-medium">
                          {place.category}
                        </span>
                        
                        {place.is_safe_route && (
                          <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-3 py-1 rounded-full font-medium">
                            Safe Route ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                  No places found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or category filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                  className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                >
                  Clear Filters
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
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
}