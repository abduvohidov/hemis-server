export const TYPES = {
	ILogger: Symbol.for('ILogger'),
	Application: Symbol.for('Application'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),
	ExeptionFilter: Symbol.for('ExeptionFilter'),
	FileStorage: Symbol.for('FileStorage'),
	FileStorageConfig: Symbol.for('FileStorageConfig'),

	//User
	UserModel: Symbol.for('UserModel'),
	UserService: Symbol.for('UserService'),
	UserRepository: Symbol.for('UserRepository'),
	UserController: Symbol.for('UserController'),

	//Masters
	MasterModel: Symbol.for('MasterModel'),
	MasterService: Symbol.for('MasterService'),
	MasterRepository: Symbol.for('MasterRepository'),
	MasterController: Symbol.for('MasterController'),

	//Address
	AddressModel: Symbol.for('AddressModel'),
	AddressService: Symbol.for('AddressService'),
	AddressRepository: Symbol.for('AddressRepository'),
	AddressController: Symbol.for('AddressController'),

	//Education
	EducationService: Symbol.for('EducationService'),
	EducationRepository: Symbol.for('EducationRepository'),
	EducationController: Symbol.for('EducationController'),

	//Faculty
	FacultyModel: Symbol.for('FacultyModel'),
	FacultyService: Symbol.for('FacultyService'),
	FacultyRepository: Symbol.for('FacultyRepository'),
	FacultyController: Symbol.for('FacultyController'),

	//Bachelor
	BachelorModel: Symbol.for('BachelorModel'),
	BachelorService: Symbol.for('BachelorService'),
	BachelorRepository: Symbol.for('BachelorRepository'),
	BachelorController: Symbol.for('BachelorController'),

	//
	ArticleService: Symbol.for('ArticleService'),
	ArticleRepository: Symbol.for('ArticleRepository'),
	ArticleController: Symbol.for('ArticleController'),
};

export const ROLES = {
	admin: 'admin',
	director: 'director',
	teamLead: 'teamLead',
	teacher: 'teacher',
};
