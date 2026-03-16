import { useTasks } from "@/context/TaskContext";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import { IssueBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Clock, Loader2, Zap, CheckCircle2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ActiveTasks() {
  const { tasks, loading } = useTasks();
  const navigate = useNavigate();
  const active = tasks.filter((t) => t.status === "Accepted");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Active Tasks" />
      <div className="px-4 py-4 max-w-lg mx-auto space-y-3">
        {active.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No active tasks</p>
        )}
        {active.map((task) => {
          const time = new Date(task.createdAt).toLocaleString("en-IN", {
            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
          });
          return (
            <div key={task.taskId} className="bg-card rounded-xl border border-border p-4 shadow-sm animate-fade-in">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-foreground">{task.locationName}</p>
                  <p className="text-xs text-muted-foreground">{task.filterId} · {task.district}</p>
                </div>
                <IssueBadge type={task.issueType} />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{time}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate(`/task/${task.taskId}`)}>
                  View Filter Status
                </Button>
                <Button size="sm" onClick={() => navigate(`/complete/${task.taskId}`)}>
                  Mark Completed
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}
