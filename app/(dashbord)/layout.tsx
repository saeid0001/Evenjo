import React from "react";
import NavBarDashbord from "./profile/_components/NavBarDashbord";
import Header from "./profile/_components/Header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="min-h-screen bg-neutral-900 pb-20 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-15 px-4 md:px-5 py-5 gap-x-6">
          <div className="fixed bottom-0 left-0 w-full z-100 bg-neutral-800 p-2 border-t border-neutral-700 lg:border-none lg:relative lg:bottom-auto lg:w-auto lg:col-span-4 lg:h-[calc(100vh-40px)] lg:p-4 lg:rounded-three">
            <NavBarDashbord />
          </div>

          <div className="col-span-1 lg:col-span-11 flex flex-col gap-y-6">
            <Header />
            <div className="w-full min-h-[calc(100vh-130px)]">{children}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default layout;
