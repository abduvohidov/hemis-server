import { compare, hash } from 'bcryptjs';
import { IMasterEntity } from './master.entity.interface';

export class Master implements IMasterEntity {
	private _password: string;

	constructor(
		private readonly _lastName: string,
		private readonly _firstName: string,
		private readonly _middleName: string,
		private readonly _passportNumber: string,
		private readonly _jshshr: string,
		private readonly _dateOfBirth: Date,
		private readonly _gender: string,
		private readonly _nationality: string,
		private readonly _email: string,
		private readonly _phoneNumber: string,
		private readonly _parentPhoneNumber: string,
		passwordHash?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash || '';
		}
	}

	get email(): string {
		return this._email;
	}

	get lastName(): string {
		return this._lastName;
	}

	get firstName(): string {
		return this._firstName;
	}

	get middleName(): string {
		return this._middleName;
	}

	get passportNumber(): string {
		return this._passportNumber;
	}

	get jshshr(): string {
		return this._jshshr;
	}

	// Return dateOfBirth as a Date object
	get dateOfBirth(): Date {
		return new Date(`${this._dateOfBirth}T00:00:00.000Z`);
	}

	get gender(): string {
		return this._gender;
	}

	get nationality(): string {
		return this._nationality;
	}

	get phoneNumber(): string {
		return this._phoneNumber;
	}

	get parentPhoneNumber(): string {
		return this._parentPhoneNumber;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		if (!pass || typeof pass !== 'string') {
			throw new Error('Неверный пароль');
		}
		if (!salt || typeof salt !== 'number') {
			throw new Error('Неверная соль');
		}
		this._password = await hash(pass, salt);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		if (!this._password) {
			throw new Error('Пароль для пользователя не установлен');
		}
		return await compare(pass, this._password);
	}
}