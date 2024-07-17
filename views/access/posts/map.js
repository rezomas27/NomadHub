// Initialize map with center coordinates (adjust as needed)
let map;
const center = { lat: 37.4161493, lng: -122.0812166 };

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14, // Adjust zoom level as needed
  });
}

// Function to update map and display place information
function updateMap(place) {
  const location = place.geometry.location;
  
  // Clear any existing marker
  if (marker) {
    marker.setMap(null);
  }

  // Create a new marker for the selected place
  const marker = new google.maps.Marker({
    position: location,
    map: map,
  });

  // Create an info window to display place details
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <h2>${place.name}</h2>
      <p>${place.formatted_address}</p>
    `,
  });

  // Open the info window on marker click
  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  // Center the map on the selected location
  map.setCenter(location);
}

// Call map initialization after libraries are loaded
window.onload = initMap;
