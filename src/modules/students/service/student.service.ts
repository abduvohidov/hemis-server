import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { IStudentService } from './student.service.interface';
import { IConfigService } from '../../../config';
import { IStudentRepository } from '../repository/student.repository.interface';
import { Student } from '@prisma/client';
import { Student as StudentEntity } from '../index';
import { StudentRegisterDto } from '../dto/student-register.dto';
import { IStudentEntity } from '../models/student.entity.interface';

@injectable()
export class StudentService implements IStudentService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.StudentRepository) private studentRepository: IStudentRepository,
	) {}

	async create(student: StudentRegisterDto): Promise<IStudentEntity | null> {
		const newStudent = new StudentEntity(
			student.lastName,
			student.firstName,
			student.middleName,
			student.passportNumber,
			student.jshshr,
			student.dateOfBirth,
			student.gender,
			student.nationality,
			student.email,
			student.phoneNumber,
			student.parentPhoneNumber,
			student.password,
		);
		const salt = this.configService.get('SALT');
		await newStudent.setPassword(student.password, Number(salt));
		const existedStudent = await this.studentRepository.findByEmail(student.email);
		if (existedStudent) {
			return null;
		}
		return this.studentRepository.create(newStudent);
	}

	async getAll(): Promise<Student[]> {
		return this.studentRepository.findAll();
	}

	async update(id: number, student: Partial<Student>): Promise<Student> {
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

	async getByEmail(email: string): Promise<Student | null> {
		return this.studentRepository.findByEmail(email);
	}

	async getById(id: number): Promise<Student | null> {
		return this.studentRepository.findById(id);
	}

	async getByPassportNumber(passportNumber: string): Promise<Student | null> {
		return this.studentRepository.findByPassportNumber(passportNumber);
	}

	async getByJshshr(jshshr: string): Promise<Student | null> {
		return this.studentRepository.findByJshshr(jshshr);
	}

	async getByLastName(lastName: string): Promise<Student[] | null> {
		return this.studentRepository.findByLastName(lastName);
	}

	async getByFirstName(firstName: string): Promise<Student[] | null> {
		return this.studentRepository.findByFirstName(firstName);
	}

	async getByMiddleName(middleName: string): Promise<Student[] | null> {
		return this.studentRepository.findByMiddleName(middleName);
	}

	async getByNationality(nationality: string): Promise<Student[] | null> {
		return this.studentRepository.findByNationality(nationality);
	}

	async getByGender(gender: string): Promise<Student[] | null> {
		return this.studentRepository.findByGender(gender);
	}

	async getByPhoneNumber(phoneNumber: string): Promise<Student[] | null> {
		return this.studentRepository.findByPhoneNumber(phoneNumber);
	}

	async getByParentPhoneNumber(parentPhoneNumber: string): Promise<Student[] | null> {
		return this.studentRepository.findByParentPhoneNumber(parentPhoneNumber);
	}
}
