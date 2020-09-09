const validator = require('../Controllers/validator');
const dbCon = require('../Controllers/db_con');

afterEach(() => { dbCon.destroy(); });

test('Testing Exists Function', () => {
    expect(validator.entryExists('Consultants', 'consultant_ID', 1)).toBeTruthy();
});

test('Test Phone Number Validation', () => {
    expect(validator.phoneValidation('333444534345')).toBeFalsy();
    expect(validator.phoneValidation('3323')).toBeFalsy();
    expect(validator.phoneValidation('1115548585')).toBeTruthy();
});

test('Test Email Validation', () => {
    expect(validator.emailValidation('testaddress.com')).toBeFalsy();
    expect(validator.emailValidation('test@address.com')).toBeTruthy();
});
