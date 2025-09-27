const touristPlaces = [
  "Taj Mahal, Agra", "Red Fort, Delhi", "Gateway of India, Mumbai",
  "Hawa Mahal, Jaipur", "Mysore Palace, Karnataka", "India Gate, Delhi",
  "Charminar, Hyderabad", "Marine Drive, Mumbai", "Lotus Temple, Delhi",
  "Qutub Minar, Delhi", "Amer Fort, Jaipur", "Jantar Mantar, Jaipur",
  "City Palace, Jaipur", "Mehrangarh Fort, Jodhpur", "Umaid Bhawan Palace, Jodhpur",
  "Lake Pichola, Udaipur", "City Palace, Udaipur", "Kumbhalgarh Fort, Rajasthan",
  "Golden Temple, Amritsar", "Wagah Border, Amritsar",

  // Added more places
  "Ajanta Caves, Maharashtra", "Ellora Caves, Maharashtra", "Elephanta Caves, Mumbai",
  "Sun Temple, Konark", "Jagannath Temple, Puri", "Lingaraj Temple, Bhubaneswar",
  "Victoria Memorial, Kolkata", "Howrah Bridge, Kolkata", "Dakshineswar Kali Temple, Kolkata",
  "Belur Math, West Bengal", "Sanchi Stupa, Madhya Pradesh", "Khajuraho Temples, Madhya Pradesh",
  "Gwalior Fort, Madhya Pradesh", "Orchha Fort, Madhya Pradesh", "Bandhavgarh National Park, MP",
  "Kanha National Park, MP", "Kaziranga National Park, Assam", "Manas National Park, Assam",
  "Majuli Island, Assam", "Kamakhya Temple, Guwahati",

  "Vaishno Devi Temple, Jammu", "Pangong Lake, Ladakh", "Nubra Valley, Ladakh",
  "Leh Palace, Ladakh", "Hemis Monastery, Ladakh", "Rohtang Pass, Himachal Pradesh",
  "Spiti Valley, Himachal Pradesh", "Kullu-Manali, Himachal Pradesh", "Dalhousie, Himachal Pradesh",
  "Shimla Ridge, Himachal Pradesh", "Nainital Lake, Uttarakhand", "Jim Corbett National Park, Uttarakhand",
  "Rishikesh (Lakshman Jhula)", "Haridwar Ganga Aarti", "Kedarnath Temple, Uttarakhand",
  "Badrinath Temple, Uttarakhand", "Gangotri Glacier, Uttarakhand", "Valley of Flowers, Uttarakhand",
  "Hemkund Sahib, Uttarakhand", "Mussoorie, Uttarakhand",

  "Marina Beach, Chennai", "Kapaleeshwarar Temple, Chennai", "Meenakshi Amman Temple, Madurai",
  "Brihadeeswarar Temple, Thanjavur", "Shore Temple, Mahabalipuram", "Auroville, Puducherry",
  "Sri Aurobindo Ashram, Puducherry", "Backwaters of Alleppey, Kerala", "Munnar Tea Gardens, Kerala",
  "Athirappilly Waterfalls, Kerala", "Periyar Wildlife Sanctuary, Kerala", "Kovalam Beach, Kerala",
  "Varkala Beach, Kerala", "Padmanabhaswamy Temple, Thiruvananthapuram", "Golconda Fort, Hyderabad",
  "Ramoji Film City, Hyderabad", "Hussain Sagar Lake, Hyderabad", "Belum Caves, Andhra Pradesh",
  "Araku Valley, Andhra Pradesh", "Borra Caves, Andhra Pradesh",

  "Somnath Temple, Gujarat", "Dwarkadhish Temple, Gujarat", "Gir National Park, Gujarat",
  "Rann of Kutch, Gujarat", "Sabarmati Ashram, Ahmedabad", "Modhera Sun Temple, Gujarat",
  "Statue of Unity, Kevadia", "Mount Abu, Rajasthan", "Ranthambore National Park, Rajasthan",
  "Pushkar Lake, Rajasthan",

  "Tawang Monastery, Arunachal Pradesh", "Ziro Valley, Arunachal Pradesh", "Nathu La Pass, Sikkim",
  "Tsomgo Lake, Sikkim", "Rumtek Monastery, Sikkim", "Shillong, Meghalaya",
  "Cherrapunji, Meghalaya", "Dawki River, Meghalaya", "Loktak Lake, Manipur",
  "Dzükou Valley, Nagaland"
];


