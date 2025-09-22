import { useState, useEffect } from "react";
import { Menu, MapPin, Clock, Star, Heart, Navigation, Share2, Camera } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import useUser from "@/utils/useUser";

export default function PlaceDetailPage({ params }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { data: user } = useUser();
  const placeId = params.id;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch place details
  const { data: place, isLoading } = useQuery({
    queryKey: ['place-detail', placeId],
    queryFn: async () => {
      const response = await fetch(`/api/places/${placeId}`);
      if (!response.ok) throw new Error('Failed to fetch place details');
      return response.json();
    },
  });

  // Fetch place reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['place-reviews', placeId],
    queryFn: async () => {
      const response = await fetch(`/api/places/${placeId}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
  });

  // Check if place is saved
  useEffect(() => {
    if (user && placeId) {
      const checkSaved = async () => {
        try {
          const response = await fetch(`/api/saved-places?place_id=${placeId}`);
          if (response.ok) {
            const data = await response.json();
            setIsSaved(data.isSaved);
          }
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      };
      checkSaved();
    }
  }, [user, placeId]);

  const handleSavePlace = async () => {
    if (!user) {
      alert('Please sign in to save places to your itinerary');
      return;
    }

    try {
      const response = await fetch('/api/saved-places', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place_id: parseInt(placeId) }),
      });
      
      if (!response.ok) throw new Error('Failed to save place');
      
      setIsSaved(!isSaved);
      alert(isSaved ? 'Removed from your itinerary' : 'Added to your itinerary!');
    } catch (error) {
      console.error('Error saving place:', error);
      alert('Error saving place. Please try again.');
    }
  };

  const getDirections = () => {
    if (place?.latitude && place?.longitude) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const sharePlace = () => {
    if (navigator.share) {
      navigator.share({
        title: place?.name,
        text: `Check out ${place?.name} on Local Voyage`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading place details...</p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Place Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The place you're looking for doesn't exist.</p>
          <button
            onClick={() => window.location.href = '/search'}
            className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02]"
          >
            Browse Places
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-[18px] font-poppins font-semibold text-black dark:text-white truncate">
            {place.name}
          </h1>
          <div className="w-8" />
        </div>

        {/* Hero Image */}
        <div className="relative h-64 lg:h-80">
          <img
            src={place.image_url || 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={sharePlace}
              className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <Share2 size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={handleSavePlace}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isSaved 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              <Heart size={18} className={isSaved ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Place Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {place.category}
              </span>
              {place.is_safe_route && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Safe Route ✓
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">{place.name}</h1>
            <div className="flex items-center text-white/90 text-sm">
              <MapPin size={16} className="mr-1" />
              <span>{place.location_name}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Rating and Actions */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                {reviews.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={getDirections}
                className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center space-x-2"
              >
                <Navigation size={18} />
                <span>Get Directions</span>
              </button>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">About This Place</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {place.description}
              </p>
              
              {place.history && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">History</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {place.history}
                  </p>
                </>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Reviews ({reviews.length})
                </h2>
                <button
                  onClick={() => window.location.href = '/community'}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Write a Review
                </button>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.user_name ? review.user_name.charAt(0).toUpperCase() : '?'}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800 dark:text-white">
                              {review.user_name || 'Anonymous User'}
                            </h4>
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {review.review_text}
                          </p>
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock size={14} />
                            <span>{new Date(review.created_at).toLocaleDateString()}</span>
                            {review.sentiment_category && (
                              <>
                                <span>•</span>
                                <span className="capitalize">{review.sentiment_category}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {reviews.length > 3 && (
                    <button
                      onClick={() => window.location.href = '/community'}
                      className="w-full text-blue-500 hover:text-blue-600 font-medium py-2"
                    >
                      View All Reviews
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No reviews yet. Be the first to share your experience!
                  </p>
                  <button
                    onClick={() => window.location.href = '/community'}
                    className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                  >
                    Write First Review
                  </button>
                </div>
              )}
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