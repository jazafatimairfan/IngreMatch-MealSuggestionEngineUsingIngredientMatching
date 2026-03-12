import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // This is the 'brain' file we just made
import "./index.css";      // This imports your friend's Tailwind styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);