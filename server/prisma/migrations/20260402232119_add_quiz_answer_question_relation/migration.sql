-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuizAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "QuizAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QuizAnswer" ("attemptId", "flagged", "id", "isCorrect", "questionId", "selectedAnswer", "timeSpent") SELECT "attemptId", "flagged", "id", "isCorrect", "questionId", "selectedAnswer", "timeSpent" FROM "QuizAnswer";
DROP TABLE "QuizAnswer";
ALTER TABLE "new_QuizAnswer" RENAME TO "QuizAnswer";
CREATE UNIQUE INDEX "QuizAnswer_attemptId_questionId_key" ON "QuizAnswer"("attemptId", "questionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
