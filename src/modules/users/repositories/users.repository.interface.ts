import { UserModel } from '@prisma/client';

export interface IUsersRepository {
	create: (user: {
		name: string;
		email: string;
		password?: string;
		lastName: string;
		role: string;
	}) => Promise<UserModel>;
	findByEmail: (email: string) => Promise<UserModel | null>;
}
