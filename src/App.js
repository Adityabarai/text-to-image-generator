import React, { useRef, useState } from "react";
import "./App.css";
import default_image from "./default_image.png"; // Ensure the path is correct

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState(default_image);
  const [loading, setLoading] = useState(false);
  const [loadingWidth, setLoadingWidth] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const inputRef = useRef(null);

  const imageGenerator = () => {
    if (inputRef.current.value === "") {
      setErrorMessage("Input cannot be empty");
      return;
    }

    setLoading(true);
    setLoadingWidth(0);

    const apiKey = "xeK8eZOqeojV6MIWNMo2g5XUZTVm9l3x1kND22VlLhkoZWskNyZaJg4f"; // Replace with your actual Pexels API key
    const query = inputRef.current.value;

    // Increment the loading bar width
    let loadingInterval = setInterval(() => {
      setLoadingWidth((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(loadingInterval);
          return 100;
        }
      });
    }, 50); // Adjust this value for a smoother or faster transition

    fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
      headers: {
        Authorization: apiKey,
      },
    })
      .then(response => response.json()) 
      
      .then(data => {
        if (data.photos && data.photos.length > 0) {
          setImageUrl(data.photos[0].src.medium);
          setErrorMessage(""); // Clear previous error message
        } else {
          setImageUrl(default_image);
          setErrorMessage("No images found");
          console.error("API Error:", data);
        }
      })
      .finally(() => {
        clearInterval(loadingInterval);
        setLoading(false);
        setLoadingWidth(100);
      });
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        Text to Image <span>Generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={imageUrl} alt="Generated AI" className="fixed-size" />
        </div>
        {loading && (
          <div className="loading">
            <div
              className="loading-bar"
              style={{ width: `${loadingWidth}%` }}
            ></div>
            <div className="loading-text">
              <span>Generating Image...</span>
            </div>
          </div>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe What You Want To See"
        />
        <button className="generate-btn" onClick={imageGenerator}>
          Generate
        </button>
      </div>
    </div>
  );
};

export default ImageGenerator;
