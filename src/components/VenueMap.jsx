import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Geocode an address string using the OpenStreetMap Nominatim API.
 *
 * @async
 * @function geocodeAddress
 * @param {string} addressString - The full address as a single string (e.g., "123 Main St, City, Zip, Country").
 * @returns {Promise<{lat: number, lng: number} | null>} Returns an object with numeric `lat` and `lng` properties if found, otherwise `null`.
 *
 */

async function geocodeAddress(addressString) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }
  return null;
}

/**
 * React component that displays a map for a venue.
 * It uses explicitly provided latitude/longitude if available; if not, it geocodes the venue's address to determine coordinates.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.venue - The venue object. Expected to have the `data.location` object with address information,
 * and optionally `lat` and `lng` properties.
 *
 * @example
 * <VenueMap venue={venue} />
 */

export default function VenueMap({ venue }) {
  const location = venue.data.location;

  const addressParts = [
    location.address,
    location.city,
    location.zip,
    location.country,
  ].filter(Boolean);

  const [coords, setCoords] = useState(
    typeof location.lat === "number" && typeof location.lng === "number"
      ? { lat: location.lat, lng: location.lng }
      : null
  );
  const [loading, setLoading] = useState(!coords);

  useEffect(() => {
    async function getCoordsIfNeeded() {
      if (!coords && addressParts.length) {
        const addressString = addressParts.join(", ");
        setLoading(true);
        const result = await geocodeAddress(addressString);
        setCoords(result);
        setLoading(false);
      }
    }
    getCoordsIfNeeded();
  }, []);

  if (loading) return <div>Loading map...</div>;
  if (!coords) return <div>Could not find coordinates</div>;

  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={13}
      className="h-72 w-full rounded-lg shadow sm:h-96"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[coords.lat, coords.lng]}>
        <Popup>
          <strong>{venue.data.name}</strong>
          <br />
          {addressParts.join(", ")}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
