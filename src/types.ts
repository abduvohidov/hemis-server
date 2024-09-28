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
};

export const ROLES = {
	admin: 'admin',
	director: 'director',
	teamLead: 'teamLead',
	teacher: 'teacher',
	student: 'student',
};
