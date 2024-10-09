import { Address, Student } from '@prisma/client';

export interface IAddress extends Address {
	student?: Student;
}
