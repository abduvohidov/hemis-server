import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { IStudentService } from './student.service.interface';
import { IConfigService } from '../../../config';
import { IStudentRepository } from '../repository/student.repository.interface';
import { Student } from '../models/student.entity';
import { StudentRegisterDto } from '../dto/student-register.dto';
import { IStudentEntity } from '../models/student.entity.interface';

@injectable()
export class StudentService implements IStudentService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.StudentRepository) private studentRepository: IStudentRepository,
	) {}

	async create({
		firstName,
		lastName,
		middleName,
		passportNumber,
		jshshr,
		dateOfBirth,
		gender,
		nationality,
		email,
		password,
		phoneNumber,
		parentPhoneNumber,
	}: StudentRegisterDto): Promise<IStudentEntity | null> {
		const newStudent = new Student(
			firstName,
			lastName,
			middleName,
			passportNumber,
			jshshr,
			dateOfBirth,
			gender,
			nationality,
			email,
			password,
			phoneNumber,
			parentPhoneNumber,
		);
		const salt = this.configService.get('SALT');
		await newStudent.setPassword(password, Number(salt));
		const existedStudent = await this.studentRepository.findByEmail(email);
		if (existedStudent) {
			return null;
		}
		return this.studentRepository.create(newStudent);
	}

	async getAll(): Promise<IStudentEntity[]> {
		return this.studentRepository.findAll();
	}

	async update(id: number, student: Partial<IStudentEntity>): Promise<IStudentEntity> {
		const existingStudent = await this.studentRepository.findById(id);
		if (!existingStudent) {
			throw new Error(`Student with ID ${id} not found.`);
		}
		return this.studentRepository.update(id, student);
	}

	async delete(id: number): Promise<void> {
		const existingStudent = await this.studentRepository.findById(id);
		if (!existingStudent) {
			throw new Error(`Student with ID ${id} not found.`);
		}
		await this.studentRepository.delete(id);
	}

	async getByEmail(email: string): Promise<IStudentEntity | null> {
		return this.studentRepository.findByEmail(email);
	}

	async getById(id: number): Promise<IStudentEntity | null> {
		return this.studentRepository.findById(id);
	}

	async getByPassportNumber(passportNumber: string): Promise<IStudentEntity | null> {
		return this.studentRepository.findByPassportNumber(passportNumber);
	}

	async getByJshshr(jshshr: string): Promise<IStudentEntity | null> {
		return this.studentRepository.findByJshshr(jshshr);
	}

	async getByLastName(lastName: string): Promise<IStudentEntity[] | null> {
		return this.studentRepository.findByLastName(lastName);
	}

	async getByFirstName(firstName: string): Promise<IStudentEntity[] | null> {
		return this.studentRepository.findByFirstName(firstName);
	}

	async getByNationality(nationality: string): Promise<IStudentEntity[] | null> {
		return this.studentRepository.findByNationality(nationality);
	}

	async getByGender(gender: string): Promise<IStudentEntity[] | null> {
		return this.studentRepository.findByGender(gender);
	}

	async getByPhoneNumber(phoneNumber: string): Promise<IStudentEntity[] | null> {
		return this.studentRepository.findByPhoneNumber(phoneNumber);
	}

	async getByParentPhoneNumber(parentPhoneNumber: string): Promise<IStudentEntity[] | null> {
		return this.studentRepository.findByParentPhoneNumber(parentPhoneNumber);
	}
}
