import React from "react";

const Video = ({ video, poster }) => (
  <div className="video-container d-flex justify-center align-center">
    <video controls poster={poster} className="video">
      <source src={video} type="video/mp4" />
    </video>
  </div>
);

export default Video;
