"use client";

import { updateProfileUser } from "@/app/lib/actionServer";
import "react-datepicker/dist/react-datepicker.css";
import { UserProfile } from "@/app/lib/types/event";
import InputForm from "@/app/signup/_components/InputForm";
import { Calendar, Location, Messages, Phone, User } from "@/app/Ui/svg";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import { supabase } from "@/app/lib/supabase";

const formFields = [
  {
    id: "first_name",
    label: "Name",
    type: "text",
    svg: <User className=" fill-neutral-100 w-6 h-6" />,
  },
  {
    id: "last_name",
    label: "Family Name",
    type: "text",
    svg: <User className=" fill-neutral-100 w-6 h-6" />,
  },
  {
    id: "city",
    label: "City",
    type: "text",
    svg: <Location className=" fill-neutral-100 w-6 h-6" />,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    svg: <Messages className=" fill-neutral-100 w-6 h-6" />,
  },
  {
    id: "phone",
    label: "Phone",
    type: "tel",
    svg: <Phone className=" fill-neutral-100 w-6 h-6" />,
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    svg: <Location className=" fill-neutral-100 w-6 h-6" />,
  },
  {
    id: "birth_date",
    label: "Birth Date",
    type: "date",
    svg: <Calendar className=" fill-neutral-100 w-6 h-6" />,
  },
];
const FormChangeInfo = ({
  infoUserProfile,
}: {
  infoUserProfile: UserProfile;
}) => {
  const [isPending, startTransition] = useTransition();

  const [formInfo, setFormInfo] = useState<Record<string, string>>({
    first_name: infoUserProfile.first_name || "",
    last_name: infoUserProfile.last_name || "",
    city: infoUserProfile.city || "",
    email: infoUserProfile.email || "",
    phone: infoUserProfile.phone || "",
    address: infoUserProfile.address || "",
    birth_date: infoUserProfile.birth_date || "",
    gender: infoUserProfile.gender || "",
  });

  const handleInputChange = (key: string, value: string) => {
    setFormInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await updateProfileUser(
          infoUserProfile.id,
          formInfo as unknown as UserProfile,
        );
        await supabase.auth.updateUser({
          data: {
            first_name: formInfo.first_name,
            last_name: formInfo.last_name,
          },
        });
        toast.success("Changes saved successfully");
      } catch (e) {
        toast.error("Error updating profile");
      }
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-12 gap-y-6 md:gap-y-8 gap-x-4"
      >
        {formFields.map((val) => {
          const isEmail = val.id === "email";

          const colClass = "col-span-12 md:col-span-6";

          if (val.type === "date") {
            return (
              <div key={val.id} className={colClass}>
                <DatePicker
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  selected={
                    formInfo[val.id] ? new Date(formInfo[val.id]) : null
                  }
                  onChange={(date: Date | null) =>
                    handleInputChange(
                      val.id,
                      date ? date.toISOString().split("T")[0] : "",
                    )
                  }
                  dateFormat="yyyy/MM/dd"
                  calendarClassName="!bg-neutral-800 !border-neutral-700 !rounded-xl !p-2 !shadow-2xl"
                  dayClassName={() =>
                    "hover:!bg-main/20 !rounded-lg !text-neutral-200 transition-colors"
                  }
                  popperClassName="z-50!"
                  onKeyDown={(e) => e.preventDefault()}
                  customInput={
                    <InputForm
                      label={val.label}
                      type="text"
                      placeholder="YYYY/MM/DD"
                      valueDefult={formInfo[val.id]}
                      svg={val.svg}
                      inputFild={() => {}}
                    />
                  }
                />
              </div>
            );
          }
          return (
            <div
              key={val.id}
              className={`${colClass} ${isEmail && "opacity-50"}`}
            >
              <InputForm
                inputFild={(value: string) => handleInputChange(val.id, value)}
                type={val.type}
                label={val.label}
                placeholder={val.label}
                svg={val.svg}
                valueDefult={formInfo[val.id]}
                disabled={isEmail}
              />
            </div>
          );
        })}

        <button
          type="submit"
          disabled={isPending}
          className={`col-span-12 md:col-span-6 cursor-pointer py-3.5 rounded-two transition-all font-bold mt-2 md:mt-0 ${
            isPending
              ? "bg-neutral-600 cursor-wait opacity-70"
              : "bg-main hover:bg-main/90 active:scale-[0.98] text-white shadow-lg shadow-main/20"
          }`}
        >
          {isPending ? "Submitting ..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default FormChangeInfo;
