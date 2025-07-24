"use client"

import api from "@/api";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from 'yup'

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  author: yup.string().required('Author is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  description: yup.string().required('Description is required'),
  image: yup
    .mixed()
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    .test('fileType', 'Unsupported file format', (value: any) => {
        return value && value[0] && ['image/jpeg', 'image/png', 'image/webp'].includes(value[0].type)})
    .required('Image is required') as yup.Schema<FileList>
});

export interface BookFormValues {
  title: string;
  author: string;
  price: number;
  description: string;
  image: FileList;
}


const AddBook = ()=> {
    const router = useRouter();

    const [preview, setPreview] = useState<string | null>(null);

    const { register, handleSubmit, formState: {errors}, reset, watch }= useForm<BookFormValues>({
        resolver: yupResolver(schema)
    });

    const imageWatch = watch('image');

    useEffect(() => {
    const file = imageWatch?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    } else {
        setPreview(null);
    }
    }, [imageWatch])

    const onSubmit = async ( data : BookFormValues )=>{
        const formData =  new FormData();
        formData.append('title', data.title);
        formData.append('author', data.author);
        formData.append('price', String(data.price));
        formData.append('description', data.description);
        formData.append('image', data.image[0] as File);

        try{
            const res = await api.post('/books/add', formData);
            alert('Book Added Successfully!');
            reset();
            setPreview(null);
            router.push('/books')
            console.log(res)
            
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Something went wrong!');
        }
    };

    return(
        <div
            style={{
            backgroundImage: "url(/images/img7.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        >
            <div className="py-10">
        <div className="max-w-2xl mx-auto p-8 bg-[#f7f1e8]/80 backdrop-blur-md rounded-2xl shadow-xl border border-[#cbbfa7]">
        <h1 className="text-3xl font-semibold text-center text-[#5a4322] mb-8">
            Add New Book
        </h1>

        <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-6"
        >
            {/* Title */}
            <div>
            <label className="block text-[#6e5842] font-medium mb-2">Title</label>
            <input
                {...register("title")}
                placeholder="Enter book title"
                className="w-full px-4 py-2 rounded-md border border-[#cbbfa7] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#b89c6b]"
            />
            {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
            </div>

            {/* Author */}
            <div>
            <label className="block text-[#6e5842] font-medium mb-2">Author</label>
            <input
                {...register("author")}
                placeholder="Enter author name"
                className="w-full px-4 py-2 rounded-md border border-[#cbbfa7] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#b89c6b]"
            />
            {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
            )}
            </div>

            {/* Description */}
            <div>
            <label className="block text-[#6e5842] font-medium mb-2">
                Description
            </label>
            <input
                {...register("description")}
                placeholder="Enter the description"
                className="w-full px-4 py-2 rounded-md border border-[#cbbfa7] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#b89c6b]"
            />
            {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
                </p>
            )}
            </div>

            {/* Price */}
            <div>
            <label className="block text-[#6e5842] font-medium mb-2">Price</label>
            <input
                {...register("price")}
                type="number"
                placeholder="Enter price"
                className="w-full px-4 py-2 rounded-md border border-[#cbbfa7] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#b89c6b]"
            />
            {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
            </div>

            {/* Image Upload */}
            <div>
            <label className="block text-[#6e5842] font-medium mb-2">Image</label>

            <label
                htmlFor="image-upload"
                className="inline-block px-4 py-2 bg-[#8b6f4c] text-white rounded-md cursor-pointer hover:bg-[#a18460] transition duration-300"
            >
                Choose Image
            </label>

            <input
                id="image-upload"
                type="file"
                {...register("image")}
                accept="image/*"
                className="hidden"
            />
            </div>

            {preview && (
            <div className="mt-4 w-full max-w-xs h-48 rounded-lg overflow-hidden shadow-md border border-gray-300 bg-transparent">
                <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain p-2"
                />
            </div>
            )}
            <button
            type="submit"
            className="w-full bg-[#5a4322] hover:bg-[#7d6240] text-white font-medium py-2 rounded-md transition duration-300"
            >
            Add Book
            </button>
        </form>
        </div>
        </div>
    </div>

    )
}

export default AddBook;