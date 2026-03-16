import { useNavigate } from "react-router-dom";
import { MapPin, Clock, ChevronRight, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { Task } from "@/types";
import { TaskStatusBadge, IssueBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function TaskCard({ task }: { task: Task }) {
  const navigate = useNavigate();
  const time = new Date(task.createdAt).toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "from-green-500 to-green-600";
      case "Accepted":
        return "from-blue-500 to-blue-600";
      case "Pending":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "High") return <AlertCircle className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  const statusIcon = {
    Completed: <CheckCircle2 className="w-5 h-5" />,
    Accepted: <Zap className="w-5 h-5" />,
    Pending: <Clock className="w-5 h-5" />,
  }[task.status];

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Status Bar */}
      <div className={`h-1 bg-gradient-to-r ${getStatusColor(task.status)}`} />

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${getStatusColor(
                  task.status
                )} flex items-center justify-center text-white flex-shrink-0`}
                whileHover={{ scale: 1.05 }}
              >
                {statusIcon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-gray-900 truncate">{task.filterId}</p>
                <div className="flex items-center gap-1 mt-0.5 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs truncate">{task.locationName}</span>
                </div>
              </div>
            </div>
          </div>
          <motion.div whileHover={{ x: 4 }}>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>

        {/* Issue and Priority */}
        <div className="flex items-center gap-2 flex-wrap">
          <IssueBadge type={task.issueType} />
          <motion.span
            className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
              task.priority === "High"
                ? "bg-red-100 text-red-700"
                : task.priority === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {getPriorityIcon(task.priority)}
            {task.priority} Priority
          </motion.span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <motion.button
            onClick={() => navigate(`/task/${task.taskId}`)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold text-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
