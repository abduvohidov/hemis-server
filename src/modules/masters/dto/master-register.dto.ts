import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsDate, Length } from 'class-validator';

export class MasterRegisterDto {
	@IsNotEmpty()
	@IsString()
	readonly lastName: string;

	@IsNotEmpty()
	@IsString()
	readonly firstName: string;
	@IsNotEmpty()
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

	@IsString()
	readonly avatarUrl: string = '';

	@IsNotEmpty()
	@IsString()
	@Length(6, 20, { message: 'Длина вашего пароля должна быть больше 6' })
	readonly password: string;
}
