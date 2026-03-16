import { useTasks } from "@/context/TaskContext";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import { CheckCircle2, Clock, Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function CompletedTasks() {
  const { tasks, loading } = useTasks();
  const completed = tasks.filter((t) => t.status === "Completed");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 pb-24">
      <PageHeader title="Completed Tasks" />
      <motion.div 
        className="px-4 py-6 max-w-lg mx-auto space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {completed.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No completed tasks</p>
            <p className="text-sm text-gray-400 mt-1">Complete tasks to see them here</p>
          </motion.div>
        ) : (
          completed.map((task) => {
            const completedAt = task.completedAt
              ? new Date(task.completedAt).toLocaleString("en-IN", { 
                  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" 
                })
              : "—";
            return (
              <motion.div key={task.taskId} variants={itemVariants}>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  {/* Success bar */}
                  <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600" />

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-bold text-gray-900 truncate">{task.locationName}</p>
                            <p className="text-xs text-gray-600 truncate">{task.filterId} · {task.district}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 py-2 border-t border-gray-100">
                      <Clock className="w-4 h-4" />
                      <span>✓ Completed: {completedAt}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
      <BottomNav />
    </div>
  );
}
