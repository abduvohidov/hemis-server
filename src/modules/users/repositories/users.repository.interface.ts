import { UserModel } from '@prisma/client';

export interface IUsersRepository {
	create: ({ email, name }: any) => Promise<UserModel | null>;
	find: (email: string) => Promise<UserModel | null>;
	findById: (id: string) => Promise<UserModel | null>;
	remove: (id: string) => Promise<UserModel | null>;
}
