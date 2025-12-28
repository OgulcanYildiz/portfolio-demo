"use client";

import { useState } from "react";
import { createProject, deleteProject } from "@/actions/projects";

interface Project {
    id: string;
    slug: string;
    title: string;
    category: string;
    year: string;
    thumbnail: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Props {
    initialProjects: Project[];
}

export default function AdminDashboard({ initialProjects }: Props) {
    const [projects, setProjects] = useState(initialProjects);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        setLoading(true);
        const result = await deleteProject(id);
        if (result.success) {
            setProjects(projects.filter((p) => p.id !== id));
        } else {
            alert("Failed to delete project");
        }
        setLoading(false);
    };

    const handleCreate = async (formData: FormData) => {
        setLoading(true);
        const result = await createProject(formData);
        if (result.success) {
            setIsAdding(false);
            // Refresh the page to get new data
            window.location.reload();
        } else {
            alert("Failed to create project");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/" className="w-10 h-10">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </a>
                        <h1 className="text-xl font-semibold tracking-wide">
                            Admin Dashboard
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span className="text-lg">+</span>
                        Add Project
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-light text-white/60">
                        Projects ({projects.length})
                    </h2>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                        >
                            {/* Thumbnail */}
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <span className="text-xs text-purple-400 uppercase tracking-wider">
                                        {project.category}
                                    </span>
                                    <h3 className="text-lg font-medium text-white truncate">
                                        {project.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-4">
                                <p className="text-sm text-white/50 line-clamp-2 mb-4">
                                    {project.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-white/30">
                                        {project.year}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        disabled={loading}
                                        className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-white/40 text-lg">No projects yet.</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                        >
                            Add Your First Project
                        </button>
                    </div>
                )}
            </main>

            {/* Add Project Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 rounded-2xl p-8 w-full max-w-lg border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-semibold mb-6">Add New Project</h2>
                        <form action={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-2">
                                    Title
                                </label>
                                <input
                                    name="title"
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                                    placeholder="Project Title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none"
                                    placeholder="Project description..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                                    >
                                        <option value="Collection">Collection</option>
                                        <option value="Showcase">Showcase</option>
                                        <option value="Detail">Detail</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">
                                        Year
                                    </label>
                                    <input
                                        name="year"
                                        required
                                        defaultValue={new Date().getFullYear().toString()}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-2">
                                    Image URL
                                </label>
                                <input
                                    name="imageUrl"
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
