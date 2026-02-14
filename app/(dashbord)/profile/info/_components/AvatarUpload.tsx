"use client";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { uploadAvatar } from "@/app/lib/storage";
import { useSeatStor } from "@/app/lib/useSeatStor";

export default function AvatarUpload({
  url,
  userId,
}: {
  url: string;
  userId: string;
}) {
  const [avatarUrl, setAvatarUrl] = useState(url);
  const [isPending, startTransition] = useTransition();
  const ToggleEditeProfile = useSeatStor((state) => state.setEditeProfile);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const newUrl = await uploadAvatar(userId, formData);

        setAvatarUrl(`${newUrl}?t=${new Date().getTime()}`);
        toast.success("تصویر با موفقیت تغییر کرد");
        ToggleEditeProfile(false);
      } catch (error) {
        console.log(error);

        toast.error("خطا در آپلود تصویر");
        setAvatarUrl(url);
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="relative w-32 h-32 overflow-hidden rounded-full border-4 border-neutral-700 bg-neutral-800">
        {avatarUrl ? (
          <Image
            unoptimized
            src={avatarUrl}
            alt="Avatar"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-500">
            No Image
          </div>
        )}

        {isPending && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <label className="cursor-pointer bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-lg text-sm transition-all">
        {isPending ? "در حال آپلود..." : "تغییر عکس پروفایل"}
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          disabled={isPending}
          accept="image/*"
        />
      </label>
    </div>
  );
}
