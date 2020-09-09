const dbCon = require('./db_con');

const validator = {
    isValid: true,
    errorMessage: '',

    // Checks and array for null values
    checkForNulls: function(fieldArray) {
        this.isValid = true;

        for (i = 0; i < fieldArray.length; i++) {
            if (fieldArray[i] == null || fieldArray[i] == '') {
                this.isValid = false
                this.errorMessage = 'Please Fill All Required Fields';
            }
        }

        return this.isValid;
    },

    // Checks if password meets complexity requirements
    passwordComplexity: function (desiredPass) {
        if (desiredPass.length < 8) {
            this.isValid = false;          
        }
        
        let numCounter = 0;
        let capCounter = 0;

        for (i = 0; i < desiredPass.length; i++) {
            if (Number.isInteger(Number.parseInt(desiredPass[i]))) {
                numCounter = numCounter + 1;
            }
            if (desiredPass[i].toUpperCase() === desiredPass[i] && !Number.isInteger(Number.parseInt(desiredPass[i]))) {
                capCounter = capCounter + 1;
            }
        }

        if (numCounter < 1) { this.isValid = false; }
        if (capCounter < 1) { this.isValid = false; }

        if (this.isValid === false) { this.errorMessage = 'Password Does Not Meet Complexity Requirements'; }
    },

    // Checks if create and confirm password match
    passwordsMatch: function(passA, passB) {
        this.isValid = true;

        if (passA != passB){
            this.isValid = false;
        }

        if (this.isValid === false) { this.errorMessage = 'Passwords Do Not Match'; }
        this.passwordComplexity(passA);

        return this.isValid;
    },

    // Checks if phone number is valid
    phoneValidation: function (checkedNum) {
        this.isValid = false;

        if (checkedNum.length === 10) { this.isValid = true; }
        else { this.errorMessage = 'Phone Number is Invalid'; }

        return this.isValid;
    },

    // Checks if email address if valid
    emailValidation: function (checkedEmail) {
        this.isValid = false;

        if (checkedEmail.indexOf('@') === -1) { this.errorMessage = 'Email Address is Invalid'; }
        else { this.isValid = true; }

        return this.isValid;
    },

    // Checks if start date occurs before end date
    dateValidation: function (sDate, eDate) {
        this.isValid = false;

        if (sDate < eDate) { this.isValid = true; }
        else { this.errorMessage = 'Start Date Must Occur Before End Date'; }
        
        return this.isValid;
    },

    // Checks if field exists in database
    entryExists: async function (tableName, fieldName, fieldVal) { // Needs Fixing
        this.isValid = false;
        const existsQuery = `SELECT COUNT(*) AS found_total FROM ${ tableName } WHERE ${ fieldName } = '${ fieldVal }';`;

        const gateKeeper = new Promise((resolve, reject) => {
            dbCon.query (existsQuery, (err, results) => {
                if (err) { throw err; }
                else { const userCount = results; resolve(userCount); }
            });
        });
        gateKeeper.then((userCount) => {
            if (userCount[0].found_total === 0) { this.isValid = true; }
            else { this.errorMessage = 'Record Already Exists'; }

            return this.isValid;
        });        
    }
};

module.exports = validator;
