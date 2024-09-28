import { StudentRegisterDto } from '../dto/student-register.dto';
import { IStudentEntity } from '../models/student.entity.interface';

export interface IStudentService {
	create(student: StudentRegisterDto): Promise<IStudentEntity | null>;
	getAll(): Promise<IStudentEntity[]>;
	update(id: number, student: Partial<IStudentEntity>): Promise<IStudentEntity>;
	delete(id: number): Promise<void>;
	getByEmail(email: string): Promise<IStudentEntity | null>;
	getById(id: number): Promise<IStudentEntity | null>;
	getByPassportNumber(passportNumber: string): Promise<IStudentEntity | null>;
	getByJshshr(jshshr: string): Promise<IStudentEntity | null>;
	getByLastName(lastName: string): Promise<IStudentEntity[] | null>;
	getByFirstName(firstName: string): Promise<IStudentEntity[] | null>;
	getByNationality(nationality: string): Promise<IStudentEntity[] | null>;
	getByGender(gender: string): Promise<IStudentEntity[] | null>;
	getByPhoneNumber(phoneNumber: string): Promise<IStudentEntity[] | null>;
	getByParentPhoneNumber(parentPhoneNumber: string): Promise<IStudentEntity[] | null>;
}
