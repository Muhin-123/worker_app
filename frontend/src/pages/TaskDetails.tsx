import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "@/context/TaskContext";
import PageHeader from "@/components/PageHeader";
import { TaskStatusBadge, IssueBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { MapPin, Thermometer, Droplets, Activity, Wifi, WifiOff, Clock, Loader2, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { FilterInfo } from "@/types";
import { motion } from "framer-motion";

export default function TaskDetails() {
  const { taskId } = useParams();
  const { getTask, updateTaskStatus } = useTasks();
  const navigate = useNavigate();
  const task = getTask(taskId!);
  const [filter, setFilter] = useState<FilterInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!task) return;

    const unsubscribe = onSnapshot(doc(db, "filters", task.filterId), (snapshot) => {
      if (snapshot.exists()) {
        setFilter(snapshot.data() as FilterInfo);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [task?.filterId]);

  if (!task) return <div className="p-8 text-center text-muted-foreground">Task not found</div>;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleAccept = async () => {
    try {
      await updateTaskStatus(task.taskId, "Accepted");
      toast.success("Task accepted");
      navigate("/active");
    } catch (error) {
      toast.error("Failed to accept task");
    }
  };

  const handleReject = async () => {
    try {
      await updateTaskStatus(task.taskId, "Rejected");
      toast.info("Task rejected");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to reject task");
    }
  };

  const time = new Date(task.createdAt).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const lastUpdated = filter?.lastUpdated
    ? new Date(filter.lastUpdated).toLocaleString("en-IN", {
        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
      })
    : "—";

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) => (
    <motion.div 
      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
      whileHover={{ x: 4 }}
    >
      <span className="text-sm text-gray-600 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-blue-500" />}{label}
      </span>
      <span className="text-sm font-bold text-gray-900 text-right">{value}</span>
    </motion.div>
  );

  const SensorBadge = ({ label, value, fault }: { label: string; value: string; fault?: boolean }) => (
    <motion.span 
      className={`text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 ${
        fault 
          ? "bg-red-100 text-red-700" 
          : "bg-green-100 text-green-700"
      }`}
      whileHover={{ scale: 1.05 }}
    >
      {fault ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
      {label}: {value}
    </motion.span>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 pb-6">
      <PageHeader title="Task Details" showBack />
      <motion.div 
        className="px-4 py-4 max-w-lg mx-auto space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status header */}
        <motion.div className="flex items-center gap-2 flex-wrap" variants={itemVariants}>
          <IssueBadge type={task.issueType} />
          <TaskStatusBadge status={task.status} />
          <motion.span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              task.priority === "High"
                ? "bg-red-100 text-red-700"
                : task.priority === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {task.priority} Priority
          </motion.span>
        </motion.div>

        {/* Filter Info */}
        <motion.section 
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" /> Filter Information
          </h3>
          <InfoRow label="Filter ID" value={task.filterId} />
          <InfoRow label="Location" value={task.locationName} icon={MapPin} />
          <InfoRow label="District" value={task.district} />
          <InfoRow label="Status" value={filter?.operationalStatus ?? "Unknown"} icon={filter?.operationalStatus === "Online" ? Wifi : WifiOff} />
        </motion.section>

        {/* Sensor Data */}
        {filter && (
          <motion.section 
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Sensor Data
            </h3>
            <InfoRow label="Temperature" value={`${filter.temperature}°C`} icon={Thermometer} />
            <InfoRow label="Flow Rate" value={`${filter.flowRate} L/min`} icon={Activity} />
            <InfoRow label="Water Used Today" value={`${filter.waterUsedToday} L`} icon={Droplets} />
            <div className="flex flex-wrap gap-2 mt-4">
              <SensorBadge label="Leakage" value={filter.leakageStatus} fault={filter.leakageStatus !== "Normal"} />
              <SensorBadge label="Hot Water" value={filter.hotWaterStatus} fault={filter.hotWaterStatus !== "Normal"} />
              <SensorBadge label="Cold Water" value={filter.coldWaterStatus} fault={filter.coldWaterStatus !== "Normal"} />
            </div>
            <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Last updated: {lastUpdated}
            </p>
          </motion.section>
        )}

        {/* Task Info */}
        <motion.section 
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">Task Information</h3>
          <p className="text-gray-700 font-medium mb-3">{task.description}</p>
          <InfoRow label="Assigned" value={time} icon={Clock} />
        </motion.section>

        {/* Actions */}
        <motion.div variants={itemVariants}>
          {task.status === "Pending" && (
            <div className="flex gap-3 pt-2">
              <motion.button
                onClick={handleAccept}
                className="flex-1 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-base hover:shadow-lg transition-all"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Accept Task
              </motion.button>
              <motion.button
                onClick={handleReject}
                className="flex-1 h-14 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-bold text-base hover:shadow-lg transition-all"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Reject Task
              </motion.button>
            </div>
          )}
          {task.status === "Accepted" && (
            <motion.button
              onClick={() => navigate(`/complete/${task.taskId}`)}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold text-base hover:shadow-lg transition-all"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Mark Work Completed
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
