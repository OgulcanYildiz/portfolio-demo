"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProjects() {
    return await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    });
}

import { createClient } from "@/lib/supabase/server";

export async function createProject(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const year = formData.get("year") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
        return { success: false, error: "Image is required" };
    }

    const supabase = await createClient();
    const uniqueId = Math.random().toString(36).substring(7);
    const filename = `${uniqueId}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, "")}`;

    const { data, error } = await supabase.storage
        .from("portfolio-assets")
        .upload(filename, imageFile, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error("Storage Error:", error);
        return { success: false, error: "Failed to upload image" };
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(filename);

    const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    try {
        await prisma.project.create({
            data: {
                title,
                description,
                thumbnail: publicUrl,
                category,
                year,
                slug,
            },
        });
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Database Error:", error);
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
