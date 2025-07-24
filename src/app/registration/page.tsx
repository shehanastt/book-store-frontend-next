"use client"

import api from "@/api"
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { useState } from "react"
import Link from "next/link"

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Invalid email format"),
  role: yup.string().required("Role is required"),
  password: yup.string().min(6, "Must be at least 6 characters").required("Password is required"),
  image: yup
    .mixed()
    .test("fileRequired", "Image is required", (value) => {
      return value instanceof FileList && value.length > 0
    })
    .required("Image is required") as yup.Schema<FileList>,
})

type RegisterForm = {
  name: string,
  role: string,
  email: string,
  password: string,
  image: FileList
}

const Registration = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("role", data.role)
      formData.append("password", data.password)
      formData.append("image", data.image[0])

      const res = await api.post('/auth/register', formData)
      const token = res.data.token
      const user = res.data.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

      alert('Successfully registered')

      if (user.role === 'seller') {
        router.push('/books')
      } else if (user.role === 'buyer') {
        router.push('/books')
      } else {
        router.push('/')
      }
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: "url(/images/img1.jpg)",
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
        <h2 className="text-center text-3xl font-bold text-[#5c4433] mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-[#5c4433]">

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 rounded-lg bg-white/80 text-[#5c4433] focus:outline-none focus:ring-2 focus:ring-[#8b6e5c]"
            />
            <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 rounded-lg bg-white/80 text-[#5c4433] focus:outline-none focus:ring-2 focus:ring-[#8b6e5c]"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              {...register("role")}
              defaultValue=""
              className="w-full px-4 py-2 rounded-lg bg-white/80 text-[#5c4433] focus:outline-none focus:ring-2 focus:ring-[#8b6e5c]"
            >
              <option value="" disabled>Select Role</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
            <p className="text-red-500 text-sm mt-1">{errors.role?.message}</p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 rounded-lg bg-white/80 text-[#5c4433] focus:outline-none focus:ring-2 focus:ring-[#8b6e5c]"
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="w-full px-4 py-2 rounded-lg bg-white/80 text-[#5c4433] focus:outline-none"
            />
            <p className="text-red-500 text-sm mt-1">{errors.image?.message}</p>
          </div>

          {/* Submit Button */}
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-[#5c4433] text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="underline hover:text-[#3c2e23] transition">Login</a>
        </p>

        <p className="text-center text-[#5c4433] text-sm mt-2">
          {/* <a href="/" className="hover:underline">← Go to Home</a> */}
          <Link href={"/"}className="hover:underline">← Go to Home</Link>
        </p>
      </div>
    </div>
  )
}

export default Registration
