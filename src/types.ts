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

	//Faculty
	FacultyModel: Symbol.for('FacultyModel'),
	FacultyService: Symbol.for('FacultyService'),
	FacultyRepository: Symbol.for('FacultyRepository'),
	FacultyController: Symbol.for('FacultyController'),
};

export const ROLES = {
	admin: 'admin',
	director: 'director',
	teamLead: 'teamLead',
	teacher: 'teacher',
	student: 'student',
};
