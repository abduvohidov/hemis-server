import { injectable, inject } from 'inversify';
import { TYPES } from '../../../types';
import { PrismaService } from '../../../database/prisma.service';
import { IStudentRepository } from './student.repository.interface';
import { Student } from '@prisma/client';
import 'reflect-metadata';
import { IStudentEntity } from '../models/student.entity.interface';

@injectable()
export class StudentRepository implements IStudentRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(student: IStudentEntity): Promise<IStudentEntity> {
		console.log(student);
		return await this.prismaService.client.student.create({
			data: {
				lastName: student.lastName,
				firstName: student.firstName,
				middleName: student.middleName,
				passportNumber: student.passportNumber,
				jshshr: student.jshshr,
				dateOfBirth: student.dateOfBirth,
				gender: student.gender,
				nationality: student.nationality,
				email: student.email,
				phoneNumber: student.phoneNumber,
				parentPhoneNumber: student.parentPhoneNumber,
				password: student.password,
			},
		});
	}

	async findByEmail(email: string): Promise<Student | null> {
		return await this.prismaService.client.student.findUnique({
			include: {
				addresses: true,
			},
			where: { email },
		});
	}

	async findById(id: number): Promise<Student | null> {
		return await this.prismaService.client.student.findUnique({
			include: {
				addresses: true,
			},
			where: { id },
		});
	}

	async update(id: number, student: Partial<Student>): Promise<Student> {
		return await this.prismaService.client.student.update({
			where: { id },
			data: student,
		});
	}

	async delete(id: number): Promise<void> {
		await this.prismaService.client.student.delete({
			where: { id },
		});
	}

	async findAll(): Promise<Student[]> {
		return await this.prismaService.client.student.findMany({
			include: {
				addresses: true,
			},
		});
	}

	async findByLastName(lastName: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			include: {
				addresses: true,
			},
			where: { lastName },
		});
	}

	async findByFirstName(firstName: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			include: {
				addresses: true,
			},
			where: { firstName },
		});
	}

	async findByMiddleName(middleName: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			include: {
				addresses: true,
			},
			where: { middleName },
		});
	}

	async findByNationality(nationality: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			include: {
				addresses: true,
			},
			where: { nationality },
		});
	}

	async findByGender(gender: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			include: {
				addresses: true,
			},
			where: { gender },
		});
	}

	async findByPhoneNumber(phoneNumber: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			include: {
				addresses: true,
			},
			where: { phoneNumber },
		});
	}

	async findByParentPhoneNumber(parentPhoneNumber: string): Promise<Student[] | null> {
		return await this.prismaService.client.student.findMany({
			include: {
				addresses: true,
			},
			where: { parentPhoneNumber },
		});
	}
	async findByPassportNumber(passportNumber: string): Promise<Student | null> {
		return await this.prismaService.client.student.findUnique({
			include: {
				addresses: true,
			},
			where: { passportNumber },
		});
	}

	async findByJshshr(jshshr: string): Promise<Student | null> {
		return await this.prismaService.client.student.findUnique({
			include: {
				addresses: true,
			},
			where: { jshshr },
		});
	}
}
