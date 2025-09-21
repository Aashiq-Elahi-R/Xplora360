import { useState } from "react";
import {
  Menu,
  Star,
  Plus,
  Filter,
  ThumbsUp,
  MessageCircle,
  MapPin,
  Calendar,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { useQuery } from "@tanstack/react-query";

export default function CommunityPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    place_name: "",
    rating: 0,
    review_text: "",
    sentiment_category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch reviews from database
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["community-reviews", selectedFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedFilter !== "all") params.append("sentiment", selectedFilter);

      const response = await fetch(`/api/reviews?${params}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
  });

  const filters = [
    { id: "all", name: "All Reviews", color: "bg-gray-500" },
    { id: "safety", name: "Safety", color: "bg-green-500" },
    { id: "fun", name: "Fun", color: "bg-blue-500" },
    { id: "cleanliness", name: "Cleanliness", color: "bg-purple-500" },
    { id: "food", name: "Food", color: "bg-orange-500" },
  ];

  const getSentimentColor = (sentimentCategory, sentimentScore) => {
    if (sentimentScore > 0.3)
      return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
    if (sentimentScore < -0.3)
      return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
    return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }
      />
    ));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (
      !reviewForm.place_name.trim() ||
      !reviewForm.rating ||
      !reviewForm.review_text.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // First, find or create the place
      const searchResponse = await fetch(
        `/api/places?search=${encodeURIComponent(reviewForm.place_name)}&limit=1`,
      );
      const places = await searchResponse.json();

      let placeId;
      if (places.length > 0) {
        placeId = places[0].id;
      } else {
        // Create a new place entry
        const createResponse = await fetch("/api/places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: reviewForm.place_name,
            description: `User-submitted place: ${reviewForm.place_name}`,
            category: "general",
            location_name: reviewForm.place_name,
          }),
        });

        if (!createResponse.ok) {
          throw new Error("Failed to create place");
        }

        const newPlace = await createResponse.json();
        placeId = newPlace.id;
      }

      // Submit the review
      const reviewResponse = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          place_id: placeId,
          rating: reviewForm.rating,
          review_text: reviewForm.review_text,
          sentiment_category: reviewForm.sentiment_category,
        }),
      });

      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      // Reset form and close
      setReviewForm({
        place_name: "",
        rating: 0,
        review_text: "",
        sentiment_category: "general",
      });
      setShowAddReview(false);

      alert("Review submitted successfully!");

      // Refresh reviews
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating) => {
    setReviewForm((prev) => ({ ...prev, rating }));
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
            Community
          </h1>
          <div className="w-8" />
        </div>

        {/* Header */}
        <header className="bg-white dark:bg-[#1E1E1E] px-6 lg:px-8 py-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-poppins font-bold text-gray-800 dark:text-white">
                  Community Reviews
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover what fellow travelers are saying about local
                  experiences
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddReview(!showAddReview)}
              className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Review</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white"
                    : "bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${filter.color}`}></div>
                <span>{filter.name}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Add Review Form */}
        {showAddReview && (
          <div className="bg-white dark:bg-[#1E1E1E] px-6 lg:px-8 py-6 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-[#262626] rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Share Your Experience
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Place
                  </label>
                  <input
                    type="text"
                    value={reviewForm.place_name}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        place_name: e.target.value,
                      }))
                    }
                    placeholder="Which place did you visit?"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className={`transition-colors ${
                          star <= reviewForm.rating
                            ? "text-yellow-400"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        <Star
                          size={24}
                          className={
                            star <= reviewForm.rating ? "fill-current" : ""
                          }
                        />
                      </button>
                    ))}
                  </div>
                  {reviewForm.rating > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {reviewForm.rating} star
                      {reviewForm.rating !== 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={reviewForm.sentiment_category}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        sentiment_category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="safety">Safety</option>
                    <option value="fun">Fun</option>
                    <option value="cleanliness">Cleanliness</option>
                    <option value="food">Food</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    rows="4"
                    value={reviewForm.review_text}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        review_text: e.target.value,
                      }))
                    }
                    placeholder="Tell us about your experience..."
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !reviewForm.place_name.trim() ||
                      !reviewForm.rating ||
                      !reviewForm.review_text.trim()
                    }
                    className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    disabled={isSubmitting}
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 font-medium py-3 px-6 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#262626] rounded-2xl p-6 shadow-sm"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mb-4"></div>
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white dark:bg-[#262626] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start space-x-4">
                      {/* User Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.user_name
                          ? review.user_name.charAt(0).toUpperCase()
                          : "?"}
                      </div>

                      <div className="flex-1">
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              {review.user_name || "Anonymous User"}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                              <MapPin size={14} />
                              <span>{review.place_name}</span>
                              <span>•</span>
                              <Calendar size={14} />
                              <span>{formatDate(review.created_at)}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                            </div>
                            {review.sentiment_category && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment_category, review.sentiment_score)}`}
                              >
                                {review.sentiment_category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Review Content */}
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                          {review.review_text}
                        </p>

                        {/* Review Actions */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                            <ThumbsUp size={16} />
                            <span>Helpful</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                            <MessageCircle size={16} />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <MessageCircle size={32} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Be the first to share your travel experience with the
                  community!
                </p>
                <button
                  onClick={() => setShowAddReview(true)}
                  className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                >
                  Write a Review
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
