import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        height: "80vh",
        flexWrap: "wrap", // Allow items to wrap on smaller screens
      }}
    >
      {/* Image Section */}
      <div style={{ flex: "1 1 40%", paddingRight: "20px" }}>
        <img
          src="/images/landingpage_image2.png"
          alt="Landing Page Image"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "600px",
            objectFit: "cover",
            borderRadius: "10px", // Optional: Add border radius for aesthetics
          }}
        />
      </div>

      {/* Text Section */}
      <div style={{ flex: "1 1 50%", paddingLeft: "60px" }}>
        <h1
          style={{
            fontFamily: "Urbanist",
            fontWeight: 600,
            fontSize: "2.5rem", // Responsive font size
            color: "#000000",
            margin: "0",
          }}
        >
          We understand that being a student can be{" "}
          <span style={{ color: "#FF5353" }}>challenging.</span>
        </h1>
        <p
          style={{
            fontFamily: "Urbanist",
            fontWeight: 400,
            fontSize: "1.25rem", // Responsive font size
            color: "#666666",
            marginBottom: "40px",
          }}
        >
          Join our dynamic team right here on campus. Earn, learn, and be part of the community that powers your daily essentials.
          Apply now and shape your campus experience!
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
            type="button"
            style={{
              width: "150px",
              height: "60px",
              background: "#FF5353",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              fontFamily: "Urbanist",
              fontWeight: 600,
              fontSize: "20px",
              color: "white",
            }}
          >
            Sign Up
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            type="button"
            style={{
              width: "150px",
              height: "60px",
              background: "#FFFFFF",
              border: "1px solid #656565",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "Urbanist",
              fontWeight: 600,
              fontSize: "20px",
              color: "#656565",
            }}
          >
            Login
          </button>
        </div>
      </div>

      {/* Media Queries for Responsive Design */}
      <style>{`
        @media (max-width: 768px) {
          div {
            flex-direction: column; // Stack items vertically on smaller screens
            align-items: center; // Center align items
          }
          img {
            max-height: 400px; // Adjust max height of the image
          }
          h1 {
            font-size: 2rem; // Decrease heading font size
          }
          p {
            font-size: 1rem; // Decrease paragraph font size
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;