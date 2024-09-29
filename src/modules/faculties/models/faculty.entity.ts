import { IFaculty } from './faculty.entity.interface';

export class Faculty implements IFaculty {
	constructor(private readonly _name: string) {}

	get name(): string {
		return this._name;
	}
}
