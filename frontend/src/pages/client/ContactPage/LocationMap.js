import React from 'react';

const LocationMap = ({ embedCode, locationName }) => {
  if(!embedCode) return null;
  // Kiểm tra nếu embedCode là URL đầy đủ hoặc chỉ là src thôi
  const srcUrl = embedCode.includes('<iframe')
    ? embedCode.match(/src="([^"]+)"/)?.[1] || ''
    : embedCode;

  // Tạo URL cho nút "View on Google Maps"
  const getGoogleMapsUrl = () => {
    // Trích xuất tọa độ hoặc tên địa điểm từ embed URL
    const latMatch = embedCode.match(/!3d(-?\d+\.\d+)!/);
    const lngMatch = embedCode.match(/!2d(-?\d+\.\d+)!/);
    const placeMatch = embedCode.match(/!2s([^!]+)!/);

    if (latMatch && lngMatch) {
      const lat = latMatch[1];
      const lng = lngMatch[1];
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }
    else if (placeMatch) {
      const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://www.google.com/maps/search/${encodeURIComponent(place)}`;
    }
    else if (locationName) {
      // Sử dụng tên địa điểm nếu có
      return `https://www.google.com/maps/search/${encodeURIComponent(locationName)}`;
    }

    return "https://www.google.com/maps"; // URL mặc định
  };

  return (
    <div className="location-map-container">
      <div className="location-map">
        <iframe
          src={srcUrl}
          width="100%"
          height="450"
          style={{border:0}}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        ></iframe>
      </div>

      <div className="map-actions">
        <a
          href={getGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="view-on-google-maps-btn"
        >
          <i className="fas fa-map-marker-alt"></i> View on Google Maps
        </a>
      </div>
    </div>
  );
};

export default LocationMap;