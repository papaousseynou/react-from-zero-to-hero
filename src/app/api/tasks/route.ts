import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Code pour recevoir les tâches
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des tâches" },
      { status: 500 }
    );
  }
}

// Code pour poster des tâches
export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Le titre est obligatoire." },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la tâche :", error);
    return NextResponse.json(
      { error: "Échec de la création de la tâche." },
      { status: 500 }
    );
  }
}

// Mettre à jour la tâche
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, completed } = await request.json();

    const updatedTask = await prisma.task.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        completed,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche :", error);
    return NextResponse.json(
      { error: "Échec de la mise à jour de la tâche" },
      { status: 500 }
    );
  }
}

// Supprimer la tâche
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error);
    return NextResponse.json(
      { error: "Échec de la suppression de la tâche" },
      { status: 500 }
    );
  }
}
