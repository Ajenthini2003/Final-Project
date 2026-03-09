import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Mail, Lock, User, Loader2, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminSignup() {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email format";
    if (!phone.trim()) errs.phone = "Phone is required";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      toast.info("Admin accounts must be created by a system administrator or via seed scripts. Please use the admin login instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Admin Registration</CardTitle>
          <CardDescription className="text-gray-600">
            Admin accounts are managed by system administrators
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <p className="text-sm text-amber-800 text-center font-medium">
              Admin accounts are created via the seed scripts or by an existing admin. Please contact your system administrator for access.
            </p>
          </div>

          <div className="text-center">
            <Link to="/admin-login">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white">
                Go to Admin Login
              </Button>
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 border-t pt-6">
          <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors">
            ← Return to User Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
