import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsDate, Length, IsNumber } from 'class-validator';

export class StudentRegisterDto {
	@IsNotEmpty()
	@IsNumber()
	readonly id: number;

	@IsNotEmpty()
	@IsString()
	readonly lastName: string;

	@IsNotEmpty()
	@IsString()
	readonly firstName: string;

	@IsString()
	readonly middleName: string;

	@IsNotEmpty()
	@IsString()
	readonly passportNumber: string;

	@IsNotEmpty()
	@IsString()
	readonly jshshr: string;

	@IsDate()
	@Type(() => Date)
	readonly dateOfBirth: Date;

	@IsNotEmpty()
	@IsString()
	readonly gender: string;

	@IsNotEmpty()
	@IsString()
	readonly nationality: string;

	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	@IsString()
	readonly phoneNumber: string;

	@IsNotEmpty()
	@IsString()
	readonly parentPhoneNumber: string;

	@IsNotEmpty()
	@IsString()
	@Length(6, 20, { message: 'Длина вашего пароля должна быть больше 6' })
	readonly password: string;
}
