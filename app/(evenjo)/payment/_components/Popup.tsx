"use client";

import { Lock } from "@/app/Ui/svg";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Popup = () => {
  const [pop, setPop] = useState(true);
  return (
    <AnimatePresence>
      {pop && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPop(false)}
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className={`
          fixed z-50 flex flex-col items-center gap-y-6 
          top-1/2 left-1/2 bg-neutral-800 p-8 rounded-[30px] border border-neutral-700
          w-[90%] md:w-112.5 shadow-2xl
        `}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-main blur-2xl opacity-40 rounded-full" />
              <Lock className="w-16 h-16 relative z-10 fill-main" />
            </div>

            <div className="flex flex-col gap-y-2 text-center">
              <h3 className="text-[20px] md:text-[22px] font-bold text-white leading-tight">
                You have 10 minutes to complete your purchase
              </h3>
              <p className="text-[16px] md:text-[18px] text-neutral-400">
                The price of your tickets will be locked during this time
              </p>
            </div>

            <button
              onClick={() => setPop(false)}
              className="w-full px-4 py-4 bg-main text-white rounded-two cursor-pointer hover:bg-main/90 active:scale-[0.98] transition-all duration-200 font-bold text-lg shadow-lg shadow-main/20"
            >
              {`Got it, Let's Start`}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Popup;
