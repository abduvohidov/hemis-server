-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_bachelorId_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_studentId_fkey";

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_bachelorId_fkey" FOREIGN KEY ("bachelorId") REFERENCES "Bachelor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
