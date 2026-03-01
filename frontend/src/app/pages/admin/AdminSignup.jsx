// frontend/src/app/pages/admin/AdminSignup.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function AdminSignup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignup = (e) => {

    e.preventDefault();

    if (!name || !email || !password) {

      toast.error("Please fill all fields");

      return;

    }

    // ✅ Save fake admin
    const adminData = {

      name,

      email,

      role: "admin"

    };

    localStorage.setItem("admin", JSON.stringify(adminData));

    toast.success("Admin account created successfully");

    // Redirect to admin dashboard
    navigate("/admin");

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-6 text-center">

          Admin Sign Up

        </h2>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />

          <Button type="submit" className="w-full">

            Create Admin Account

          </Button>

        </form>

        <p className="mt-4 text-center text-sm text-gray-600">

          Already have an account?

          <Link
            to="/admin-login"
            className="text-blue-600 hover:underline"
          >

            Login

          </Link>

        </p>

      </div>

    </div>

  );

}
