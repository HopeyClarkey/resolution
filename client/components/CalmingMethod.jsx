import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const CalmingMethod = ({ changeMedName }) => {
  const [selectedVideo, setSelectedVideo] = useState('');
  const videoOptions = {
    '': 'No video selected',
    cEqZthCaMpo: 'MiniMoods - Stress',
    QtE00VP4W3Y: 'MiniMoods - Focus',
    LgRd1Mzhb_Q: 'MiniMoods - Racing Minds',
    QHkXvPq2pQE: 'MightyMoods - Reset',
  };

  const handleChange = (event) => {
    setSelectedVideo(event.target.value);
    changeMedName(videoOptions[event.target.value]);
  };

  return (
    <div>
      <h5>Meditate</h5>
      <Form.Select value={selectedVideo} onChange={handleChange}>
        {Object.entries(videoOptions).map(([videoId, videoName]) => (
          <option key={videoId} value={videoId}>
            {videoName}
          </option>
        ))}
      </Form.Select>
      {selectedVideo && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?si=KIcPiiH_kpXtlrQr&amp;controls=0`}
            // only allow viewing in the vid player || removed fullscreen and some other stuff
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default CalmingMethod;
