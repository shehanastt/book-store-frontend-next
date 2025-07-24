"use client";

import api from "@/api";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from 'yup'

const schema = yup.object().shape({
  title: yup.string().required(),
  author: yup.string().required(),
  price: yup.number().required(),
  description: yup.string().required(),
  image: yup.mixed().notRequired() as yup.Schema<FileList>
})

export interface BookFormValues {
  title: string;
  author: string;
  price: number;
  description: string;
  image: FileList;
}

const EditBook = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id?.toString();
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookFormValues>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (!id) return;
    api
      .get(`/books/${id}`)
      .then((res) => {
        const { title, author, price, description, image } = res.data.data;
        reset({ title, author, price, description });
        if (image) {
        setImagePreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`);
      }
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch product details");
      });
  }, [id, reset]);

  const onSubmit = async (data: BookFormValues) => {
    console.log(data,"data")
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("price", String(data.price));

    if (data.description) {
      formData.append("description", data.description);
    }

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    api
      .patch(`/books/edit/${id}`, formData)
      .then(() => {
        alert("Book updated successfully");
        router.push("/books");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update the book");
      });
  };

  return (
    <div
  style={{
    backgroundImage: "url(/images/img7.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
  className="min-h-screen flex items-center justify-center px-4"
>
  <div className="max-w-2xl w-full mt-12 p-10 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl border border-[#cbbfa7]">
    <h2 className="text-4xl font-bold text-center text-[#5a4322] mb-10 tracking-wide">
      Edit Book
    </h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[#5a4322]">
      {/* Title */}
      <div>
        <label className="block font-medium mb-2 text-lg">Title</label>
        <input
          type="text"
          placeholder="Book title"
          {...register("title")}
          className="w-full px-4 py-2 rounded-md border border-[#cbbfa7] bg-white/60 text-[#3a2a16] placeholder-[#a08d77] focus:outline-none focus:ring-2 focus:ring-[#b89c6b] transition"
        />
        <p className="text-red-500 text-sm mt-1">{errors.title?.message}</p>
      </div>

      {/* Author */}
      <div>
        <label className="block font-medium mb-2 text-lg">Author</label>
        <input
          type="text"
          placeholder="Author name"
          {...register("author")}
          className="w-full px-4 py-2 rounded-md border border-[#cbbfa7] bg-white/60 text-[#3a2a16] placeholder-[#a08d77] focus:outline-none focus:ring-2 focus:ring-[#b89c6b] transition"
        />
        <p className="text-red-500 text-sm mt-1">{errors.author?.message}</p>
      </div>

      {/* Price */}
      <div>
        <label className="block font-medium mb-2 text-lg">Price</label>
        <input
          type="number"
          placeholder="Book price"
          {...register("price")}
          className="w-full px-4 py-2 rounded-md border border-[#cbbfa7] bg-white/60 text-[#3a2a16] placeholder-[#a08d77] focus:outline-none focus:ring-2 focus:ring-[#b89c6b] transition"
        />
        <p className="text-red-500 text-sm mt-1">{errors.price?.message}</p>
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-2 text-lg">Description</label>
        <textarea
          placeholder="Short description"
          {...register("description")}
          className="w-full px-4 py-2 rounded-md border border-[#cbbfa7] bg-white/60 text-[#3a2a16] placeholder-[#a08d77] focus:outline-none focus:ring-2 focus:ring-[#b89c6b] transition"
        />
        <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block font-medium mb-2 text-lg">Image</label>

        <label
          htmlFor="image-upload"
          className="inline-block px-4 py-2 bg-[#5a4322] text-white rounded-md cursor-pointer hover:bg-[#7d6240] transition duration-300"
        >
          Choose Image
        </label>

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={(e) => {
            register("image").onChange(e);
            const file = e.target.files?.[0];
            if (file) {
              setImagePreview(URL.createObjectURL(file));
            }
          }}
          className="hidden"
        />

        {imagePreview && (
        <div className="mt-4 w-48 h-48 relative">
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover rounded-lg border border-[#cbbfa7]"
            unoptimized 
          />
        </div>
        )} 
        <p className="text-red-500 text-sm mt-1">{errors.image?.message}</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#5a4322] hover:bg-[#7d6240] text-white font-semibold py-2.5 rounded-md transition duration-300 tracking-wide"
      >
        Update Book
      </button>
    </form>
  </div>
</div>
  );
};

export default EditBook;