"use client"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import api from "@/api";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  email: string;
  image: FileList;
};

const EditProfile = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [hasExistingImage, setHasExistingImage] = useState(false);
  const router = useRouter();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      image: yup
        .mixed()
        .test("fileRequired", "Image is required", (value) => {
          if (hasExistingImage) return true;
          return value instanceof FileList && value.length > 0;
        })
    }) as yup.ObjectSchema<FormData>;
  }, [hasExistingImage]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsed = JSON.parse(storedUser);

    if (parsed._id) {
      api.get(`/user/viewprofile`)
        .then((res) => {
          const userData = res.data.data;

          reset({
            name: userData.name,
            email: userData.email,
          });

          if (userData.image) {
            const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${userData.image.replace(/\\/g, "/")}`;
            setPreview(imageUrl);
            setHasExistingImage(true); 
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        });
    }
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      await api.patch(`/user/edit/editprofile`, formData);
      alert("Profile updated successfully");
      router.push("/user/view");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setHasExistingImage(false); 
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        backgroundImage: "url(/images/img5.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-center items-center">
      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#6b4c3b]">
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 relative mb-2">
              <Image
                src={preview || "/default-avatar.png"}
                alt="Profile Preview"
                fill
                className="rounded-full object-cover border border-gray-300"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={handleImageChange}
              className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:border-0 file:bg-[#d5bdaf] file:text-white file:rounded-md cursor-pointer"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-[#6b4c3b] font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b08968] bg-white"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#6b4c3b] font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b08968] bg-white"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-[#7f5539] text-white py-2 rounded-lg hover:bg-[#6b4c3b] transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default EditProfile;

