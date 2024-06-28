// Common layout for all pages
import React from "react";
import Navbar from "./Navbar";

const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4">{children}</main>
    </>
  );
};

export default BasicLayout;
