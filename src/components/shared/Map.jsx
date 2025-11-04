import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "./Map.css";

// Fix for default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to handle map view changes
function MapView({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
}

/**
 * Map Component - Similar to React Native Maps
 * 
 * @param {Object} props
 * @param {Array} props.center - [latitude, longitude] - Default center of the map
 * @param {Number} props.zoom - Initial zoom level (default: 13)
 * @param {Array} props.markers - Array of marker objects with {lat, lng, title, description}
 * @param {String} props.height - Height of the map container (default: "400px")
 * @param {String} props.width - Width of the map container (default: "100%")
 * @param {Boolean} props.scrollWheelZoom - Enable scroll wheel zoom (default: true)
 * @param {Function} props.onMarkerClick - Callback when marker is clicked
 * @param {Function} props.onMapClick - Callback when map is clicked
 */
// Popup Content Component
const PopupContent = ({ marker, onNavigate }) => {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate(marker);
    }
  };

  return (
    <div className="map-popup-content" onClick={handleClick}>
      <h3 className="map-popup-title">{marker.title || "Restaurant"}</h3>
      <div className="map-popup-info">
        <div className="map-popup-row">
          {/* <span className="map-popup-label">Cuisine:</span> */}
          <span className="map-popup-value">{marker.cuisine || "N/A"}</span>
        </div>
        <div className="map-popup-row">
          {/* <span className="map-popup-label">Location:</span> */}
          <span className="map-popup-value">{marker.description || "N/A"}</span>
        </div>
        <div className="map-popup-row">
          <span className="map-popup-value map-popup-distance">
            {marker.distance || "See on map"}
          </span>
        </div>
      </div>
      <button className="map-popup-button">
        View Details
      </button>
    </div>
  );
};

// Component to handle single popup at a time
function SinglePopupManager({ markers, onNavigate }) {
  const map = useMap();
  const currentPopupRef = useRef(null);

  useEffect(() => {
    const handlePopupOpen = (e) => {
      // Close previously opened popup
      if (currentPopupRef.current && currentPopupRef.current !== e.popup) {
        currentPopupRef.current.close();
      }
      currentPopupRef.current = e.popup;
    };

    map.on('popupopen', handlePopupOpen);

    return () => {
      map.off('popupopen', handlePopupOpen);
    };
  }, [map]);

  return null;
}

const Map = ({
  center = [40.7128, -74.0060], // Default to New York
  zoom = 13,
  markers = [],
  height = "400px",
  width = "100%",
  scrollWheelZoom = true,
  onMarkerClick,
  onMapClick,
  className = "",
  onNavigate,
  userLocation = null, // { lat, lng } for user's current location
}) => {
  return (
    <div style={{ height, width }} className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapView center={center} zoom={zoom} />
        <SinglePopupManager markers={markers} onNavigate={onNavigate} />
        
        {/* User Location Marker */}
        {userLocation && userLocation.lat && userLocation.lng && (() => {
          const lat = typeof userLocation.lat === 'string' ? parseFloat(userLocation.lat) : userLocation.lat;
          const lng = typeof userLocation.lng === 'string' ? parseFloat(userLocation.lng) : userLocation.lng;
          
          if (isNaN(lat) || isNaN(lng)) return null;
          
          return (
            <Marker
              position={[lat, lng]}
              icon={L.divIcon({
                className: 'user-location-marker',
                html: `<div style="
                  background-color: #9235e2;
                  width: 28px;
                  height: 28px;
                  border-radius: 50%;
                  border: 5px solid white;
                  box-shadow: 0 3px 10px rgba(146, 53, 226, 0.6);
                "></div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
              })}
              zIndexOffset={1000}
            >
              <Popup className="map-popup">
                <div className="map-popup-content">
                  <div className="text-center">
                    <strong className="map-popup-title">Your Location</strong>
                    <p className="map-popup-value" style={{ marginTop: '8px', marginBottom: '0' }}>
                      You are here
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })()}
        
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.lat, marker.lng]}
          >
            <Popup className="map-popup" autoClose={true}>
              <PopupContent marker={marker} onNavigate={onNavigate} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;

