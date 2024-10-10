import fs from 'fs';
import xlsx from 'xlsx';
import path from 'path';
import { TYPES } from '../../../types';
import { Student } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IConfigService } from '../../../config';
import { IStudentService } from './student.service.interface';
import { StudentRegisterDto } from '../dto/student-register.dto';
import { IStudentEntity } from '../models/student.entity.interface';
import { Student as StudentEntity, IStudentRepository } from '../index';

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
			throw new Error(`Студент с идентификатором ${id} не найден.`);
		}

		// Check if the password is included in the update data
		if (student.password) {
			// Recreate a StudentEntity object to hash the password
			const updatedStudentEntity = new StudentEntity(
				existingStudent.lastName,
				existingStudent.firstName,
				existingStudent.middleName,
				existingStudent.passportNumber,
				existingStudent.jshshr,
				existingStudent.dateOfBirth,
				existingStudent.gender,
				existingStudent.nationality,
				existingStudent.email,
				existingStudent.phoneNumber,
				existingStudent.parentPhoneNumber,
				student.password, // Use the updated password
			);

			// Hash the new password
			const salt = this.configService.get('SALT');
			await updatedStudentEntity.setPassword(student.password, Number(salt));

			// Replace the plaintext password with the hashed one
			student.password = updatedStudentEntity.password;
		}

		return this.studentRepository.update(id, student);
	}

	async delete(id: number): Promise<void> {
		try {
			const existingStudent = await this.studentRepository.findById(id);

			if (!existingStudent) {
				throw new Error(`Студент с идентификатором ${id} не найден.`);
			}
			await this.studentRepository.delete(id);
		} catch (error) {
			console.error(`Ошибка при удалении студента с идентификатором ${id}:`, error);
			throw error;
		}
	}

	async getByEmail(email: string): Promise<Student | null> {
		return this.studentRepository.findByEmail(email);
	}

	async getById(id: number): Promise<Student | null> {
		return this.studentRepository.findById(id);
	}

	async getByFilters(data: Partial<Student>): Promise<Student[] | []> {
		const studentFilters = {
			...(data.lastName && { lastName: data.lastName }),
			...(data.firstName && { firstName: data.firstName }),
			...(data.middleName && { middleName: data.middleName }),
			...(data.passportNumber && { passportNumber: data.passportNumber }),
			...(data.jshshr && { jshshr: data.jshshr }),
			...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
			...(data.gender && { gender: data.gender }),
			...(data.nationality && { nationality: data.nationality }),
			...(data.email && { email: data.email }),
			...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
			...(data.parentPhoneNumber && { parentPhoneNumber: data.parentPhoneNumber }),
			...(data.password && { password: data.password }),
		};
		const hasStudentFilters = Object.keys(studentFilters).length > 0;
		if (!hasStudentFilters) {
			return [];
		}
		return this.studentRepository.findByFilters(studentFilters);
	}

	async generateXlsxFile(data: Student[]): Promise<string> {
		const workbook = xlsx.utils.book_new();
		const worksheet = xlsx.utils.json_to_sheet(data);
		xlsx.utils.book_append_sheet(workbook, worksheet, 'students_data');
		const filePath = path.join(__dirname, '../data.xlsx');
		xlsx.writeFile(workbook, filePath);

		return filePath;
	}
}
