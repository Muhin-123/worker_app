import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-cyan-500 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-3xl" />

      <motion.div
        className="w-full max-w-sm relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo and Title */}
        <motion.div className="flex flex-col items-center mb-10" variants={itemVariants}>
          <motion.div
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white to-blue-100 flex items-center justify-center mb-6 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Droplets className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-4xl font-bold text-white text-center">Water Service</h1>
          <p className="text-sm text-blue-100 mt-2 font-medium">Technician Portal</p>
          <p className="text-xs text-blue-100/70 mt-1">TN Smart Water Monitoring System</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl space-y-6"
          variants={itemVariants}
        >
          {/* Email Input */}
          <motion.div className="space-y-3" variants={itemVariants}>
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email Address
            </Label>
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="email"
                type="email"
                placeholder="you@tnwater.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 text-base bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors"
              />
            </motion.div>
          </motion.div>

          {/* Password Input */}
          <motion.div className="space-y-3" variants={itemVariants}>
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Password
            </Label>
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 text-base bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-colors pr-12"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </motion.div>
          )}

          {/* Login Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-base rounded-2xl shadow-lg disabled:opacity-70 transition-all"
              whileHover={{ y: -2, boxShadow: "0 12px 24px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ y: 0 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.div>

          {/* Demo Credentials Hint */}
          <motion.p
            className="text-center text-xs text-gray-500"
            variants={itemVariants}
          >
            Demo: use any email and password for testing
          </motion.p>
        </motion.form>

        {/* Footer */}
        <motion.p
          className="text-center text-xs text-white/70 mt-8 font-light"
          variants={itemVariants}
        >
          Government of Tamil Nadu — Smart Water Monitoring System
        </motion.p>
      </motion.div>
    </div>
  );
}
