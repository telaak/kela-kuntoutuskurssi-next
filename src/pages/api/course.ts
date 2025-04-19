import type { NextApiRequest, NextApiResponse } from "next";
import type { Course } from "@prisma/client";
import { getCourses, prisma } from "@/prisma";
import { debouncedRevalidate } from "@/cloudflare";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "GET": {
      const courses = await getCourses();
      return res.json(courses);
    }
    case "POST": {
      if (req.query.postSecret !== global.process.env.POST_SECRET) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const course: Course = req.body;
      try {
        const upsert = await prisma.course.upsert({
          create: course,
          update: course,
          where: {
            id: course.id,
          },
        });
        debouncedRevalidate(res).catch(console.error);
        return res.status(201).json(upsert);
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    }
    default:
      return res.status(405).send("Invalid method");
  }
}
