import { Articles, Master } from '@prisma/client';
import { CreateArticleDto } from '../dto/create.article.dto';

export interface IArticleService {
	prepareArticle: (data: CreateArticleDto) => Promise<Articles | string | null>;
	removeArticle: (id: number) => Promise<Articles | null>;
	changeArticle: (id: number, data: Partial<Articles>) => Promise<Articles | null>;
	//gets
	getAll: () => Promise<Articles[]>;
	getById: (id: number) => Promise<Articles | null>;
	getByValues: (filters: Partial<Articles>) => Promise<Master[] | []>;
}
