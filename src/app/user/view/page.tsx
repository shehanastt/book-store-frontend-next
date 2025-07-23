"use client";

import api from "@/api";
import { UserType } from "@/types/userType";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ViewProfile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const parsed = JSON.parse(storedUser);
      if (!parsed._id) return;

      api
        .get(`/user/viewprofile`)
        .then((res) => {
          console.log("User data:", res.data.data);
          setUser(res.data.data);
        })
        .catch((err) => console.error(err));
    } catch (e) {
      console.error("Invalid user data in localstorage");
    }
  }, []);

  if (!user) {
    return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
  }

  return (
    <div
  className="min-h-screen flex items-center justify-center px-4 py-10"
  style={{
    backgroundImage: "url(/images/img5.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="bg-white/40 backdrop-blur-md border border-white/30 shadow-xl rounded-3xl p-8 w-full max-w-lg">
    <div className="flex flex-col items-center gap-3">
      <img
        src={
          user.image
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.image.replace(/\\/g, "/")}`
            : "/images/banner4.jpeg"
        }
        alt={user.name}
        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
      />
      <h2 className="text-3xl font-bold text-[#4e342e]">{user.name}</h2>
      <span className="text-sm text-[#6d4c41] capitalize tracking-wide">
        {user.role}
      </span>
    </div>

    <div className="my-6 h-px bg-[#d7ccc8]"></div>

    <div className="text-[#4e342e] space-y-3">
      <div className="flex items-start gap-2">
        <span className="font-semibold w-20">Email:</span>
        <span className="break-words text-sm">{user.email}</span>
      </div>
    </div>

    <div className="mt-8 flex justify-center gap-4">
      <button
        onClick={() => router.push(`/user/edit`)}
        className="px-5 py-2 bg-[#6f4e37] text-white rounded-lg shadow hover:bg-[#5d4037] transition-all duration-200"
      >
        Edit Profile
      </button>
      <button
        onClick={() => router.push("/books")}
        className="px-5 py-2 bg-white/70 text-[#5d4037] border border-[#d7ccc8] rounded-lg shadow hover:bg-white hover:text-[#3e2723] transition-all duration-200"
      >
        Go Back
      </button>
    </div>
  </div>
</div>

  );
};

export default ViewProfile;
