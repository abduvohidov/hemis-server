import { IsInt, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateEducationDto {
	@IsInt()
	@IsNotEmpty()
	masterId: number;

	@IsInt()
	@IsOptional() // Marking as optional
	bachelorId?: number;

	@IsInt()
	@IsOptional() // Marking as optional
	facultyId?: number;

	@IsInt()
	@IsOptional() // Marking as optional
	articlesId?: number;

	@IsString()
	@IsNotEmpty()
	currentSpecialization: string;

	@IsString()
	@IsNotEmpty()
	course: string;

	@IsString()
	@IsNotEmpty()
	paymentType: string;

	@IsString()
	@IsNotEmpty()
	entryYear: string;

	@IsString()
	@IsNotEmpty()
	educationForm: string;

	@IsString()
	@IsNotEmpty()
	languageCertificate: string;

	@IsString()
	@IsNotEmpty()
	semester: string;

	@IsString()
	@IsNotEmpty()
	scientificSupervisor: string;

	@IsString()
	@IsNotEmpty()
	scientificAdvisor: string;

	@IsString()
	@IsNotEmpty()
	internshipSupervisor: string;

	@IsString()
	@IsNotEmpty()
	internalReviewer: string;

	@IsString()
	@IsNotEmpty()
	externamReviewer: string;

	@IsString()
	@IsNotEmpty()
	thesisTopic: string;

	@IsString()
	@IsNotEmpty()
	academicLeave: string;

	@IsString()
	@IsNotEmpty()
	scientificInternshipPlace: string;
}
