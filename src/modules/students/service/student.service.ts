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
		if (Object.keys(data).length == 0) return [];
		return this.studentRepository.findByFilters(data);
	}

	async generateXlsxFile(data: Student[]): Promise<string> {
		const workbook = xlsx.utils.book_new();
		const worksheet = xlsx.utils.json_to_sheet(data);
		xlsx.utils.book_append_sheet(workbook, worksheet, 'students_data');

		const filePath = path.join(__dirname, '../data.xlsx');
		xlsx.writeFile(workbook, filePath);
		console.log(filePath);

		return filePath;
	}
}
