exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost:27017/hangry-mock';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || global.TEST_DATABASE_URL || 'mongodb://localhost/hangry-test-data';

exports.PORT = process.env.PORT || 8080
