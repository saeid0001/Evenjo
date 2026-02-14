import React from "react";
import NavBarDashbord from "./profile/_components/NavBarDashbord";
import Header from "./profile/_components/Header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main>
        <div className=" grid grid-cols-15 px-5 py-5 gap-x-6">
          <div className="sticky top-5 col-span-4 bg-neutral-800 h-[calc(100vh-40px)] p-4 rounded-three">
            <NavBarDashbord />
          </div>
          <div className=" col-span-11 flex flex-col gap-y-6">
            <Header />
            <div className=" w-full min-h-[calc(100vh-130px)] max-h-screen  ">
              {children}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default layout;
