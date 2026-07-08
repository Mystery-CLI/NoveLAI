-- CreateEnum
CREATE TYPE "StateChangeType" AS ENUM ('realm_change', 'faction_change', 'status_change', 'relationship_change');

-- CreateEnum
CREATE TYPE "ForeshadowRevealStatus" AS ENUM ('planted', 'hinted', 'partially_revealed', 'confirmed');

-- CreateEnum
CREATE TYPE "FindingType" AS ENUM ('rule_violation', 'state_contradiction', 'tier_skip', 'foreshadow_exposure', 'continuity_break');

-- CreateEnum
CREATE TYPE "FindingSeverity" AS ENUM ('violation', 'warning', 'info');

-- CreateEnum
CREATE TYPE "Confidence" AS ENUM ('high', 'medium', 'low');

-- CreateTable
CREATE TABLE "CultivationTier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "CultivationTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactionRelation" (
    "id" TEXT NOT NULL,
    "factionAId" TEXT NOT NULL,
    "factionBId" TEXT NOT NULL,
    "standing" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "FactionRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT,
    "notes" TEXT,
    "cultivationTierId" TEXT,
    "factionId" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterStateChange" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "changeType" "StateChangeType" NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT NOT NULL,
    "evidenceQuote" TEXT,
    "relatedCharacterId" TEXT,
    "chapterId" TEXT,
    "proposedStateChangeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharacterStateChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibleRule" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isHardRule" BOOLEAN NOT NULL DEFAULT false,
    "characterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BibleRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleRule" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StyleRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForeshadowItem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "revealStatus" "ForeshadowRevealStatus" NOT NULL DEFAULT 'planted',
    "intendedReveal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForeshadowItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForeshadowItemCharacter" (
    "foreshadowItemId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "ForeshadowItemCharacter_pkey" PRIMARY KEY ("foreshadowItemId","characterId")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "endingStateNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsistencyReport" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "insufficientContext" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rawResponse" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsistencyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "type" "FindingType" NOT NULL,
    "severity" "FindingSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "evidenceQuote" TEXT NOT NULL,
    "relatedRuleOrCharacter" TEXT,
    "confidence" "Confidence" NOT NULL,

    CONSTRAINT "Finding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposedStateChange" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "changeType" "StateChangeType" NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT NOT NULL,
    "evidenceQuote" TEXT NOT NULL,
    "confidence" "Confidence" NOT NULL,
    "applied" BOOLEAN NOT NULL DEFAULT false,
    "appliedAt" TIMESTAMP(3),

    CONSTRAINT "ProposedStateChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CultivationTier_name_key" ON "CultivationTier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CultivationTier_orderIndex_key" ON "CultivationTier"("orderIndex");

-- CreateIndex
CREATE INDEX "CultivationTier_orderIndex_idx" ON "CultivationTier"("orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Faction_name_key" ON "Faction"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FactionRelation_factionAId_factionBId_key" ON "FactionRelation"("factionAId", "factionBId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterStateChange_proposedStateChangeId_key" ON "CharacterStateChange"("proposedStateChangeId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_number_key" ON "Chapter"("number");

-- AddForeignKey
ALTER TABLE "FactionRelation" ADD CONSTRAINT "FactionRelation_factionAId_fkey" FOREIGN KEY ("factionAId") REFERENCES "Faction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactionRelation" ADD CONSTRAINT "FactionRelation_factionBId_fkey" FOREIGN KEY ("factionBId") REFERENCES "Faction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_cultivationTierId_fkey" FOREIGN KEY ("cultivationTierId") REFERENCES "CultivationTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStateChange" ADD CONSTRAINT "CharacterStateChange_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStateChange" ADD CONSTRAINT "CharacterStateChange_relatedCharacterId_fkey" FOREIGN KEY ("relatedCharacterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStateChange" ADD CONSTRAINT "CharacterStateChange_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStateChange" ADD CONSTRAINT "CharacterStateChange_proposedStateChangeId_fkey" FOREIGN KEY ("proposedStateChangeId") REFERENCES "ProposedStateChange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleRule" ADD CONSTRAINT "BibleRule_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForeshadowItemCharacter" ADD CONSTRAINT "ForeshadowItemCharacter_foreshadowItemId_fkey" FOREIGN KEY ("foreshadowItemId") REFERENCES "ForeshadowItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForeshadowItemCharacter" ADD CONSTRAINT "ForeshadowItemCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsistencyReport" ADD CONSTRAINT "ConsistencyReport_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "ConsistencyReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposedStateChange" ADD CONSTRAINT "ProposedStateChange_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "ConsistencyReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
