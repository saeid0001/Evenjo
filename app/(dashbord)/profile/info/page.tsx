import React from "react";
import InfoHeaderSection from "./_components/InfoHeaderSection";
import FormChangeInfo from "./_components/FormChangeInfo";
import profileAuth from "@/app/hooks/profileAuth";

const page = async () => {
  const infoUserProfile = await profileAuth();
  return (
    <div className="flex flex-col gap-y-10">
      <InfoHeaderSection infoUserProfile={infoUserProfile}/>
      <FormChangeInfo infoUserProfile={infoUserProfile}/>
    </div>
  );
};

export default page;
