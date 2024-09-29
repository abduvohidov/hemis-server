import 'reflect-metadata';
import { IEducationService } from '..';
import { ILogger } from '../../../logger';
import { inject, injectable } from 'inversify';
import { ROLES, TYPES } from './../../../types';
import { BaseController } from '../../../common';
import { IConfigService } from './../../../config';
import { Education, PrismaClient } from '@prisma/client';
import { NextFunction, Response, Request } from 'express';
import { CreateEducationDto, UpdateEducationDto } from '../index';
import { IEducationController } from './education.controller.interface';
import { ValidateMiddleware, AuthMiddleware, VerifyRole } from '../../../common';

@injectable()
export class EducationController extends BaseController implements IEducationController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.EducationService) private educationService: IEducationService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				func: this.postEducation,
				middlewares: [
					new ValidateMiddleware(CreateEducationDto),
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/delete/:id',
				method: 'delete',
				func: this.deleteEducation,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/update/:id',
				method: 'put',
				func: this.updateEducation,
				middlewares: [
					new ValidateMiddleware(UpdateEducationDto),
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/all',
				method: 'post',
				func: this.findAll,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/:id',
				method: 'get',
				func: this.findById,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/student/:id',
				method: 'get',
				func: this.findByStudentId,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/bachelor/:id',
				method: 'get',
				func: this.findByBachelorId,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/faculty/:id',
				method: 'get',
				func: this.findByFacultyId,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/current-specialization',
				method: 'post',
				func: this.findByCurrentSpecialization,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/course',
				method: 'post',
				func: this.findByCourse,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/payment-type',
				method: 'post',
				func: this.findByPaymentType,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/entry-year',
				method: 'post',
				func: this.findByEntryYear,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/education-form',
				method: 'post',
				func: this.findByEducationForm,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/language-certificate',
				method: 'post',
				func: this.findByLanguageCertificate,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/semester',
				method: 'post',
				func: this.findBySemester,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/scientific-supervisor',
				method: 'post',
				func: this.findByScientificSupervisor,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
						ROLES.student,
					]),
				],
			},
			{
				path: '/scientific-advisor',
				method: 'post',
				func: this.findByScientificAdvisor,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/internship-supervisor',
				method: 'post',
				func: this.findByInternshipSupervisor,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/internal-reviewer',
				method: 'post',
				func: this.findByInternalReviewer,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/external-reviewer',
				method: 'post',
				func: this.findByExternamReviewer,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/thesis-topic',
				method: 'post',
				func: this.findByThesisTopic,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/articles/:id',
				method: 'get',
				func: this.findByArticlesId,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
			{
				path: '/academic-leave',
				method: 'post',
				func: this.findByAcademicLeave,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new VerifyRole(new PrismaClient(), [
						ROLES.admin,
						ROLES.director,
						ROLES.teacher,
						ROLES.teamLead,
					]),
				],
			},
		]);
	}

	async postEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.prepareEducation(req.body);
		if (!education) {
			this.send(res, 400, 'This education has education already');
			return;
		}
		this.ok(res, { education });
	}
	async deleteEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const education = await this.educationService.removeEducation(id);
		if (!education) {
			this.send(res, 400, 'This education does not exists ');
			return;
		}
		this.ok(res, { education });
	}
	async updateEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const education = await this.educationService.changeEducation(id, req.body);
		if (!education) {
			this.send(res, 400, 'This education does not exists ');
			return;
		}
		this.ok(res, { education });
	}
	async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getAll();
		if (!education) {
			this.send(res, 400, 'Something went wrong');
			return;
		}
		this.ok(res, { education });
	}
	async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const education = await this.educationService.getById(id);
		if (!education) {
			this.send(res, 400, 'This education does not exists');
			return;
		}
		this.ok(res, { education });
	}
	async findByStudentId(req: Request, res: Response, next: NextFunction): Promise<void> {
		const studentId = Number(req.params.id);
		const education = await this.educationService.getByStudentId(studentId);
		if (!education) {
			this.send(res, 400, 'This education does not exists or Student does not exists');
			return;
		}
		this.ok(res, { education });
	}
	async findByBachelorId(req: Request, res: Response, next: NextFunction): Promise<void> {
		const bachelorId = Number(req.params.id);
		const education = await this.educationService.getByBachelorId(bachelorId);
		if (!education) {
			this.send(res, 400, 'No education found for the specified bachelor');
			return;
		}
		this.ok(res, { education });
	}

	async findByFacultyId(req: Request, res: Response, next: NextFunction): Promise<void> {
		const facultyId = Number(req.params.id);
		const education = await this.educationService.getByFacultyId(facultyId);
		if (!education) {
			this.send(res, 400, 'No education found for the specified faculty');
			return;
		}
		this.ok(res, { education });
	}

	async findByCurrentSpecialization(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const education = await this.educationService.getByCurrentSpecialization(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified specialization');
			return;
		}
		this.ok(res, { education });
	}

	async findByCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByCourse(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified course');
			return;
		}
		this.ok(res, { education });
	}

	async findByPaymentType(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByPaymentType(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified payment type');
			return;
		}
		this.ok(res, { education });
	}

	async findByEntryYear(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByEntryYear(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified entry year');
			return;
		}
		this.ok(res, { education });
	}

	async findByEducationForm(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByEducationForm(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified education form');
			return;
		}
		this.ok(res, { education });
	}

	async findByLanguageCertificate(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByLanguageCertificate(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified language certificate');
			return;
		}
		this.ok(res, { education });
	}

	async findBySemester(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getBySemester(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified semester');
			return;
		}
		this.ok(res, { education });
	}

	async findByScientificSupervisor(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByScientificSupervisor(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified scientific supervisor');
			return;
		}
		this.ok(res, { education });
	}

	async findByScientificAdvisor(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByScientificAdvisor(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified scientific advisor');
			return;
		}
		this.ok(res, { education });
	}

	async findByInternshipSupervisor(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByInternshipSupervisor(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified internship supervisor');
			return;
		}
		this.ok(res, { education });
	}

	async findByInternalReviewer(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByInternalReviewer(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified internal reviewer');
			return;
		}
		this.ok(res, { education });
	}

	async findByExternamReviewer(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByExternamReviewer(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified external reviewer');
			return;
		}
		this.ok(res, { education });
	}

	async findByThesisTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByThesisTopic(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified thesis topic');
			return;
		}
		this.ok(res, { education });
	}

	async findByArticlesId(req: Request, res: Response, next: NextFunction): Promise<void> {
		const articlesId = Number(req.params.id);
		const education = await this.educationService.getByArticlesId(articlesId);
		if (!education) {
			this.send(res, 400, 'No education found for the specified articles ID');
			return;
		}
		this.ok(res, { education });
	}

	async findByAcademicLeave(req: Request, res: Response, next: NextFunction): Promise<void> {
		const education = await this.educationService.getByAcademicLeave(req.body);
		if (!education) {
			this.send(res, 400, 'No education found for the specified academic leave');
			return;
		}
		this.ok(res, { education });
	}
}
