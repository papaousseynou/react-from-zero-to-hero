"use client";
import { useState } from "react";

interface TaskFormProps {
  onAddTask: (title: string, description: string) => Promise<void>;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddTask(title, description);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Échec de l'ajout de la tâche :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Titre
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ajouter une nouvelle tâche"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description (optionnelle)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Description de la tâche"
          rows={3}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? "Ajout en cours..." : "Ajouter la tâche"}
      </button>
    </form>
  );
}
