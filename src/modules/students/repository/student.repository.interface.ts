import { Student } from '@prisma/client';

export interface IStudentRepository {
	create(student: Student): Promise<Student>;
	findAll(): Promise<Student[]>;
	update(id: number, student: Partial<Student>): Promise<Student>;
	delete(id: number): Promise<void>;
	findByEmail(email: string): Promise<Student | null>;
	findById(id: number): Promise<Student | null>;
	findByPassportNumber(passportNumber: string): Promise<Student | null>;
	findByJshshr(jshshr: string): Promise<Student | null>;
	findByLastName(lastName: string): Promise<Student[] | null>;
	findByFirstName(firstName: string): Promise<Student[] | null>;
	findByNationality(nationality: string): Promise<Student[] | null>;
	findByGender(gender: string): Promise<Student[] | null>;
	findByPhoneNumber(phoneNumber: string): Promise<Student[] | null>;
	findByParentPhoneNumber(parentPhoneNumber: string): Promise<Student[] | null>;
}
