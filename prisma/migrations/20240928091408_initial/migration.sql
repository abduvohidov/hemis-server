/*
  Warnings:

  - A unique constraint covering the columns `[passportNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jshshr]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_passportNumber_key" ON "Student"("passportNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Student_jshshr_key" ON "Student"("jshshr");