const placeInput = document.getElementById('placeInput');
const suggestions = document.getElementById('suggestions');
const checkBtn = document.getElementById('checkBtn');
const resultBox = document.getElementById('resultBox');
const customTimeInputs = document.getElementById('customTimeInputs');

let selectedPlace = '';
let selectedTime = 'now';
let customDate = '';
let customTime = '';

// Show IST current time
function updateTime() {
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  document.getElementById('currentTime').innerText = now;
}
setInterval(updateTime, 1000);
updateTime();

// Place suggestions
placeInput.addEventListener('input', () => {
  const val = placeInput.value.toLowerCase();
  selectedPlace = '';
  if (!val) {
    suggestions.style.display = 'none';
    checkBtn.disabled = true;
    return;
  }
  const filtered = touristPlaces.filter(p => p.toLowerCase().includes(val));
  suggestions.innerHTML = filtered.map(p => `<div>${p}</div>`).join('') || "<div>No match found</div>";
  suggestions.style.display = 'block';
});

suggestions.addEventListener('click', e => {
  if (e.target.tagName === 'DIV') {
    placeInput.value = e.target.innerText;
    selectedPlace = e.target.innerText;
    suggestions.style.display = 'none';
    validate();
  }
});

// Time selection
document.querySelectorAll("input[name='timeOption']").forEach(r => {
  r.addEventListener('change', e => {
    selectedTime = e.target.value;
    customTimeInputs.style.display = (selectedTime === 'custom') ? 'block' : 'none';
    validate();
  });
});

document.getElementById('customDate').addEventListener('input', e => { customDate = e.target.value; validate(); });
document.getElementById('customTime').addEventListener('input', e => { customTime = e.target.value; validate(); });

function validate() {
  if (!selectedPlace) { 
    checkBtn.disabled = true; 
    return; 
  }

  if (selectedTime === 'custom') {
    if (!customDate || !customTime) { 
      checkBtn.disabled = true; 
      return; 
    }

    const now = new Date();
    const selectedDateTime = new Date(`${customDate}T${customTime}`);
    
    // ❌ Disallow future date/time
    if (selectedDateTime > now) {
      checkBtn.disabled = true;
      return;
    }
  }

  checkBtn.disabled = false;
}


function generateCrowdLevel() {
  const peakHours = [10,11,12,16,17,18];
  let hour = selectedTime === 'now' ? new Date().getHours() : parseInt(customTime.split(':')[0]);
  let level = Math.floor(Math.random() * 5) + 1;
  if (peakHours.includes(hour)) level = Math.min(level+1, 5);
  return level;
}

function getCrowdInfo(level) {
  switch(level) {
    case 1: return {label:'No Traffic', class:'no-traffic'};
    case 2: return {label:'Less', class:'less'};
    case 3: return {label:'Moderate', class:'moderate'};
    case 4: return {label:'High', class:'high'};
    case 5: return {label:'Very High', class:'very-high'};
  }
}

checkBtn.addEventListener('click', () => {
  resultBox.innerHTML = "<p>Analyzing...</p>";
  setTimeout(() => {
    const level = generateCrowdLevel();
    const info = getCrowdInfo(level);
    resultBox.innerHTML = `
      <h3 style="margin-bottom:10px;">Crowd Level</h3>
      <div style="font-size:50px; font-weight:bold;">${level}</div>
      <div class="crowd-label ${info.class}">${info.label}</div>
      <p style="margin-top:15px; font-size:13px; color:#bbb;">
        Scale: 1-No Traffic | 2-Less | 3-Moderate | 4-High | 5-Very High
      </p>
    `;
  }, 1000);
});
