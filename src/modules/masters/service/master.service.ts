import xlsx from 'xlsx';
import path from 'path';
import { TYPES } from '../../../types';
import { Master } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IConfigService } from '../../../config';
import { IMasterService } from './master.service.interface';
import { MasterRegisterDto } from '../dto/master-register.dto';
import { IMasterEntity } from '../models/master.entity.interface';
import { Master as MasterEntity, IMasterRepository } from '../index';
import { IUsersRepository } from '../../users';

@injectable()
export class MasterService implements IMasterService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.MasterRepository) private masterRepository: IMasterRepository,
		@inject(TYPES.UserRepository) private userRepository: IUsersRepository,
	) {}

	async create(master: MasterRegisterDto): Promise<IMasterEntity | string | null> {
		// check if email is unique
		const existedMastersEmail = await this.masterRepository.findByEmail(master.email);
		const existedUserEmail = await this.userRepository.findByEmail(master.email);
		if (existedMastersEmail !== null || existedUserEmail !== null)
			return 'Bunday email avval qo`shilgan';
		// check for other unique data
		const existingMastersPassport = await this.masterRepository.findByFilters({
			passportNumber: master.passportNumber,
		});

		if (existingMastersPassport?.length) {
			return 'Passpo`rt raqam  avval kiritilgan ';
		}
		const existingMastersPhone = await this.masterRepository.findByFilters({
			phoneNumber: master.phoneNumber,
		});

		if (existingMastersPhone?.length) {
			return 'Telefon raqam avval kiritilgan ';
		}
		const existingMastersJshshr = await this.masterRepository.findByFilters({
			jshshr: master.jshshr,
		});

		if (existingMastersJshshr?.length) {
			return 'JSHSHIR avval kiritilgan ';
		}
		// Unless create master
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
			master.avatarUrl,
			master.password,
		);
		const salt = this.configService.get('SALT');
		await newmaster.setPassword(master.password, Number(salt));
		return await this.masterRepository.create(newmaster);
	}

	async getAll(): Promise<Master[]> {
		return this.masterRepository.findAll();
	}

	async update(id: number, master: Partial<Master>): Promise<any | string> {
		const existingMaster = await this.masterRepository.findById(id);
		if (!existingMaster) {
			return 'Bunday magistr topilmadi';
		}

		// Check if the password is included in the update data
		if (master.password) {
			// Only hash and update the password if it was provided
			const updatedMasterEntity = new MasterEntity(
				existingMaster.lastName,
				existingMaster.firstName,
				existingMaster.middleName,
				existingMaster.passportNumber,
				existingMaster.jshshr,
				existingMaster.dateOfBirth,
				existingMaster.gender,
				existingMaster.nationality,
				existingMaster.email,
				existingMaster.phoneNumber,
				existingMaster.parentPhoneNumber,
				existingMaster.avatarUrl,
				master.password, // Use the updated password
			);
			const salt = this.configService.get('SALT');
			await updatedMasterEntity.setPassword(master.password, Number(salt));

			// Replace the plaintext password with the hashed one
			master.password = updatedMasterEntity.password;
		}
		const res = await this.masterRepository.update(id, master);
		console.log(res);
		console.log(res?.education[0]);

		return res;
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

	async getByFilters(data: Partial<Master>): Promise<Master[] | []> {
		const masterFilters = {
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
		const hasmasterFilters = Object.keys(masterFilters).length > 0;
		if (!hasmasterFilters) {
			return [];
		}
		return this.masterRepository.findByFilters(masterFilters);
	}

	async generateXlsxFile(masters: any[]): Promise<string> {
		const workbook = xlsx.utils.book_new();

		const data = masters?.map((master) => {
			const masterEducation = master?.education[0] || {};
			const masterAddress = master?.addresses[0] || {};
			const masterBachelor = masterEducation?.bachelor || {};
			const masterFaculty = masterEducation?.faculty || {};
			const masterArticle = masterEducation?.article || {};

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
				Country: masterAddress.country || '-',
				Region: masterAddress.region || '-',
				Address: masterAddress.address || '-',
				//education
				CurrentSpecialization: masterEducation.currentSpecialization || '-',
				Course: masterEducation.course || '-',
				PaymentType: masterEducation.paymentType || '-',
				EntryYear: masterEducation.entryYear || '-',
				Form: masterEducation.masterEducationcationForm || '-',
				LanguageCertification: masterEducation.languageCertificate || '-',
				Semester: masterEducation.semester || '-',
				ScientificSupervisor: masterEducation.scientificSupervisor || '-',
				ScientificAdvisor: masterEducation.scientificAdvisor || '-',
				InternshipSupervisor: masterEducation.internshipSupervisor || '-',
				InternalReviewer: masterEducation.internalReviewer || '-',
				ExternamReviewer: masterEducation.externamReviewer || '-',
				ThesisTopic: masterEducation.thesisTopic || '-',
				AcademicLeave: masterEducation.academicLeave || '-',
				// bachelors
				GraduationYear: masterBachelor.graduationYear || '-',
				DiplomaNumber: masterBachelor.diplomaNumber || '-',
				PreviousSpecialization: masterBachelor.previousSpecialization || '-',
				PreviousUniversity: masterBachelor.previousUniversity || '-',
				// Faculty
				FacultyName: masterFaculty.name || '-',
				// Article
				FirstArticle: masterArticle.firstArticle || '-',
				SecondArticle: masterArticle.secondArticle || '-',
				FirstArticleJournal: masterArticle.firstArticleJournal || '-',
				SecondArticleJournal: masterArticle.secondArticleJournal || '-',
				FirstArticleDate: masterArticle.firstArticleDate || '-',
				SecondArticleDate: masterArticle.secondArticleDate || '-',
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
		const filename = `report-${Math.floor(Math.random() * 1000000)}.xlsx`;
		const filePath = path.join(__dirname, `../${filename}`);
		xlsx.writeFile(workbook, filePath);

		return filename;
	}
}
