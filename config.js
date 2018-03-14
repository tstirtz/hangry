exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost:27017/hangry-mock';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || global.TEST_DATABASE_URL || 'mongodb://localhost/hangry-test';

exports.PORT = process.env.PORT || 8080

exports.JWT_SECRET = process.env.JWT_SECRET || 'testsecretkey';

exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
