"use client";

import api from "@/api";
import { BookType } from "@/types/bookType";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const BookList = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
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
    router.push(`/books?page=${page}`)
  };

  return (
    <div
  className="min-h-screen bg-cover bg-center px-4 py-10 flex justify-center"
  style={{
    // backgroundImage: `url('/images/img7.jpg')`,
    backgroundColor: "#99760398"
  }}
>
  <div className="max-w-7xl w-full">
    {/* Book Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => {
        const imagePath = book.image?.replace(/\\/g, "/");
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`;

        return (
          <div
            key={book._id}
            className="backdrop-blur-md bg-white/20 shadow-xl rounded-2xl border border-white/30 overflow-hidden flex flex-col transition hover:shadow-2xl"
          >
            <div className="h-48 bg-white/30 flex items-center justify-center p-3">
              <img
                src={imageUrl}
                alt={book.title}
                className="max-h-full object-contain rounded-md"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between text-center">
              <div>
                <h3 className="text-lg font-semibold text-[#4e3b27] truncate">{book.title}</h3>
                <p className="text-sm text-[#6d5943] mt-1">{book.author}</p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => router.push(`/books/${book._id}`)}
                  className="text-sm px-4 py-1.5 border border-[#99760398] text-[#997603] rounded-lg bg-white/60 hover:bg-[#a27b5c]/80 hover:text-[#fff] transition shadow"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {books.length === 0 && (
        <div className="col-span-full text-center text-[#5e4a35] mt-10">
          <h5>Loading...</h5>
        </div>
      )}
    </div>

    {/* Pagination */}
    <div className="mt-10 flex justify-center space-x-2">
      {Array.from({ length: Math.ceil(totalBooks / limit) }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-3 py-1.5 text-sm rounded-lg shadow-sm transition font-medium ${
            currentPage === index + 1
              ? 'bg-[#997603] text-white'
              : 'bg-white/50 text-[#4e3b27] border border-[#99760344] hover:bg-white/70'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  </div>
</div>
);

};

export default BookList;
