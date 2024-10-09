import { Articles, Student } from '@prisma/client';

export interface IArticleService {
	prepareArticle: (data: Articles) => Promise<Articles | null>;
	removeArticle: (id: number) => Promise<Articles | null>;
	changeArticle: (id: number, data: Partial<Articles>) => Promise<Articles | null>;
	//gets
	getAll: () => Promise<Articles[]>;
	getById: (id: number) => Promise<Articles | null>;
	getByValues: (filters: Partial<Articles>) => Promise<Student[] | []>;
}
