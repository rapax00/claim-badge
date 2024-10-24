-- CreateTable
CREATE TABLE "Nonce" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "definitionId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3),
    "claimedBy" TEXT,

    CONSTRAINT "Nonce_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nonce_value_key" ON "Nonce"("value");
