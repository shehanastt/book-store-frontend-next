"use client";

import api from "@/api";
import ConfirmDialog from "@/components/ConfirmDialog";
import { BookType } from "@/types/bookType";
import { Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ViewBook = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id?.toString();
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user?.role);
    }

    api
      .get(`/books/${id}`)
      .then((res) => setBook(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async (id: string) => {
    try {
      await api.patch(`/books/${id}`);
      router.push("/books");
      console.log("Deleted!");
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-stone-300 text-lg">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-400 text-lg">Book not found.</p>
      </div>
    );
  }

  const imagePath = book.image?.replace(/\\/g, "/");
  const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`;

  return (
    <div className="min-h-screen  py-10 px-4 font-sans bg-cover bg-center"
    style={{backgroundImage: "url(/images/img4.jpg)"}}>
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden md:flex transition duration-300">
        {/* Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white/5">
          <img
            src={imageUrl}
            alt={book.title}
            className="w-full h-auto max-h-80 object-contain rounded-lg shadow"
          />
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between text-stone-200">
          <div>
            <h2 className="text-3xl font-bold text-stone-100 mb-2">{book.title}</h2>
            <p className="text-stone-300 text-lg mb-2">by {book.author}</p>
            <p className="text-stone-100 text-xl font-semibold mt-2">₹{book.price}</p>
            <p className="text-stone-300 mt-4 text-sm leading-relaxed">
              {book.description || "No description available."}
            </p>
          </div>

          {userRole === "seller" && (
            <>
              <div className="mt-6 flex gap-4 flex-wrap">
                <button
                  onClick={() => router.push(`/books/edit/${id}`)}
                  className="bg-[#a27b5c] hover:bg-[#fff]/80 text-white hover:text-[#a27b5c] px-5 py-2 rounded-lg transition-all duration-200 shadow-sm"
                >
                  Edit Book
                </button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setOpen(true)}
                  sx={{
                    borderColor: "#cf7226ff",
                    color: "#cf7226ff",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#cf7226ff",
                    },
                  }}
                >
                  Delete Book
                </Button>

                <ConfirmDialog
                  open={open}
                  title="Delete Book"
                  message="Are you sure you want to delete the book?"
                  onClose={() => setOpen(false)}
                  onConfirm={() => handleDelete(book._id)}
                  confirmText="Delete"
                  cancelText="Cancel"
                />
              </div>
            </>
          )}

          <div className="mt-6">
            <button
              onClick={() => router.push("/books")}
              className="text-stone-300 underline hover:text-white text-sm transition"
            >
              ← Back to Books
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBook;
