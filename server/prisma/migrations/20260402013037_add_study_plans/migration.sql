-- CreateTable
CREATE TABLE "StudyPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "dailyGoal" INTEGER NOT NULL DEFAULT 25,
    "focusTopics" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studyPlanId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "questionsCompleted" INTEGER NOT NULL DEFAULT 0,
    "questionsCorrect" INTEGER NOT NULL DEFAULT 0,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "topicsCovered" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudyLog_studyPlanId_fkey" FOREIGN KEY ("studyPlanId") REFERENCES "StudyPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyLog_studyPlanId_date_key" ON "StudyLog"("studyPlanId", "date");
