import React from "react";

export default function Navbar({ userInfo }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "2rem" }}
    >
      <div
        className="d-flex align-items-center"
        style={{
          height: "100%",
          borderRadius: "1rem",
          background: "#222",
          padding: "2px",
        }}
      >
        <img
          src={userInfo.image}
          alt="Profile Pic"
          style={{
            height: "100%",
            borderRadius: "2rem",
            marginLeft: "0.25rem",
          }}
        />
        <h5
          className="h5 text-light"
          style={{
            marginBottom: "0",
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
          }}
        >
          {userInfo.name}
        </h5>
      </div>
    </div>
  );
}
