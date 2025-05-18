import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "./HomePage.css";

function HomePage() {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = async () => {
    try {
      setIsCapturing(true);
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = await fetch(imageSrc).then((res) => res.blob());

      const formData = new FormData();
      formData.append("file", blob, "photo.jpg");

      const response = await axios.post(
        "https://facial-project-backend.onrender.com/predict/",
        formData
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error capturing image:", error);
      setResult({ error: "Failed to process image. Please try again." });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Emotion Detection & Music Recommender 🎵</h1>

      <div className="webcam-section">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="webcam"
          mirrored={true}
        />
      </div>

      <button
        className="capture-button"
        onClick={capture}
        disabled={isCapturing}
      >
        {isCapturing ? "Processing..." : "Capture & Predict"}
      </button>

      {result && !result.error && (
        <div className="result-container">
          <h2 className="mood-text">Detected Mood: {result.mood}</h2>
          {result.song ? (
            <div className="song-info">
              <p>🎵 Recommended Song:</p>
              <p className="song-details">
                {result.song.name} by {result.song.artist}
              </p>
              <a
                href={result.song.url}
                target="_blank"
                rel="noreferrer"
                className="spotify-link"
              >
                Listen on Spotify
              </a>
            </div>
          ) : (
            <p>No music found for this mood.</p>
          )}
        </div>
      )}

      {result?.error && (
        <div className="result-container">
          <p className="error-text">{result.error}</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
