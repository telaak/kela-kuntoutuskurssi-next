-- CreateTable
CREATE TABLE "Course" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "illness" TEXT NOT NULL,
    "targetGroup" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "spotsAvailable" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
