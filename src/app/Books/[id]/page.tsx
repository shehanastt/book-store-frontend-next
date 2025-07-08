"use client";

import api from "@/api";
import { BookType } from "@/types/bookType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ViewBook = () => {
  const params = useParams();
  const id = params?.id?.toString();
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/books/${id}`)
      .then((res) => setBook(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 text-lg">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-500 text-lg">Book not found.</p>
      </div>
    );
  }

  const imagePath = book.image?.replace(/\\/g, "/");
  const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt={book.title}
            className="w-full h-auto max-h-72 object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{book.title}</h2>
            <p className="text-gray-600 text-base md:text-lg mb-2">by {book.author}</p>
          </div>
          <p className="text-green-700 text-xl md:text-2xl font-semibold mt-4">₹{book.price}</p>
          <p className="text-gray-700 leading-relaxed mt-4">{book.description || "No description available."}</p>
        </div>

      </div>
    </div>
  );
};

export default ViewBook;
