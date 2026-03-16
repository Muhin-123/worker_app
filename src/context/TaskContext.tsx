import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task, TaskStatus } from "@/types";
import { db } from "@/firebase";
import { collection, onSnapshot, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  completeTask: (taskId: string, notes: string) => Promise<void>;
  getTask: (taskId: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "tasks"),
      where("assignedTechnicianId", "==", user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        taskId: doc.id,
      })) as Task[];
      setTasks(taskData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const taskRef = doc(db, "tasks", taskId);
    const updateData: any = { status };
    if (status === "Accepted") {
      updateData.acceptedAt = new Date().toISOString();
    }
    await updateDoc(taskRef, updateData);
  };

  const completeTask = async (taskId: string, _notes: string) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      status: "Completed",
      completedAt: new Date().toISOString(),
    });
  };

  const getTask = (taskId: string) => tasks.find((t) => t.taskId === taskId);

  return (
    <TaskContext.Provider value={{ tasks, loading, updateTaskStatus, completeTask, getTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be within TaskProvider");
  return ctx;
};
