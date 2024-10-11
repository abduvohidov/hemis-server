import { Education, Master } from '@prisma/client';

export interface IEducation extends Education {
	master?: Master;
}
