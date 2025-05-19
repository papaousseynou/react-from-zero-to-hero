"use client";

import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onDeleteTask: (id: string) => Promise<void>;
  onUpdateTask: (
    id: string,
    data: { title: string; description: string; completed: boolean }
  ) => Promise<void>;
}

export default function TaskItem({
  task,
  onDeleteTask,
  onUpdateTask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await onUpdateTask(task.id, {
        title: task.title,
        description: task.description || "",
        completed: !task.completed,
      });
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      setIsLoading(true);
      try {
        await onDeleteTask(task.id);
      } catch (error) {
        console.error("Failed to delete task:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!title.trim()) return;
    setIsLoading(true);
    try {
      await onUpdateTask(task.id, {
        title,
        description,
        completed: task.completed,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-3">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            disabled={isLoading}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={isLoading}
              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm disabled:opacity-50"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle(task.title);
                setDescription(task.description || "");
                setIsEditing(false);
              }}
              disabled={isLoading}
              className="px-3 py-1 bg-gray-400 text-white rounded-md text-sm disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                disabled={isLoading}
              />
              <div>
                <p
                  className={`text-lg ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-500">{task.description}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
