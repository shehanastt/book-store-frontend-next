"use client";

import api from "@/api";
import { BookType } from "@/types/bookType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BookList = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const router = useRouter();
  const limit = 8;

  useEffect(() => {
    api.get(`/books/list?page=${currentPage}&limit=${limit}`)
      .then((res) => {
        setBooks(res.data.data);
        setTotalBooks(res.data.total);
      })
      .catch(console.error);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => {
            const imagePath = book.image?.replace(/\\/g, "/");
            const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`;

            return (
              <div
                key={book._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden"
              >
                <div className="h-48 flex items-center justify-center bg-gray-100 p-2">
                  <img
                    src={imageUrl}
                    alt={book.title}
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-md font-semibold text-center text-gray-800 truncate">{book.title}</h3>
                    <p className="text-sm text-gray-500 text-center mt-1">{book.author}</p>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => router.push(`/Books/${book._id}`)}
                      className="text-sm px-4 py-1.5 border rounded-md text-gray-700 border-gray-400 hover:bg-gray-100 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {books.length === 0 && (
            <div className="col-span-full text-center text-gray-500 mt-10">
              <h5>No books available.</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;
