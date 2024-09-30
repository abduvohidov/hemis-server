-- CreateTable
CREATE TABLE "UserModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "passportNumber" TEXT NOT NULL,
    "jshshr" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "parentPhoneNumber" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "bachelorId" INTEGER NOT NULL,
    "currentSpecialization" TEXT NOT NULL,
    "facultyId" INTEGER NOT NULL,
    "course" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "entryYear" TEXT NOT NULL,
    "educationForm" TEXT NOT NULL,
    "languageCertificate" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "scientificSupervisor" TEXT NOT NULL,
    "scientificAdvisor" TEXT NOT NULL,
    "internshipSupervisor" TEXT NOT NULL,
    "internalReviewer" TEXT NOT NULL,
    "externamReviewer" TEXT NOT NULL,
    "thesisTopic" TEXT NOT NULL,
    "articlesId" INTEGER NOT NULL,
    "academicLeave" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bachelor" (
    "id" SERIAL NOT NULL,
    "previousUniversity" TEXT NOT NULL,
    "graduationYear" TEXT NOT NULL,
    "diplomaNumber" TEXT NOT NULL,
    "previousSpecialization" TEXT NOT NULL,

    CONSTRAINT "Bachelor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articles" (
    "id" SERIAL NOT NULL,
    "firstArticle" TEXT NOT NULL,
    "firstArticleDate" TIMESTAMP(3) NOT NULL,
    "firstArticleJournal" TEXT NOT NULL,
    "secondArticle" TEXT NOT NULL,
    "secondArticleDate" TIMESTAMP(3) NOT NULL,
    "secondArticleJournal" TEXT NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Address_studentId_key" ON "Address"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Education_studentId_key" ON "Education"("studentId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_bachelorId_fkey" FOREIGN KEY ("bachelorId") REFERENCES "Bachelor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_articlesId_fkey" FOREIGN KEY ("articlesId") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
