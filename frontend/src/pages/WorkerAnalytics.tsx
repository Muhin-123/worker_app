import { useState, useMemo } from "react";
import { useTasks } from "@/context/TaskContext";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  Loader2,
  BarChart3,
  Activity,
  Award,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

export default function WorkerAnalytics() {
  const { tasks, loading } = useTasks();
  const { user } = useAuth();

  const analytics = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const accepted = tasks.filter((t) => t.status === "Accepted").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const total = tasks.length;
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
    const avgTimePerTask = completed > 0 ? "2.5" : "0";

    return {
      completed,
      accepted,
      pending,
      total,
      completionRate,
      avgTimePerTask,
      streak: 5,
    };
  }, [tasks]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 pb-24">
      {/* Header */}
      <PageHeader title="Analytics" />

      {/* Welcome Section */}
      <motion.div
        className="px-4 pt-6 max-w-lg mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name?.split(" ")[0] ?? "Technician"}! 📊
          </h1>
          <p className="text-sm text-gray-600 mt-1">Your work statistics and performance</p>
        </div>
      </motion.div>

      {/* Main Stats */}
      <motion.div
        className="px-4 mt-8 max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Performance Card */}
        <motion.div
          className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg mb-4"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-blue-100 mb-1">Completion Rate</p>
              <p className="text-4xl font-bold">{analytics.completionRate}%</p>
            </div>
            <motion.div
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
              whileHover={{ rotate: 20 }}
            >
              <TrendingUp className="w-6 h-6" />
            </motion.div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${analytics.completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Completed Tasks */}
          <motion.div
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-5 h-5 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Done</span>
            </div>
            <p className="text-3xl font-bold">{analytics.completed}</p>
            <p className="text-xs text-green-100 mt-1">Completed Tasks</p>
          </motion.div>

          {/* Active Tasks */}
          <motion.div
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Going</span>
            </div>
            <p className="text-3xl font-bold">{analytics.accepted}</p>
            <p className="text-xs text-purple-100 mt-1">Active Now</p>
          </motion.div>

          {/* Pending Tasks */}
          <motion.div
            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Queue</span>
            </div>
            <p className="text-3xl font-bold">{analytics.pending}</p>
            <p className="text-xs text-yellow-100 mt-1">Pending</p>
          </motion.div>

          {/* Streak */}
          <motion.div
            className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-4 text-white shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 opacity-80" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Fire</span>
            </div>
            <p className="text-3xl font-bold">{analytics.streak}</p>
            <p className="text-xs text-red-100 mt-1">Day Streak</p>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          className="mt-6 grid grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-gray-600">Total Assigned</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.total}</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <p className="text-xs text-gray-600">Avg Time</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.avgTimePerTask}h</p>
          </motion.div>
        </motion.div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
