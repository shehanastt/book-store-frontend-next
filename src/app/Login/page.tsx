"use client";

import api from "@/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useState } from "react";
import Link from "next/link";

const schema = yup.object().shape({
  email: yup.string().required("Email is required").email("Invalid email format"),
  password: yup.string().min(6, "Must be at least 6 characters").required("Password is required")
});

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const token = res.data.token;
      const user = res.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;

      alert('Login successful');

      router.push('/books');
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) { 
      console.error(err);
      alert(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: "url(/images/img6.jpg)",
        backgroundColor: "#e6d3c4"
      }}
    >
      <div
        className="backdrop-blur-md bg-white/20 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
        }}
      >
        <h2 className="text-center text-3xl font-bold text-[#5c4433] mb-6">Login to Your Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-[#5c4433] mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 rounded-lg bg-white/80 text-[#5c4433] focus:outline-none focus:ring-2 focus:ring-[#8b6e5c]"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5c4433] mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 rounded-lg bg-white/80 text-[#5c4433] focus:outline-none focus:ring-2 focus:ring-[#8b6e5c]"
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full text-white font-semibold transition duration-300"
            style={{
              backgroundColor: '#8b6e5c',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5c4433')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8b6e5c')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-[#5c4433] text-sm mt-4">
          Don&#39t have an account?{" "}
          <a href="/registration" className="underline hover:text-[#3c2e23] transition">Register</a>
        </p>

        <p className="text-center text-[#5c4433] text-sm mt-2">
          {/* <a href="/" className="hover:underline">← Go to Home</a> */}
          <Link href={"/"}className="hover:underline">← Go to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
