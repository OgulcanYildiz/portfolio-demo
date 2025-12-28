"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProjects() {
    return await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function createProject(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string; // in a real app, handle upload
    const category = formData.get("category") as string;
    const year = formData.get("year") as string;
    const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    try {
        await prisma.project.create({
            data: {
                title,
                description,
                thumbnail: imageUrl,
                category,
                year,
                slug,
            },
        });
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to create project:", error);
        return { success: false, error: "Failed to create project" };
    }
}

export async function deleteProject(id: string) {
    try {
        await prisma.project.delete({
            where: { id },
        });
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete project" };
    }
}
