import { IStudentEntity } from '../models/student.entity.interface';

export interface IStudentRepository {
	create(student: IStudentEntity): Promise<IStudentEntity>;
	findAll(): Promise<IStudentEntity[]>;
	update(id: number, student: Partial<IStudentEntity>): Promise<IStudentEntity>;
	delete(id: number): Promise<void>;
	findByEmail(email: string): Promise<IStudentEntity | null>;
	findById(id: number): Promise<IStudentEntity | null>;
	findByPassportNumber(passportNumber: string): Promise<IStudentEntity | null>;
	findByJshshr(jshshr: string): Promise<IStudentEntity | null>;
	findByLastName(lastName: string): Promise<IStudentEntity[] | null>;
	findByFirstName(firstName: string): Promise<IStudentEntity[] | null>;
	findByNationality(nationality: string): Promise<IStudentEntity[] | null>;
	findByGender(gender: string): Promise<IStudentEntity[] | null>;
	findByPhoneNumber(phoneNumber: string): Promise<IStudentEntity[] | null>;
	findByParentPhoneNumber(parentPhoneNumber: string): Promise<IStudentEntity[] | null>;
}
