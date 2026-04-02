-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stem" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "explanationA" TEXT NOT NULL DEFAULT '',
    "explanationB" TEXT NOT NULL DEFAULT '',
    "explanationC" TEXT NOT NULL DEFAULT '',
    "explanationD" TEXT NOT NULL DEFAULT '',
    "examTip" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "subtopic" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "bennerStage" TEXT NOT NULL,
    "clinicalReasoningObj" TEXT NOT NULL DEFAULT '',
    "questionType" TEXT NOT NULL DEFAULT 'standard',
    "clinicalTopic" TEXT NOT NULL DEFAULT '',
    "pharmacologyFocus" TEXT NOT NULL DEFAULT '',
    "bennerBreakdown" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Question" ("bennerStage", "category", "clinicalReasoningObj", "correctAnswer", "createdAt", "difficulty", "examTip", "explanationA", "explanationB", "explanationC", "explanationD", "id", "isActive", "optionA", "optionB", "optionC", "optionD", "rationale", "stem", "subtopic", "updatedAt") SELECT "bennerStage", "category", "clinicalReasoningObj", "correctAnswer", "createdAt", "difficulty", "examTip", "explanationA", "explanationB", "explanationC", "explanationD", "id", "isActive", "optionA", "optionB", "optionC", "optionD", "rationale", "stem", "subtopic", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
