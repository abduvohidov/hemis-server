import { IAddress } from './address.entity.interface';

export class Address implements IAddress {
	constructor(
		private readonly _country: string,
		private readonly _region: string,
		private readonly _address: string,
		private readonly _studentId: number,
	) {}

	get country(): string {
		return this._country;
	}

	get region(): string {
		return this._region;
	}

	get address(): string {
		return this._address;
	}

	get studentId(): number {
		return this._studentId;
	}
}
