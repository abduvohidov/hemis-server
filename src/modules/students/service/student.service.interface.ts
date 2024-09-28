import { Student } from '@prisma/client';
import { StudentRegisterDto } from '../dto/student-register.dto';
import { IStudentEntity } from '../models/student.entity.interface';

export interface IStudentService {
	create: (student: StudentRegisterDto) => Promise<IStudentEntity | null>;
	getAll: () => Promise<Student[]>;
	update: (id: number, student: Partial<Student>) => Promise<Student>;
	delete: (id: number) => Promise<void>;
	getByEmail: (email: string) => Promise<Student | null>;
	getById: (id: number) => Promise<Student | null>;
	getByPassportNumber: (passportNumber: string) => Promise<Student | null>;
	getByJshshr: (jshshr: string) => Promise<Student | null>;
	getByLastName: (lastName: string) => Promise<Student[] | null>;
	getByFirstName: (firstName: string) => Promise<Student[] | null>;
	getByMiddleName: (middleName: string) => Promise<Student[] | null>;
	getByNationality: (nationality: string) => Promise<Student[] | null>;
	getByGender: (gender: string) => Promise<Student[] | null>;
	getByPhoneNumber: (phoneNumber: string) => Promise<Student[] | null>;
	getByParentPhoneNumber: (parentPhoneNumber: string) => Promise<Student[] | null>;
}
