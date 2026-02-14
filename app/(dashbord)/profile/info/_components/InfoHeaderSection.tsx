"use client";
import { UserProfile } from "@/app/lib/types/event";
import Image from "next/image";
import React from "react";
import AvatarUpload from "./AvatarUpload";
import { useSeatStor } from "@/app/lib/useSeatStor";
import { Edite } from "@/app/Ui/svg";

const InfoHeaderSection = ({
  infoUserProfile,
}: {
  infoUserProfile: UserProfile;
}) => {
  const editeProfile = useSeatStor((state) => state.editeProfile);
  const ToggleEditeProfile = useSeatStor((state) => state.setEditeProfile);
  return (
    <div className="bg-neutral-900 rounded-three p-6 flex justify-between items-center overflow-hidden">
      <div className=" flex gap-x-4 items-center">
        <div className=" relative w-25 h-25">
          <Image
            src={
              infoUserProfile.avatar_url
                ? infoUserProfile.avatar_url
                : "/avatar.png"
            }
            unoptimized
            alt=""
            fill
            className="object-cover rounded-full p-2 border border-white/9 border-r-main/40 z-10 bg-[#221c23]"
          />
          <div className="w-px bg-white/11 h-screen absolute -top-2/4 right-2/4" />
          <div className="w-px bg-white/11 h-screen absolute -top-2/4 right-3/4" />
          <div className="w-px bg-gradient-cool h-screen absolute -top-2/4 left-3/4" />
          <div className="w-2/4 bg-main h-full absolute top-0 right-2/4 translate-x-2/4 blur-3xl opacity-50" />
        </div>
        <div className="flex flex-col ">
          <span className=" text-[24px] font-medium">{`${infoUserProfile.first_name} ${infoUserProfile.last_name}`}</span>
          <span className="text-[12px] text-neutral-100">
            {infoUserProfile.email}
          </span>
        </div>
      </div>
      <div>
        {!editeProfile ? (
          <span
            onClick={() => ToggleEditeProfile(true)}
            className=" cursor-pointer flex items-center gap-x-2"
          >
            <Edite />
            Edite
          </span>
        ) : (
          <AvatarUpload
            url={infoUserProfile.avatar_url || "/avatar.png"}
            userId={infoUserProfile.id}
          />
        )}
      </div>
    </div>
  );
};

export default InfoHeaderSection;
