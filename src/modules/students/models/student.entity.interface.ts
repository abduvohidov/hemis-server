export interface IStudentEntity {
	lastName: string;
	firstName: string;
	middleName: string;
	passportNumber: string;
	jshshr: string;
	dateOfBirth: Date;
	gender: string;
	nationality: string;
	email: string;
	phoneNumber: string;
	parentPhoneNumber: string;
	passwordHash?: string;
}
