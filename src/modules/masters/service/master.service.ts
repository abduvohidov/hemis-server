import xlsx from 'xlsx';
import path from 'path';
import { TYPES } from '../../../types';
import { Address, Articles, Bachelor, Education, Faculty, Master } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IConfigService } from '../../../config';
import { IMasterService } from './master.service.interface';
import { MasterRegisterDto } from '../dto/master-register.dto';
import { IMasterEntity } from '../models/master.entity.interface';
import { Master as MasterEntity, IMasterRepository } from '../index';

@injectable()
export class MasterService implements IMasterService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.MasterRepository) private masterRepository: IMasterRepository,
	) {}

	async create(master: MasterRegisterDto): Promise<IMasterEntity | null> {
		const newmaster = new MasterEntity(
			master.lastName,
			master.firstName,
			master.middleName,
			master.passportNumber,
			master.jshshr,
			master.dateOfBirth,
			master.gender,
			master.nationality,
			master.email,
			master.phoneNumber,
			master.parentPhoneNumber,
			master.password,
		);
		const salt = this.configService.get('SALT');
		await newmaster.setPassword(master.password, Number(salt));
		const existedmaster = await this.masterRepository.findByEmail(master.email);
		if (existedmaster) {
			return null;
		}
		return this.masterRepository.create(newmaster);
	}

	async getAll(): Promise<Master[]> {
		return this.masterRepository.findAll();
	}

	async update(id: number, master: Partial<Master>): Promise<Master> {
		const existingmaster = await this.masterRepository.findById(id);
		if (!existingmaster) {
			throw new Error(`Студент с идентификатором ${id} не найден.`);
		}

		// Check if the password is included in the update data
		if (master.password) {
			// Only hash and update the password if it was provided
			const updatedmasterEntity = new MasterEntity(
				existingmaster.lastName,
				existingmaster.firstName,
				existingmaster.middleName,
				existingmaster.passportNumber,
				existingmaster.jshshr,
				existingmaster.dateOfBirth,
				existingmaster.gender,
				existingmaster.nationality,
				existingmaster.email,
				existingmaster.phoneNumber,
				existingmaster.parentPhoneNumber,
				master.password, // Use the updated password
			);

			const salt = this.configService.get('SALT');
			await updatedmasterEntity.setPassword(master.password, Number(salt));

			// Replace the plaintext password with the hashed one
			master.password = updatedmasterEntity.password;
		}

		return this.masterRepository.update(id, master);
	}

	async delete(id: number): Promise<void> {
		try {
			const existingmaster = await this.masterRepository.findById(id);

			if (!existingmaster) {
				throw new Error(`Студент с идентификатором ${id} не найден.`);
			}
			await this.masterRepository.delete(id);
		} catch (error) {
			console.error(`Ошибка при удалении студента с идентификатором ${id}:`, error);
			throw error;
		}
	}

	async getByEmail(email: string): Promise<Master | null> {
		return this.masterRepository.findByEmail(email);
	}

	async getById(id: number): Promise<Master | null> {
		return this.masterRepository.findById(id);
	}

	async getByFilters(data: Partial<Master>): Promise<Master[] | []> {
		const birthDate = new Date(`${data?.dateOfBirth}T00:00:00.000Z`);
		const masterFilters = {
			...(data.lastName && { lastName: data.lastName }),
			...(data.firstName && { firstName: data.firstName }),
			...(data.middleName && { middleName: data.middleName }),
			...(data.passportNumber && { passportNumber: data.passportNumber }),
			...(data.jshshr && { jshshr: data.jshshr }),
			...(data.dateOfBirth && { dateOfBirth: birthDate }),
			...(data.gender && { gender: data.gender }),
			...(data.nationality && { nationality: data.nationality }),
			...(data.email && { email: data.email }),
			...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
			...(data.parentPhoneNumber && { parentPhoneNumber: data.parentPhoneNumber }),
			...(data.password && { password: data.password }),
		};
		const hasmasterFilters = Object.keys(masterFilters).length > 0;
		if (!hasmasterFilters) {
			return [];
		}
		return this.masterRepository.findByFilters(masterFilters);
	}

	async generateXlsxFile(
		masters: Master[],
		education: Education[],
		addresses: Address[],
		bachelors: Bachelor[],
		faculties: Faculty[],
		articles: Articles[],
	): Promise<string> {
		const workbook = xlsx.utils.book_new();

		const data = masters.map((master) => {
			const masterEducation = education.filter((edu) => edu.masterId === master.id);
			const masterAddress = addresses.filter((addr) => addr.masterId === master.id);
			const masterBachelor = bachelors.filter((bachelor) => {
				return bachelor.id === masterEducation[0]?.bachelorId;
			});

			const masterFaculty = faculties.filter((faculty) => {
				return faculty.id === masterEducation[0]?.facultyId;
			});

			const masterArticle = articles.filter((article) => {
				return article.id === masterEducation[0]?.articlesId;
			});

			const edu = masterEducation[0] || {};
			const addr = masterAddress[0] || {};
			const bachelor = masterBachelor[0] || {};
			const faculty = masterFaculty[0] || {};
			const article = masterArticle[0] || {};

			return {
				//masters
				ID: master.id,
				FirstName: master.firstName,
				LastName: master.lastName,
				MiddleName: master.middleName,
				PassportNumber: master.passportNumber,
				Jshshr: master.jshshr,
				DateOfBirth: master.dateOfBirth,
				Gender: master.gender,
				Nationality: master.nationality,
				Email: master.email,
				PhoneNumber: master.phoneNumber,
				ParentPhoneNumber: master.parentPhoneNumber,
				//address
				Country: addr.country || null,
				Region: addr.region || null,
				Address: addr.address || null,
				//education
				CurrentSpecialization: edu.currentSpecialization || null,
				Course: edu.course || null,
				PaymentType: edu.paymentType || null,
				EntryYear: edu.entryYear || null,
				Form: edu.educationForm || null,
				LanguageCertification: edu.languageCertificate || null,
				Semester: edu.semester || null,
				ScientificSupervisor: edu.scientificSupervisor || null,
				ScientificAdvisor: edu.scientificAdvisor || null,
				InternshipSupervisor: edu.internshipSupervisor || null,
				InternalReviewer: edu.internalReviewer || null,
				ExternamReviewer: edu.externamReviewer || null,
				ThesisTopic: edu.thesisTopic || null,
				AcademicLeave: edu.academicLeave || null,
				// bachelors
				GraduationYear: bachelor.graduationYear || null,
				DiplomaNumber: bachelor.diplomaNumber || null,
				PreviousSpecialization: bachelor.previousSpecialization || null,
				PreviousUniversity: bachelor.previousUniversity || null,
				// Faculty
				FacultyName: faculty.name || null,
				// Article
				FirstArticle: article.firstArticle || null,
				SecondArticle: article.secondArticle || null,
				FirstArticleJournal: article.firstArticleJournal || null,
				SecondArticleJournal: article.secondArticleJournal || null,
				FirstArticleDate: article.firstArticleDate || null,
				SecondArticleDate: article.secondArticleDate || null,
			};
		});

		const worksheet = xlsx.utils.json_to_sheet(data);

		const header = [
			'ID',
			'Ismi',
			'Familiyasi',
			'Otasining ismi',
			'Pasport raqami',
			'JSHSHIR',
			'Tug‘ilgan sana',
			'Jinsi',
			'Millati',
			'Elektron pochta',
			'Telefon raqami',
			'Ota-onaning telefon raqami',
			'Mamlakat',
			'Hudud',
			'Manzil',
			'Hozirgi mutaxassislik',
			'Kurs',
			'To‘lov turi',
			'Qabul yili',
			'Tahsil shakli',
			'Til sertifikati',
			'Semestr',
			'Ilmiy rahbar',
			'Ilmiy maslahatchi',
			'Stajirovka rahbari',
			'Ichki ritsenzent',
			'Tashqi ritsenzent',
			'Diplom mavzusi',
			'Akademik ta’til',
			'Tugatish yili',
			'Diplom raqami',
			'Avvalgi mutaxassislik',
			'Avvalgi universitet',
			'Fakultet nomi',
			'Birinchi maqola',
			'Birinchi maqola jurnali',
			'Birinchi maqola sanasi',
			'Ikkinchi maqola',
			'Ikkinchi maqola jurnali',
			'Ikkinchi maqola sanasi',
		];

		xlsx.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
		worksheet['!cols'] = [
			{ wch: 5 },
			{ wch: 20 },
			{ wch: 20 },
			{ wch: 20 },
			{ wch: 15 },
			{ wch: 15 },
			{ wch: 15 },
			{ wch: 10 },
			{ wch: 15 },
			{ wch: 25 },
			{ wch: 15 },
			{ wch: 25 },
			{ wch: 15 },
			{ wch: 15 },
			{ wch: 30 },
			{ wch: 30 },
			{ wch: 10 },
			{ wch: 15 },
			{ wch: 10 },
			{ wch: 15 },
			{ wch: 20 },
			{ wch: 10 },
			{ wch: 25 },
			{ wch: 25 },
			{ wch: 25 },
			{ wch: 25 },
			{ wch: 25 },
			{ wch: 30 },
			{ wch: 20 },
			{ wch: 15 },
			{ wch: 15 },
			{ wch: 30 },
			{ wch: 30 },
			{ wch: 25 },
			{ wch: 30 },
			{ wch: 30 },
			{ wch: 15 },
			{ wch: 30 },
			{ wch: 30 },
			{ wch: 15 },
		];
		xlsx.utils.book_append_sheet(workbook, worksheet, 'masters_data');

		const filePath = path.join(__dirname, '../data.xlsx');
		xlsx.writeFile(workbook, filePath);

		return filePath;
	}
}
