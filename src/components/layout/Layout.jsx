import React from "react";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";

export function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
