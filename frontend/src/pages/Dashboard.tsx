import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import TaskCard from "@/components/TaskCard";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Wrench,
  Loader2,
  Radio,
  Zap,
  Calendar,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const statCards = [
  { key: "total", label: "Total Assigned", icon: ClipboardList, color: "from-blue-500 to-blue-600" },
  { key: "pending", label: "Pending", icon: Clock, color: "from-yellow-500 to-orange-500" },
  { key: "accepted", label: "Accepted", icon: Wrench, color: "from-purple-500 to-purple-600" },
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "from-green-500 to-green-600" },
] as const;

export default function Dashboard() {
  const { tasks, loading } = useTasks();
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  const counts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "Pending").length,
    accepted: tasks.filter((t) => t.status === "Accepted").length,
    completed: tasks.filter((t) => t.status === "Completed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 pb-24">
      {/* Header */}
      <PageHeader title="" />

      {/* Welcome Section */}
      <motion.div
        className="px-4 pt-6 max-w-lg mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hello, {user?.name?.split(" ")[0] ?? "Technician"}! 👋
            </h1>
            <p className="text-sm text-gray-600 mt-1">Ready for today's tasks?</p>
          </div>
        </div>
      </motion.div>

      {/* Status Card */}
      <motion.div
        className="px-4 mt-6 max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-blue-100">Current Status</p>
                <p className="text-lg font-bold">{isAvailable ? "Available" : "Busy"}</p>
              </div>
            </div>
            <motion.button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                isAvailable
                  ? "bg-green-400 text-green-900 hover:bg-green-300"
                  : "bg-red-400 text-red-900 hover:bg-red-300"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              Toggle
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="px-4 mt-8 max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-2 gap-4">
          {statCards.map(({ key, label, icon: Icon, color }, idx) => (
            <motion.div
              key={key}
              className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg overflow-hidden relative`}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background glow effect */}
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {((counts[key] / (counts.total || 1)) * 100).toFixed(0)}%
                  </span>
                </div>
                <motion.p
                  className="text-4xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  {counts[key]}
                </motion.p>
                <p className="text-sm font-medium text-white/90 mt-2">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tasks Section */}
      <motion.div
        className="px-4 mt-10 max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Assigned Tasks</h2>
              <p className="text-xs text-gray-500 mt-1">
                {tasks.filter((t) => t.status !== "Completed").length} tasks waiting
              </p>
            </div>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>

        <div className="space-y-3">
          {tasks.filter((t) => t.status !== "Completed").length > 0 ? (
            tasks
              .filter((t) => t.status !== "Completed")
              .map((task, idx) => (
                <motion.div
                  key={task.taskId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))
          ) : (
            <motion.div
              className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-green-700 font-semibold">All caught up! 🎉</p>
              <p className="text-sm text-green-600 mt-1">No pending tasks at the moment</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
