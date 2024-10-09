import { Education, Student } from '@prisma/client';

export interface IEducation extends Education {
	student?: Student;
}
