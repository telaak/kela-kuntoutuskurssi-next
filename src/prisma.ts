import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client
 * @const
 */

export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

/**
 * Logging the SQL queries, their parameters and the queryies' duration
 */

prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

export async function getCourses() {
  const courses = await prisma.course.findMany({
    orderBy: {
      startDate: "asc",
    },
  });
  return courses;
}
