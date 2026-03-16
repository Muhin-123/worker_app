import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "@/context/TaskContext";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, CheckCircle2, FileText, Image } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function WorkCompletion() {
  const { taskId } = useParams();
  const { getTask, completeTask } = useTasks();
  const navigate = useNavigate();
  const task = getTask(taskId!);
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!task) return <div className="p-8 text-center text-muted-foreground">Task not found</div>;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await completeTask(task.taskId, notes);
      toast.success("Task marked as completed!");
      navigate("/completed");
    } catch (error) {
      toast.error("Failed to complete task");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 pb-6">
      <PageHeader title="Complete Work" showBack />
      <motion.div 
        className="px-4 py-4 max-w-lg mx-auto space-y-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Task Summary */}
        <motion.div 
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-blue-100">Completing</p>
              <p className="text-lg font-bold">{task.locationName}</p>
              <p className="text-xs text-blue-100 mt-0.5">{task.filterId} · {task.issueType}</p>
            </div>
          </div>
        </motion.div>

        {/* Completion Notes */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <Label className="text-base font-bold text-gray-900 m-0">Completion Notes</Label>
          </div>
          <Textarea
            id="notes"
            placeholder="Describe the work performed, parts replaced, observations, any issues encountered..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            className="text-base bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl p-4"
          />
        </motion.div>

        {/* Photo Upload */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-5 h-5 text-blue-600" />
            <Label className="text-base font-bold text-gray-900 m-0">Photo (Optional)</Label>
          </div>
          <motion.label 
            className={`flex flex-col items-center justify-center gap-3 h-32 border-3 border-dashed rounded-2xl cursor-pointer transition-colors ${
              photo 
                ? "border-green-400 bg-green-50" 
                : "border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-400"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            {photo ? (
              <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-green-700">{photo.name}</p>
              </motion.div>
            ) : (
              <>
                <Camera className="w-8 h-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Tap to capture photo</span>
                <span className="text-xs text-gray-500">or upload from gallery</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </motion.label>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Mark as Completed
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
