export const TYPES = {
	ILogger: Symbol.for('ILogger'),
	Application: Symbol.for('Application'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	ExeptionFilter: Symbol.for('ExeptionFilter'),

	//User
	UserModel: Symbol.for('UserModel'),
	UserService: Symbol.for('UserService'),
	UserRepository: Symbol.for('UserRepository'),
	UserController: Symbol.for('UserController'),

	//Student
	StudentModel: Symbol.for('StudentModel'),
	StudentService: Symbol.for('StudentService'),
	StudentRepository: Symbol.for('StudentRepository'),
	StudentController: Symbol.for('StudentController'),

	//Address
	AddressModel: Symbol.for('AddressModel'),
	AddressService: Symbol.for('AddressService'),
	AddressRepository: Symbol.for('AddressRepository'),
	AddressController: Symbol.for('AddressController'),

	//Education
	EducationService: Symbol.for('EducationService'),
	EducationRepository: Symbol.for('EducationRepository'),
	EducationController: Symbol.for('EducationController'),
};

export const ROLES = {
	admin: 'admin',
	director: 'director',
	teamLead: 'teamLead',
	teacher: 'teacher',
	student: 'student',
};
