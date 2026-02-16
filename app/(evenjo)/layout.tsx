import React from "react";
import Navbar from "@/app/components/Navbar";
import ScrollToTop from "../components/ScrollToTop";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main>{children}</main>
    </>
  );
};

export default layout;
