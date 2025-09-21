import React, { useState, useEffect } from 'react';
import { MapPin, Star, Plus, X, Route, Navigation, DollarSign, Camera, Heart, Trophy, Gift, Compass, Award } from 'lucide-react';
const cityPositions = {
  Delhi: { x: 100, y: 80 },
  Agra: { x: 250, y: 200 },
  Jaipur: { x: 400, y: 120 },
  Varanasi: { x: 600, y: 220 },
};

const TravelPathOptimizer = () => {
  const [gamePhase, setGamePhase] = useState('input');
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState('');
  const [optimizedPath, setOptimizedPath] = useState([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [showRiddleModal, setShowRiddleModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [visitedPlaces, setVisitedPlaces] = useState(new Set());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [playerAvatar, setPlayerAvatar] = useState('adventurer');
  const [discoveredGems, setDiscoveredGems] = useState(new Set());
  const [animatingRoad, setAnimatingRoad] = useState(false);

  const avatarOptions = [
    { id: 'adventurer', name: 'Adventure Explorer', icon: '🧗‍♂️', color: 'from-orange-400 to-red-500' },
    { id: 'photographer', name: 'Photo Hunter', icon: '📸', color: 'from-purple-400 to-pink-500' },
    { id: 'wanderer', name: 'World Wanderer', icon: '🌍', color: 'from-green-400 to-blue-500' },
    { id: 'historian', name: 'Culture Seeker', icon: '🏛️', color: 'from-yellow-400 to-orange-500' }
  ];

  const placesDatabase = {
    'Delhi': { 
      x: 40, y: 25, cost: 0, travelPoints: 50,
      attractions: [
        { name: 'Red Fort', riddle: 'Where Mughal emperors held their court, this red sandstone wonder stands with historical import.', answer: 'red fort', points: 100, icon: '🏰' },
        { name: 'India Gate', riddle: 'A memorial arch stands tall and proud, honoring soldiers, drawing every crowd.', answer: 'india gate', points: 80, icon: '🏛️' },
        { name: 'Lotus Temple', riddle: 'Like a blooming flower of white marble pure, where people of all faiths find peace for sure.', answer: 'lotus temple', points: 90, icon: '🪷' }
      ]
    },
    'Mumbai': { 
      x: 25, y: 60, cost: 350, travelPoints: 75,
      attractions: [
        { name: 'Gateway of India', riddle: 'Built to welcome a King and Queen, this arch by the sea is an iconic scene.', answer: 'gateway', points: 90, icon: '🌊' },
        { name: 'Marine Drive', riddle: 'The Queens necklace shines at night, a curved road with city lights so bright.', answer: 'marine drive', points: 70, icon: '🌃' },
        { name: 'Elephanta Caves', riddle: 'Ancient sculptures carved in stone, on an island where history has grown.', answer: 'elephanta caves', points: 120, icon: '🗿' }
      ]
    },
    'Bangalore': { 
      x: 45, y: 75, cost: 280, travelPoints: 60,
      attractions: [
        { name: 'Lalbagh Garden', riddle: 'Botanical beauty in the citys heart, where nature and urban life never part.', answer: 'lalbagh', points: 75, icon: '🌸' },
        { name: 'Bangalore Palace', riddle: 'A Tudor-style palace grand and old, where royal stories are still told.', answer: 'bangalore palace', points: 95, icon: '🏰' }
      ]
    },
    'Jaipur': { 
      x: 35, y: 35, cost: 200, travelPoints: 85,
      attractions: [
        { name: 'Hawa Mahal', riddle: 'Palace of winds with 953 windows small, where royal ladies watched festivals enthrall.', answer: 'hawa mahal', points: 110, icon: '🏛️' },
        { name: 'Amber Fort', riddle: 'On hilltop high this fortress stands, built with red sandstone by royal hands.', answer: 'amber fort', points: 130, icon: '🏰' }
      ]
    },
    'Goa': { 
      x: 20, y: 65, cost: 400, travelPoints: 90,
      attractions: [
        { name: 'Baga Beach', riddle: 'Where sand meets sea and parties never end, this beach is every travelers friend.', answer: 'baga beach', points: 85, icon: '🏖️' },
        { name: 'Basilica of Bom Jesus', riddle: 'A church so old with treasures divine, where Saint Francis Xavier does shrine.', answer: 'basilica', points: 100, icon: '⛪' }
      ]
    },
    'Kerala': { 
      x: 35, y: 85, cost: 450, travelPoints: 100,
      attractions: [
        { name: 'Backwaters', riddle: 'Coconut palms line waterways serene, the most peaceful sight youve ever seen.', answer: 'backwaters', points: 120, icon: '🛶' },
        { name: 'Tea Gardens', riddle: 'Green hills covered in emerald leaves, where aromatic tea the cool breeze weaves.', answer: 'tea gardens', points: 110, icon: '🍃' }
      ]
    },
    'Agra': { 
      x: 42, y: 28, cost: 180, travelPoints: 150,
      attractions: [
        { name: 'Taj Mahal', riddle: 'A tomb of love in marble white, one of seven wonders, pure delight.', answer: 'taj mahal', points: 150, icon: '🕌' },
        { name: 'Agra Fort', riddle: 'Red walls that housed the Mughal throne, a fortress mighty, carved in stone.', answer: 'agra fort', points: 120, icon: '🏰' }
      ]
    },
    'Kolkata': { 
      x: 65, y: 40, cost: 320, travelPoints: 70,
      attractions: [
        { name: 'Victoria Memorial', riddle: 'White marble monument to a Queen, in the City of Joy, a majestic scene.', answer: 'victoria memorial', points: 95, icon: '🏛️' },
        { name: 'Howrah Bridge', riddle: 'Steel giant spanning the holy river, connecting hearts that never wither.', answer: 'howrah bridge', points: 80, icon: '🌉' }
      ]
    },
    'Udaipur': { 
      x: 30, y: 45, cost: 250, travelPoints: 95,
      attractions: [
        { name: 'City Palace', riddle: 'Overlooking lake waters blue, a palace complex with royal view.', answer: 'city palace', points: 140, icon: '🏰' },
        { name: 'Lake Pichola', riddle: 'Mirror of sky in desert land, where sunset paints with golden hand.', answer: 'lake pichola', points: 100, icon: '🏞️' }
      ]
    },
    'Mysore': { 
      x: 42, y: 80, cost: 300, travelPoints: 80,
      attractions: [
        { name: 'Mysore Palace', riddle: 'Golden throne and ivory doors, this palace has a thousand floors.', answer: 'mysore palace', points: 125, icon: '👑' },
        { name: 'Brindavan Gardens', riddle: 'Musical fountains dance at night, in gardens of pure delight.', answer: 'brindavan gardens', points: 90, icon: '⛲' }
      ]
    }
  };

  // Generate road connections between consecutive places
  const generateRoadPath = (place1, place2) => {
    const p1 = placesDatabase[place1];
    const p2 = placesDatabase[place2];
    
    // Create curved path between points
    const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 10;
    const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 10;
    
    return `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;
  };

  const optimizePath = (selectedPlaces) => {
    if (selectedPlaces.length <= 1) return selectedPlaces;
    
    let unvisited = [...selectedPlaces];
    let path = [unvisited[0]];
    unvisited = unvisited.slice(1);
    let cost = 0;

    while (unvisited.length > 0) {
      let currentPlace = path[path.length - 1];
      let nearestPlace = null;
      let minDistance = Infinity;

      unvisited.forEach(place => {
        const distance = calculateDistance(
          placesDatabase[currentPlace], 
          placesDatabase[place]
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestPlace = place;
        }
      });

      path.push(nearestPlace);
      cost += placesDatabase[nearestPlace].cost;
      unvisited = unvisited.filter(p => p !== nearestPlace);
    }

    setTotalCost(cost);
    return path;
  };

  const calculateDistance = (place1, place2) => {
    return Math.sqrt(Math.pow(place1.x - place2.x, 2) + Math.pow(place1.y - place2.y, 2));
  };

  const addPlace = () => {
    if (newPlace && placesDatabase[newPlace] && !places.includes(newPlace)) {
      setPlaces([...places, newPlace]);
      setNewPlace('');
    }
  };

  const removePlace = (placeToRemove) => {
    setPlaces(places.filter(p => p !== placeToRemove));
  };

  const generateOptimalPath = () => {
    if (places.length >= 2) {
      const optimized = optimizePath(places);
      setOptimizedPath(optimized);
      setGamePhase('planning');
      setAnimatingRoad(true);
      setTimeout(() => setAnimatingRoad(false), 3000);
    }
  };

  const startJourney = () => {
    setGamePhase('traveling');
    setCurrentLocationIndex(0);
  };

  const handleLocationVisit = (placeIndex) => {
    if (placeIndex === currentLocationIndex) {
      const placeName = optimizedPath[placeIndex];
      
      // Award points for reaching the location
      const locationPoints = placesDatabase[placeName].travelPoints;
      setUserPoints(prev => prev + locationPoints);
      
      const attractions = placesDatabase[placeName].attractions;
      const randomAttraction = attractions[Math.floor(Math.random() * attractions.length)];
      
      setSelectedLocation({...randomAttraction, placeName, locationPoints});
      setShowRiddleModal(true);
    }
  };

  const handleRiddleSubmit = () => {
    if (riddleAnswer.toLowerCase().includes(selectedLocation.answer.toLowerCase())) {
      setUserPoints(prev => prev + selectedLocation.points);
      setVisitedPlaces(prev => new Set([...prev, selectedLocation.placeName]));
      setDiscoveredGems(prev => new Set([...prev, selectedLocation.name]));
      setShowRiddleModal(false);
      setShowSuccessModal(true);
      setRiddleAnswer('');
      
      if (currentLocationIndex < optimizedPath.length - 1) {
        setCurrentLocationIndex(prev => prev + 1);
      }
      
      setTimeout(() => setShowSuccessModal(false), 4000);
    } else {
      alert('Not quite right! Think about the clues in the riddle. 🤔');
    }
  };

  const resetGame = () => {
    setGamePhase('input');
    setPlaces([]);
    setOptimizedPath([]);
    setCurrentLocationIndex(0);
    setUserPoints(0);
    setTotalCost(0);
    setVisitedPlaces(new Set());
    setDiscoveredGems(new Set());
    setAnimatingRoad(false);
  };

  const getTotalPossiblePoints = () => {
    return optimizedPath.reduce((total, place) => {
      const placeData = placesDatabase[place];
      const attractionPoints = placeData.attractions.reduce((sum, attr) => sum + attr.points, 0);
      return total + placeData.travelPoints + attractionPoints;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-green-400 rounded-full opacity-15 animate-ping"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-blue-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-400 rounded-full opacity-15 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full shadow-lg animate-pulse">
              <Route className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                🗺️ Hidden Gems Explorer
              </h1>
              <p className="text-blue-200 text-lg">Discover India's Secret Treasures & Solve Ancient Riddles!</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className={`bg-gradient-to-r ${avatarOptions.find(a => a.id === playerAvatar)?.color} p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300`}>
              <span className="text-2xl">
                {avatarOptions.find(a => a.id === playerAvatar)?.icon}
              </span>
            </div>
            
            <div className="text-right space-y-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-white animate-spin" />
                  <span className="text-white font-bold text-xl">{userPoints}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold text-sm">{discoveredGems.size} Gems</span>
                </div>
              </div>
              {totalCost > 0 && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-6 h-6 text-white" />
                    <span className="text-white font-bold text-xl">₹{totalCost}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Avatar Selection */}
        {gamePhase === 'input' && (
          <div className="mb-8">
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">🎭 Choose Your Explorer Avatar</h3>
              <div className="grid grid-cols-4 gap-4">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setPlayerAvatar(avatar.id)}
                    className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      playerAvatar === avatar.id
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-xl scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    } backdrop-blur-sm border border-white/20`}
                  >
                    <div className="text-3xl mb-2">{avatar.icon}</div>
                    <div className="text-sm font-semibold">{avatar.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gamePhase === 'input' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                  <Compass className="w-10 h-10 text-white animate-spin" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">🚀 Plan Your Epic Adventure</h2>
                <p className="text-blue-200 text-lg">Select mystical destinations - we'll craft the perfect treasure hunt!</p>
              </div>

              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newPlace}
                    onChange={(e) => setNewPlace(e.target.value)}
                    placeholder="🔍 Enter magical city name (Delhi, Mumbai, Goa, Jaipur...)"
                    className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:border-yellow-400 focus:outline-none text-lg backdrop-blur-sm"
                    list="cities"
                  />
                  <datalist id="cities">
                    {Object.keys(placesDatabase).map(city => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
                <button
                  onClick={addPlace}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              {places.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <MapPin className="w-6 h-6 mr-2" />
                    🎯 Selected Mystical Destinations:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {places.map((place, index) => (
                      <div
                        key={place}
                        className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex justify-between items-center transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="text-white font-semibold">{place}</span>
                          <span className="text-yellow-300 text-sm">
                            {placesDatabase[place].attractions.length} 💎
                          </span>
                        </div>
                        <button
                          onClick={() => removePlace(place)}
                          className="text-red-400 hover:text-red-300 transition-colors transform hover:scale-110"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {places.length >= 2 && (
                <button
                  onClick={generateOptimalPath}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg text-lg transform hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Route className="w-6 h-6 animate-pulse" />
                    <span>🗺️ Generate Magical Travel Route</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {gamePhase === 'planning' && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                    🛤️ Your Optimized Route
                  </h2>
                  <p className="text-blue-200">Total Cost: ₹{totalCost} • {optimizedPath.length} destinations • {getTotalPossiblePoints()} max points possible 🎯</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={startJourney}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    🚀 Start Epic Journey!
                  </button>
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
                  >
                    🔄 Plan New Route
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {optimizedPath.map((place, index) => (
                  <div
                    key={place}
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-white font-semibold">{place}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-blue-200 text-sm flex items-center">
                        💎 {placesDatabase[place].attractions.length} hidden gems
                      </p>
                      <p className="text-yellow-300 text-sm flex items-center">
                        🎯 +{placesDatabase[place].travelPoints} travel points
                      </p>
                      {index > 0 && (
                        <p className="text-green-300 text-xs">
                          💰 Cost: ₹{placesDatabase[place].cost}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {gamePhase === 'traveling' && (
          <div>
            <div className="max-w-6xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    🧭 Epic Journey in Progress
                  </h2>
                  <div className="flex space-x-4 text-sm">
                    <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span className="text-blue-200">Current: </span>
                      <span className="text-white font-bold">
                        {optimizedPath[currentLocationIndex]} ({currentLocationIndex + 1}/{optimizedPath.length})
                      </span>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span className="text-blue-200">Visited: </span>
                      <span className="text-green-300 font-bold">{visitedPlaces.size}/{optimizedPath.length}</span>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span className="text-blue-200">Gems Found: </span>
                      <span className="text-yellow-300 font-bold">💎 {discoveredGems.size}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 rounded-full p-1 mb-6">
                  <div 
                    className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500 flex items-center justify-center relative overflow-hidden"
                    style={{ width: `${(visitedPlaces.size / optimizedPath.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    <span className="text-white text-xs font-bold relative z-10">
                      {Math.round((visitedPlaces.size / optimizedPath.length) * 100)}% 🏁
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Beautiful Map */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-green-400/20 via-blue-500/20 to-purple-600/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
                  🗺️ Interactive Treasure Map of India
                  <Compass className="w-8 h-8 ml-3 animate-spin text-yellow-400" />
                </h3>
                
                <div className="relative w-full h-96 bg-gradient-to-br from-emerald-50/30 via-blue-100/30 to-purple-100/30 rounded-2xl overflow-hidden border-4 border-white/30 shadow-inner">
                  {/* Enhanced Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='nonzero'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '60px 60px'
                    }}></div>
                  </div>
                  <div className="grid grid-cols-5 grid-rows-5 gap-4 relative w-full h-96 ...">
  {optimizedPath.map((place, index) => (
    <button
      key={place}
      onClick={() => handleLocationVisit(index)}
      className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center"
    >
      <MapPin className="w-6 h-6 text-white"/>
    </button>
  ))}
</div>


                  {/* SVG for Roads */}
                  {optimizedPath.length > 1 && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      {optimizedPath.slice(0, -1).map((place, index) => {
                        const nextPlace = optimizedPath[index + 1];
                        const p1 = placesDatabase[place];
                        const p2 = placesDatabase[nextPlace];
                        const pathData = generateRoadPath(place, nextPlace);
                        const isCurrentRoad = index === currentLocationIndex - 1 || index === currentLocationIndex;
                        
                        return (
                          <g key={`road-${index}`}>
                            <path
                              d={pathData}
                              stroke="url(#roadGradient)"
                              strokeWidth={isCurrentRoad ? "6" : "4"}
                              fill="none"
                              strokeDasharray={animatingRoad ? "10,5" : "none"}
                              filter={isCurrentRoad ? "url(#glow)" : "none"}
                              className={isCurrentRoad ? "animate-pulse" : ""}
                              strokeLinecap="round"
                            />
                            {/* Road markers */}
                            <circle
                              cx={(p1.x + p2.x) / 2}
                              cy={(p1.y + p2.y) / 2}
                              r="3"
                              fill="#fbbf24"
                              className="animate-ping"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  )}

                  {/* Location Points */}
                  {optimizedPath.map((place, index) => {
                    const placeData = placesDatabase[place];
                    const isVisited = visitedPlaces.has(place);
                    const isCurrent = index === currentLocationIndex;
                    const isUpcoming = index > currentLocationIndex;
                    
                    return (
                      <div key={place} className="absolute transform -translate-x-1/2 -translate-y-1/2">
                        <button
                          onClick={() => handleLocationVisit(index)}
                          className={`relative transition-all duration-500 ${
                            isVisited
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50 scale-110 cursor-default'
                              : isCurrent
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50 animate-pulse scale-125 ring-4 ring-yellow-300 cursor-pointer hover:scale-150'
                              : isUpcoming
                              ? 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-lg cursor-not-allowed opacity-60'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg cursor-default'
                          } p-4 rounded-full ${isCurrent ? 'z-10' : 'z-0'}`}
                          style={{ left: `${placeData.x}%`, top: `${placeData.y}%` }}
                          title={`${place} - ${placeData.attractions.length} hidden gems ${isCurrent ? '← CLICK ME!' : ''}`}
                          disabled={isUpcoming && !isCurrent}
                        >
                          <MapPin className="w-6 h-6 text-white" />
                          
                          {/* Status indicators */}
                          {isVisited && (
                            <div className="absolute -top-2 -right-2 bg-green-400 text-green-900 text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-bounce">
                              ✓
                            </div>
                          )}
                          {isCurrent && (
                            <>
                              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center animate-spin">
                                🧭
                              </div>
                              {/* Pulsing ring around current location */}
                              <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-30 scale-150"></div>
                              <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-20 scale-200 animation-delay-500"></div>
                            </>
                          )}
                          {isUpcoming && (
                            <div className="absolute -top-2 -right-2 bg-gray-300 text-gray-700 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              🔒
                            </div>
                          )}
                          
                          {/* Place name label with click instruction for current */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 text-white px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shadow-lg">
                            <div className="text-center">
                              <div className="font-bold">{place}</div>
                              <div className="text-yellow-300">💎 {placeData.attractions.length} gems</div>
                              {isCurrent && (
                                <div className="text-orange-300 animate-pulse mt-1 text-xs">
                                  👆 CLICK TO EXPLORE!
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}

                  {/* Enhanced Legend */}
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20">
                    <h4 className="font-bold text-white mb-3 text-sm flex items-center">
                      🗺️ Map Legend
                    </h4>
                    <div className="flex flex-col space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        <span className="text-white">Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-white">Current Location</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                        <span className="text-white">Explored</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                        <span className="text-white">Locked</span>
                      </div>
                      <div className="flex items-center space-x-2 pt-2 border-t border-white/20">
                        <div className="w-4 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                        <span className="text-white">Travel Route</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {Math.round((visitedPlaces.size / optimizedPath.length) * 100)}%
                      </div>
                      <div className="text-xs text-blue-200">Journey Complete</div>
                      <div className="w-16 h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                          style={{ width: `${(visitedPlaces.size / optimizedPath.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center space-y-4">
                  <div className="flex justify-center space-x-6 text-sm">
                    <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span className="text-blue-200">Total Distance: </span>
                      <span className="text-white font-bold">
                        {optimizedPath.length > 1 ? `${Math.round(optimizedPath.slice(0, -1).reduce((total, place, index) => {
                          return total + calculateDistance(placesDatabase[place], placesDatabase[optimizedPath[index + 1]]);
                        }, 0) * 10)} km` : '0 km'}
                      </span>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span className="text-blue-200">Possible Score: </span>
                      <span className="text-yellow-300 font-bold">{getTotalPossiblePoints()} points</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                  >
                    🗺️ Plan New Treasure Hunt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Riddle Modal */}
      {showRiddleModal && selectedLocation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl max-w-lg w-full p-8 shadow-2xl border-4 border-yellow-400 transform animate-bounce">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                <span className="text-3xl">{selectedLocation.icon}</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">🏆 Hidden Gem Discovered!</h3>
              <p className="text-gray-600">
                You earned <span className="font-bold text-green-600">+{selectedLocation.locationPoints} points</span> for reaching {selectedLocation.placeName}!
              </p>
              <p className="text-lg font-semibold text-purple-700 mt-2">
                Now solve this ancient riddle to unlock: <span className="text-orange-600">{selectedLocation.name}</span>
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 p-6 rounded-2xl mb-6 border-2 border-yellow-300 shadow-inner">
              <div className="text-center mb-4">
                <span className="text-4xl">🧩</span>
              </div>
              <p className="text-gray-800 font-medium text-lg text-center italic leading-relaxed">
                "{selectedLocation.riddle}"
              </p>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                value={riddleAnswer}
                onChange={(e) => setRiddleAnswer(e.target.value)}
                placeholder="🤔 Enter your answer here..."
                className="w-full p-4 border-3 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg bg-white/80 backdrop-blur-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleRiddleSubmit()}
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={handleRiddleSubmit}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="w-6 h-6" />
                    <span>Solve Riddle! (+{selectedLocation.points} points)</span>
                  </div>
                </button>
                <button
                  onClick={() => {setShowRiddleModal(false); setRiddleAnswer(''); setCurrentLocationIndex(prev => prev + 1);}}
                  className="px-6 py-4 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 rounded-xl hover:from-gray-400 hover:to-gray-500 transition-all duration-300 transform hover:scale-105 font-bold"
                >
                  Skip 😔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Success Modal */}
      {showSuccessModal && selectedLocation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 rounded-3xl p-8 text-center shadow-2xl transform animate-bounce border-4 border-yellow-400">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">🏆 Treasure Unlocked!</h3>
            <p className="text-xl text-gray-700 mb-4">
              You discovered the legendary: <span className="font-bold text-purple-700">{selectedLocation?.name}</span>
            </p>
            <div className="space-y-2 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-full inline-block shadow-lg">
                🎯 +{selectedLocation?.points} Riddle Points!
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-6 rounded-full inline-block shadow-lg">
                ✨ +{selectedLocation?.locationPoints} Travel Points!
              </div>
            </div>
            <div className="text-6xl animate-spin">{selectedLocation?.icon}</div>
          </div>
        </div>
      )}

      {/* Completion celebration */}
      {visitedPlaces.size === optimizedPath.length && optimizedPath.length > 0 && (
        <div className="fixed inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 rounded-3xl p-8 text-center shadow-2xl border-4 border-yellow-400 max-w-lg">
            <div className="text-8xl mb-4 animate-pulse">🏆</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Epic Journey Complete!</h2>
            <div className="space-y-3 mb-6">
              <p className="text-xl text-gray-700">
                🗺️ <span className="font-bold">{optimizedPath.length}</span> destinations explored
              </p>
              <p className="text-xl text-gray-700">
                💎 <span className="font-bold">{discoveredGems.size}</span> hidden gems discovered
              </p>
              <p className="text-2xl text-purple-700 font-bold">
                🎯 Final Score: {userPoints} points
              </p>
              <div className="text-6xl animate-pulse">👑</div>
            </div>
            
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              🚀 Start New Adventure
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPathOptimizer;