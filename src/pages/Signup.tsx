import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Toaster, toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { SignupSchema } from "../schema";



const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(SignupSchema)
  });

  const onSubmit = (data: any) => {
    const users = JSON.parse(localStorage.getItem("wallet_users") || "[]");

    if (users.some((u: any) => u.email === data.email)) {
      toast.error("Email already exists");
      return;
    }

    const newUser = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      password: data.password,
    };

    users.push(newUser);
    localStorage.setItem("wallet_users", JSON.stringify(users));
    localStorage.setItem("wallet_currentUser", JSON.stringify(newUser));
    setCurrentUser(newUser);
    toast.success("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50">
      <Toaster position="top-center" richColors />
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;