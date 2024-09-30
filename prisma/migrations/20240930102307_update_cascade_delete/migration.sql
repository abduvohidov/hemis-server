-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_articlesId_fkey";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_articlesId_fkey" FOREIGN KEY ("articlesId") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
