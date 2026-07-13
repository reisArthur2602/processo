/*
  Warnings:

  - Added the required column `clientId` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceArea` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECT');

-- CreateEnum
CREATE TYPE "IntakeStatus" AS ENUM ('DRAFT', 'OPEN', 'FINALIZED', 'CONVERTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ProvidenceType" AS ENUM ('REQUEST_DOCUMENTS', 'PREPARE_LEGAL_OPINION', 'SCHEDULE_RETURN', 'PREPARE_CONTRACT', 'FILE_LAWSUIT', 'SETTLEMENT_ATTEMPT', 'OTHER');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('HEARING', 'MEETING', 'RETURN', 'DEADLINE', 'OTHER');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'PIX', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'BOLETO', 'INSTALLMENTS', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('POWER_OF_ATTORNEY', 'CONTRACT', 'PETITION', 'DECISION', 'ID_DOCUMENT', 'PROOF', 'REPORT', 'OTHER');

-- AlterEnum
ALTER TYPE "CaseStatus" ADD VALUE 'CLOSED';

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "currentPhase" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "serviceArea" TEXT NOT NULL,
ALTER COLUMN "number" DROP NOT NULL,
ALTER COLUMN "actionType" DROP NOT NULL,
ALTER COLUMN "court" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "category" "DocumentCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" TEXT;

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "personType" "PersonType" NOT NULL DEFAULT 'INDIVIDUAL',
    "status" "ClientStatus" NOT NULL DEFAULT 'PROSPECT',
    "name" TEXT NOT NULL,
    "document" TEXT,
    "rg" TEXT,
    "birthDate" TIMESTAMP(3),
    "maritalStatus" TEXT,
    "profession" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "zipCode" TEXT,
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "district" TEXT,
    "city" TEXT,
    "state" TEXT,
    "notes" TEXT,
    "responsibleId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intake" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "status" "IntakeStatus" NOT NULL DEFAULT 'OPEN',
    "serviceArea" TEXT NOT NULL,
    "clientReport" VARCHAR(1800),
    "preliminaryAnalysis" VARCHAR(1800),
    "providences" "ProvidenceType"[] DEFAULT ARRAY[]::"ProvidenceType"[],
    "otherProvidence" TEXT,
    "requestedDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "feeAmount" DECIMAL(12,2),
    "amountReceived" DECIMAL(12,2),
    "paymentMethod" "PaymentMethod",
    "paymentNotes" TEXT,
    "attendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizedAt" TIMESTAMP(3),
    "clientId" TEXT NOT NULL,
    "caseId" TEXT,
    "responsibleId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "AppointmentType" NOT NULL DEFAULT 'OTHER',
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "description" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "location" TEXT,
    "caseId" TEXT NOT NULL,
    "responsibleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_document_key" ON "Client"("document");

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE INDEX "Client_document_idx" ON "Client"("document");

-- CreateIndex
CREATE INDEX "Client_phone_idx" ON "Client"("phone");

-- CreateIndex
CREATE INDEX "Client_email_idx" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_status_idx" ON "Client"("status");

-- CreateIndex
CREATE INDEX "Client_responsibleId_idx" ON "Client"("responsibleId");

-- CreateIndex
CREATE INDEX "Client_createdById_idx" ON "Client"("createdById");

-- CreateIndex
CREATE INDEX "Client_updatedAt_idx" ON "Client"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Intake_number_key" ON "Intake"("number");

-- CreateIndex
CREATE INDEX "Intake_number_idx" ON "Intake"("number");

-- CreateIndex
CREATE INDEX "Intake_status_idx" ON "Intake"("status");

-- CreateIndex
CREATE INDEX "Intake_serviceArea_idx" ON "Intake"("serviceArea");

-- CreateIndex
CREATE INDEX "Intake_clientId_idx" ON "Intake"("clientId");

-- CreateIndex
CREATE INDEX "Intake_caseId_idx" ON "Intake"("caseId");

-- CreateIndex
CREATE INDEX "Intake_responsibleId_idx" ON "Intake"("responsibleId");

-- CreateIndex
CREATE INDEX "Intake_createdById_idx" ON "Intake"("createdById");

-- CreateIndex
CREATE INDEX "Intake_attendedAt_idx" ON "Intake"("attendedAt");

-- CreateIndex
CREATE INDEX "Appointment_caseId_idx" ON "Appointment"("caseId");

-- CreateIndex
CREATE INDEX "Appointment_responsibleId_idx" ON "Appointment"("responsibleId");

-- CreateIndex
CREATE INDEX "Appointment_type_idx" ON "Appointment"("type");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "Appointment_startsAt_idx" ON "Appointment"("startsAt");

-- CreateIndex
CREATE INDEX "Case_title_idx" ON "Case"("title");

-- CreateIndex
CREATE INDEX "Case_serviceArea_idx" ON "Case"("serviceArea");

-- CreateIndex
CREATE INDEX "Case_clientId_idx" ON "Case"("clientId");

-- CreateIndex
CREATE INDEX "Document_deletedById_idx" ON "Document"("deletedById");

-- CreateIndex
CREATE INDEX "Document_category_idx" ON "Document"("category");

-- CreateIndex
CREATE INDEX "Document_deletedAt_idx" ON "Document"("deletedAt");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intake" ADD CONSTRAINT "Intake_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intake" ADD CONSTRAINT "Intake_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intake" ADD CONSTRAINT "Intake_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intake" ADD CONSTRAINT "Intake_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
