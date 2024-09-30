import { Student } from '@prisma/client';
import { IStudentEntity } from '../models/student.entity.interface';

export interface IStudentRepository {
	create: ({
		firstName,
		lastName,
		middleName,
		passportNumber,
		jshshr,
		dateOfBirth,
		gender,
		nationality,
		email,
		phoneNumber,
		parentPhoneNumber,
		password,
	}: IStudentEntity) => Promise<IStudentEntity>;
	findAll: () => Promise<Student[]>;
	update: (id: number, student: Partial<Student>) => Promise<Student>;
	delete: (id: number) => Promise<void>;
	findById: (id: number) => Promise<Student | null>;
	findByEmail: (email: string) => Promise<Student | null>;
	findByFilters: (data: Partial<Student>) => Promise<Student[] | []>;
}
