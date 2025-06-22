-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "accept" JSONB,
    "expires_at" TIMESTAMP(3),
    "stars" INTEGER DEFAULT 0,
    "total_applied" INTEGER DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applied" (
    "id" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "apply_info" JSONB,
    "status" "Status" NOT NULL DEFAULT 'Pending',
    "reply" TEXT,

    CONSTRAINT "applied_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "applied_userId_idx" ON "applied"("userId");

-- CreateIndex
CREATE INDEX "applied_post_id_idx" ON "applied"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "applied_userId_post_id_key" ON "applied"("userId", "post_id");

-- AddForeignKey
ALTER TABLE "applied" ADD CONSTRAINT "applied_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
