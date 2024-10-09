import { Articles } from '@prisma/client';

export interface IArticleRepository {
	create: (data: Articles) => Promise<Articles | null>;
	delete: (id: number) => Promise<Articles | null>;
	update: (id: number, data: Partial<Articles>) => Promise<Articles | null>;
	//gets
	findAll: () => Promise<Articles[]>;
	findById: (id: number) => Promise<Articles | null>;
	filterByValues: (filters: Partial<Articles>) => Promise<Articles[] | []>;
}
