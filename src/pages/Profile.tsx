import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone, MapPin, Shield, LogOut, Radio, ZapOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, logout, updateAvailability } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <motion.div 
      className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
      whileHover={{ x: 4 }}
    >
      <Icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-xs text-gray-600 font-medium">{label}</p>
        <p className="text-sm font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );

  const initials = user.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 pb-24">
      <PageHeader title="Profile" />
      <motion.div 
        className="px-4 py-6 max-w-lg mx-auto space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar & Name */}
        <motion.div 
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-center text-white shadow-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-4xl font-bold text-white">{initials}</span>
          </motion.div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-blue-100 mt-1">{user.role}</p>
        </motion.div>

        {/* Info Cards */}
        <motion.div 
          className="bg-white rounded-2xl border border-gray-200 px-5 py-4 shadow-sm"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h3>
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Phone} label="Phone" value={user.phone} />
          <InfoRow icon={MapPin} label="District" value={user.district} />
          <InfoRow icon={Shield} label="Role" value={user.role} />
        </motion.div>

        {/* Availability Status */}
        <motion.div 
          className={`rounded-2xl p-5 shadow-sm border-2 transition-all ${
            user.availability === "Available"
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              : "bg-gradient-to-br from-red-50 to-pink-50 border-red-200"
          }`}
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.availability === "Available" ? (
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Radio className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <ZapOff className="w-6 h-6" />
                </div>
              )}
              <div>
                <p className={`text-sm font-bold ${
                  user.availability === "Available" ? "text-green-900" : "text-red-900"
                }`}>Availability Status</p>
                <p className={`text-xs ${
                  user.availability === "Available" ? "text-green-700" : "text-red-700"
                }`}>
                  {user.availability === "Available" 
                    ? "✓ Available for new tasks" 
                    : "✗ Marked as busy"}
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => updateAvailability(user.availability === "Available" ? "Busy" : "Available")}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                user.availability === "Available"
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user.availability === "Available" ? "Go Offline" : "Go Online"}
            </motion.button>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="w-full h-14 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-bold text-base hover:shadow-lg transition-all flex items-center justify-center gap-2"
          variants={itemVariants}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </motion.button>
      </motion.div>
      <BottomNav />
    </div>
  );
}
