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
	getByFilters: (data: Partial<Student>) => Promise<Student[] | []>;
	generateXlsxFile: (data: Student[]) => Promise<string>;
}
