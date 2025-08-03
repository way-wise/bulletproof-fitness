-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('LIKE', 'VIEW', 'RATING', 'SETUP', 'DISLIKE', 'LIBRARY');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "role" TEXT,
    "banned" BOOLEAN,
    "banReason" TEXT,
    "banExpires" INTEGER,
    "totalPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "impersonatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verifications" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyPart" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExSetupBodyPart" (
    "id" TEXT NOT NULL,
    "exSetupId" TEXT NOT NULL,
    "bodyPartId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExSetupBodyPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExSetupEquipment" (
    "id" TEXT NOT NULL,
    "exSetupId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExSetupEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExSetupRak" (
    "id" TEXT NOT NULL,
    "exSetupId" TEXT NOT NULL,
    "rackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExSetupRak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseSetup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "height" TEXT,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "blockReason" TEXT,
    "isolatorHole" TEXT,
    "yellow" TEXT,
    "green" TEXT,
    "blue" TEXT,
    "red" TEXT,
    "purple" TEXT,
    "orange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoCenter" (
    "id" TEXT NOT NULL,
    "buildingType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "cityZip" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "bio" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "availability" TEXT,
    "weekdays" TEXT[],
    "weekends" TEXT[],
    "weekdayOpen" TEXT,
    "weekdayClose" TEXT,
    "weekendOpen" TEXT,
    "weekendClose" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "blockReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoCenterEquipment" (
    "id" TEXT NOT NULL,
    "demoCenterId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoCenterEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExLibBodyPart" (
    "id" TEXT NOT NULL,
    "exLibraryId" TEXT NOT NULL,
    "bodyPartId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExLibBodyPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExLibEquipment" (
    "id" TEXT NOT NULL,
    "exLibraryId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExLibEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExLibRak" (
    "id" TEXT NOT NULL,
    "exLibraryId" TEXT NOT NULL,
    "rackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExLibRak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseLibraryVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "height" TEXT,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "blockReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseLibraryVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_stats" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT,
    "libraryId" TEXT,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalDislikes" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_points" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type" "RewardType" NOT NULL DEFAULT 'LIKE',
    "icon" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reward_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "views" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "exerciseId" TEXT,
    "libraryId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT,
    "libraryId" TEXT,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reaction" "ReactionType" NOT NULL,
    "exerciseId" TEXT,
    "libraryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_emailVerified_idx" ON "users"("emailVerified");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_banned_idx" ON "users"("banned");

-- CreateIndex
CREATE INDEX "users_banExpires_idx" ON "users"("banExpires");

-- CreateIndex
CREATE INDEX "users_totalPoints_idx" ON "users"("totalPoints");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_userId_token_idx" ON "sessions"("userId", "token");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");

-- CreateIndex
CREATE INDEX "ExerciseSetup_userId_idx" ON "ExerciseSetup"("userId");

-- CreateIndex
CREATE INDEX "ExerciseSetup_isPublic_blocked_idx" ON "ExerciseSetup"("isPublic", "blocked");

-- CreateIndex
CREATE INDEX "DemoCenter_isPublic_blocked_idx" ON "DemoCenter"("isPublic", "blocked");

-- CreateIndex
CREATE INDEX "DemoCenter_lat_lng_idx" ON "DemoCenter"("lat", "lng");

-- CreateIndex
CREATE INDEX "DemoCenter_weekdays_weekends_idx" ON "DemoCenter"("weekdays", "weekends");

-- CreateIndex
CREATE INDEX "ExerciseLibraryVideo_userId_idx" ON "ExerciseLibraryVideo"("userId");

-- CreateIndex
CREATE INDEX "ExerciseLibraryVideo_title_idx" ON "ExerciseLibraryVideo"("title");

-- CreateIndex
CREATE INDEX "ExerciseLibraryVideo_isPublic_blocked_idx" ON "ExerciseLibraryVideo"("isPublic", "blocked");

-- CreateIndex
CREATE INDEX "content_stats_exerciseId_libraryId_idx" ON "content_stats"("exerciseId", "libraryId");

-- CreateIndex
CREATE UNIQUE INDEX "content_stats_exerciseId_libraryId_key" ON "content_stats"("exerciseId", "libraryId");

-- CreateIndex
CREATE INDEX "reward_points_userId_idx" ON "reward_points"("userId");

-- CreateIndex
CREATE INDEX "views_userId_exerciseId_libraryId_idx" ON "views"("userId", "exerciseId", "libraryId");

-- CreateIndex
CREATE INDEX "views_sessionId_idx" ON "views"("sessionId");

-- CreateIndex
CREATE INDEX "views_ipAddress_idx" ON "views"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "views_userId_exerciseId_libraryId_key" ON "views"("userId", "exerciseId", "libraryId");

-- CreateIndex
CREATE INDEX "ratings_userId_exerciseId_libraryId_idx" ON "ratings"("userId", "exerciseId", "libraryId");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_userId_exerciseId_libraryId_key" ON "ratings"("userId", "exerciseId", "libraryId");

-- CreateIndex
CREATE INDEX "reactions_userId_exerciseId_libraryId_idx" ON "reactions"("userId", "exerciseId", "libraryId");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_userId_key" ON "reactions"("userId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExSetupBodyPart" ADD CONSTRAINT "ExSetupBodyPart_exSetupId_fkey" FOREIGN KEY ("exSetupId") REFERENCES "ExerciseSetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExSetupBodyPart" ADD CONSTRAINT "ExSetupBodyPart_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "BodyPart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExSetupEquipment" ADD CONSTRAINT "ExSetupEquipment_exSetupId_fkey" FOREIGN KEY ("exSetupId") REFERENCES "ExerciseSetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExSetupEquipment" ADD CONSTRAINT "ExSetupEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExSetupRak" ADD CONSTRAINT "ExSetupRak_exSetupId_fkey" FOREIGN KEY ("exSetupId") REFERENCES "ExerciseSetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExSetupRak" ADD CONSTRAINT "ExSetupRak_rackId_fkey" FOREIGN KEY ("rackId") REFERENCES "Rack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSetup" ADD CONSTRAINT "ExerciseSetup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoCenterEquipment" ADD CONSTRAINT "DemoCenterEquipment_demoCenterId_fkey" FOREIGN KEY ("demoCenterId") REFERENCES "DemoCenter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoCenterEquipment" ADD CONSTRAINT "DemoCenterEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExLibBodyPart" ADD CONSTRAINT "ExLibBodyPart_exLibraryId_fkey" FOREIGN KEY ("exLibraryId") REFERENCES "ExerciseLibraryVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExLibBodyPart" ADD CONSTRAINT "ExLibBodyPart_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "BodyPart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExLibEquipment" ADD CONSTRAINT "ExLibEquipment_exLibraryId_fkey" FOREIGN KEY ("exLibraryId") REFERENCES "ExerciseLibraryVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExLibEquipment" ADD CONSTRAINT "ExLibEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExLibRak" ADD CONSTRAINT "ExLibRak_exLibraryId_fkey" FOREIGN KEY ("exLibraryId") REFERENCES "ExerciseLibraryVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExLibRak" ADD CONSTRAINT "ExLibRak_rackId_fkey" FOREIGN KEY ("rackId") REFERENCES "Rack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseLibraryVideo" ADD CONSTRAINT "ExerciseLibraryVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_stats" ADD CONSTRAINT "content_stats_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseSetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_stats" ADD CONSTRAINT "content_stats_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "ExerciseLibraryVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_points" ADD CONSTRAINT "reward_points_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "views" ADD CONSTRAINT "views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "views" ADD CONSTRAINT "views_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseSetup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "views" ADD CONSTRAINT "views_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "ExerciseLibraryVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseSetup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "ExerciseLibraryVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseSetup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "ExerciseLibraryVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
