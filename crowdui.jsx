import React, { useState } from 'react';
import { MapPin, Clock, Users, Calendar, Search, XCircle } from 'lucide-react';

const CrowdDetectionApp = () => {
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedTime, setSelectedTime] = useState('now');
  const [customTime, setCustomTime] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [crowdLevel, setCrowdLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Tourist places in India (total of 100)
  const touristPlaces = [
    'Taj Mahal, Agra',
    'Red Fort, Delhi',
    'Gateway of India, Mumbai',
    'Hawa Mahal, Jaipur',
    'Mysore Palace, Karnataka',
    'India Gate, Delhi',
    'Charminar, Hyderabad',
    'Marine Drive, Mumbai',
    'Lotus Temple, Delhi',
    'Qutub Minar, Delhi',
    'Amer Fort, Jaipur',
    'Jantar Mantar, Jaipur',
    'City Palace, Jaipur',
    'Mehrangarh Fort, Jodhpur',
    'Umaid Bhawan Palace, Jodhpur',
    'Lake Pichola, Udaipur',
    'City Palace, Udaipur',
    'Kumbhalgarh Fort, Rajasthan',
    'Golden Temple, Amritsar',
    'Wagah Border, Amritsar',
    'Fatehpur Sikri, Uttar Pradesh',
    'Sarnath, Uttar Pradesh',
    'Varanasi Ghats, Uttar Pradesh',
    'Khajuraho Temples, Madhya Pradesh',
    'Sanchi Stupa, Madhya Pradesh',
    'Humayun\'s Tomb, Delhi',
    'Akshardham Temple, Delhi',
    'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai',
    'Elephanta Caves, Mumbai',
    'Ajanta Caves, Maharashtra',
    'Ellora Caves, Maharashtra',
    'Shaniwar Wada, Pune',
    'Victoria Memorial, Kolkata',
    'Howrah Bridge, Kolkata',
    'Sunderbans National Park, West Bengal',
    'Konark Sun Temple, Odisha',
    'Jagannath Temple, Puri',
    'Chilika Lake, Odisha',
    'Nalanda, Bihar',
    'Bodh Gaya, Bihar',
    'Hampi, Karnataka',
    'Virupaksha Temple, Hampi',
    'Gol Gumbaz, Bijapur',
    'Leh Palace, Ladakh',
    'Pangong Tso Lake, Ladakh',
    'Thiksey Monastery, Ladakh',
    'Rann of Kutch, Gujarat',
    'Dwarkadhish Temple, Gujarat',
    'Somnath Temple, Gujarat',
    'Statue of Unity, Gujarat',
    'Sabarmati Ashram, Gujarat',
    'Cellular Jail, Port Blair',
    'Havelock Island, Andaman',
    'Valley of Flowers National Park, Uttarakhand',
    'Rishikesh, Uttarakhand',
    'Haridwar, Uttarakhand',
    'Kedarnath Temple, Uttarakhand',
    'Badrinath Temple, Uttarakhand',
    'Jim Corbett National Park, Uttarakhand',
    'Periyar National Park, Kerala',
    'Alleppey Backwaters, Kerala',
    'Munnar, Kerala',
    'Kovalam Beach, Kerala',
    'Meenakshi Amman Temple, Madurai',
    'Marina Beach, Chennai',
    'Mahabalipuram, Tamil Nadu',
    'Kanyakumari, Tamil Nadu',
    'Ooty, Tamil Nadu',
    'Coorg, Karnataka',
    'Dudhsagar Falls, Goa',
    'Palolem Beach, Goa',
    'Chapora Fort, Goa',
    'Bom Jesus Basilica, Goa',
    'Nandi Hills, Karnataka',
    'Golconda Fort, Hyderabad',
    'Hussain Sagar, Hyderabad',
    'Ramoji Film City, Hyderabad',
    'Birla Mandir, Hyderabad',
    'Salar Jung Museum, Hyderabad',
    'Chittorgarh Fort, Rajasthan',
    'Kumarakom, Kerala',
    'Shimla, Himachal Pradesh',
    'Manali, Himachal Pradesh',
    'Dal Lake, Kashmir',
    'Pahalgam, Kashmir',
    'Vaishno Devi Temple, Jammu & Kashmir',
    'Gangtok, Sikkim',
    'Pelling, Sikkim',
    'Kaziranga National Park, Assam',
    'Guwahati, Assam',
    'Shillong, Meghalaya',
    'Living Root Bridges, Meghalaya',
    'Tawang Monastery, Arunachal Pradesh',
    'Konthoujam Lairembi Temple, Manipur',
    'Loktak Lake, Manipur',
    'Agartala, Tripura',
    'Mizoram, Mizoram',
    'Kohima, Nagaland',
    'Aizawl, Mizoram',
    'Kodaikanal, Tamil Nadu'
  ];

  const filteredPlaces = touristPlaces.filter(place =>
    place.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate crowd level (1-5 scale)
  const generateCrowdLevel = () => {
    const peakHours = [10, 11, 12, 16, 17, 18];
    const currentHour = selectedTime === 'now' ? new Date().getHours() : parseInt(customTime.split(':')[0]);

    let level = Math.floor(Math.random() * 5) + 1; // Random 1-5

    // Increase likelihood of higher levels during peak hours
    if (peakHours.includes(currentHour)) {
      level = Math.min(level + 1, 5);
    }
    return level;
  };

  const getCrowdInfo = (level) => {
    const crowdData = {
      1: { label: 'No Traffic', color: 'text-purple-400', bg: 'bg-purple-950/20' },
      2: { label: 'Less', color: 'text-indigo-400', bg: 'bg-indigo-950/20' },
      3: { label: 'Moderate', color: 'text-violet-400', bg: 'bg-violet-950/20' },
      4: { label: 'High', color: 'text-fuchsia-400', bg: 'bg-fuchsia-950/20' },
      5: { label: 'Very High', color: 'text-pink-400', bg: 'bg-pink-950/20' }
    };
    return crowdData[level];
  };

  const handleAnalyze = () => {
    if (!selectedPlace || (selectedTime === 'custom' && (!customTime || !customDate))) return;

    setLoading(true);
    setTimeout(() => {
      const level = generateCrowdLevel();
      setCrowdLevel(level);
      setLoading(false);
    }, 1000);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b0821] via-[#2a0e4c] to-[#12002e] text-gray-100 font-sans">
      {/* Header */}
      <div className="bg-transparent shadow-lg border-b-2 border-purple-600">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-[#a652ff] to-[#7f46dd] rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-100">CrowdSense India</h1>
                <p className="text-gray-400">Tourist Crowd Detection</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Current Time (IST)</div>
              <div className="text-lg font-semibold text-gray-100">{getCurrentTime()}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#1e0737] rounded-2xl shadow-xl p-8 border border-purple-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-100 flex items-center">
                <MapPin className="h-6 w-6 text-purple-400 mr-2" />
                Select Location & Time
              </h2>
              {/* Place Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Tourist Attraction
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedPlace || searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedPlace('');
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search for a tourist attraction..."
                    className="w-full p-4 border-2 border-purple-800 bg-[#2b104c] text-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  />
                  {showSuggestions && searchTerm && (
                    <div className="absolute z-10 w-full mt-2 bg-[#2b104c] border-2 border-purple-800 rounded-xl max-h-60 overflow-y-auto">
                      {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place, index) => (
                          <div
                            key={index}
                            onMouseDown={() => {
                              setSelectedPlace(place);
                              setSearchTerm(place);
                              setShowSuggestions(false);
                            }}
                            className="p-3 text-gray-200 hover:bg-[#341857] cursor-pointer"
                          >
                            {place}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-gray-400 italic">No match found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Time Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Time
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border-2 border-purple-800 bg-[#2b104c] rounded-lg hover:bg-[#341857] cursor-pointer transition-colors duration-200">
                    <input
                      type="radio"
                      name="timeSelection"
                      value="now"
                      checked={selectedTime === 'now'}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-4 h-4 text-purple-500 accent-purple-500"
                    />
                    <Clock className="h-4 w-4 ml-3 mr-2 text-gray-400" />
                    <span className="text-gray-300 font-medium">Current Time</span>
                  </label>
                  <label className="flex items-center p-3 border-2 border-purple-800 bg-[#2b104c] rounded-lg hover:bg-[#341857] cursor-pointer transition-colors duration-200">
                    <input
                      type="radio"
                      name="timeSelection"
                      value="custom"
                      checked={selectedTime === 'custom'}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-4 h-4 text-purple-500 accent-purple-500"
                    />
                    <Calendar className="h-4 w-4 ml-3 mr-2 text-gray-400" />
                    <span className="text-gray-300 font-medium">Custom Time</span>
                  </label>
                  {selectedTime === 'custom' && (
                    <div className="ml-8 space-y-3">
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full p-3 border border-purple-800 bg-[#2b104c] text-gray-200 rounded-lg focus:border-purple-500"
                      />
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full p-3 border border-purple-800 bg-[#2b104c] text-gray-200 rounded-lg focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={!selectedPlace || (selectedTime === 'custom' && (!customTime || !customDate)) || loading}
                className="w-full bg-gradient-to-r from-[#9030c5] to-[#c755c9] text-white font-bold py-4 px-6 rounded-xl hover:from-[#a040d5] hover:to-[#d765d9] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                    Analyzing...
                  </>
                ) : (
                  'Check Crowd Level'
                )}
              </button>
            </div>
            {/* Result Section */}
            <div className="flex items-center justify-center">
              {crowdLevel ? (
                <div className="text-center p-8 bg-gradient-to-br from-[#1e0737] to-[#2b104c] rounded-2xl w-full border border-purple-900">
                  <h3 className="text-xl font-bold text-gray-100 mb-6">Crowd Level</h3>
                  <div className="mb-6">
                    <div className="text-6xl font-bold text-gray-100 mb-4">{crowdLevel}</div>
                    <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${getCrowdInfo(crowdLevel).bg} ${getCrowdInfo(crowdLevel).color}`}>
                      {getCrowdInfo(crowdLevel).label}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    Scale: 1-No Traffic | 2-Less | 3-Moderate | 4-High | 5-Very High
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-700/50" />
                  <p className="text-lg text-gray-300">Select location and time to check crowd level</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CrowdDetectionApp;
