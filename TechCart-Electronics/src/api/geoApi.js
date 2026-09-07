import axios from "axios";

// Free OpenStreetMap Nominatim reverse-geocoding endpoint, no API key needed.
export function reverseGeocode(lat, lon) {
  return axios.get("https://nominatim.openstreetmap.org/reverse", {
    params: { lat, lon, format: "json" },
  });
}
