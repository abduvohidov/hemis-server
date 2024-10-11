import { Address, Master } from '@prisma/client';

export interface IAddress extends Address {
	master?: Master;
}
