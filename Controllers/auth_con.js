const bcrypt = require('bcryptjs');
const validator = require('./validator');
const dbCon = require('./db_con');
const consultant = require('../Models/consultant');

const saltRounds = 10;

exports.login = (req, res) => {
    const loginFields = [req.body.email, req.body.pass]

    let isValid = false;
    
    isValid = validator.checkForNulls(loginFields);

    if (isValid === true) {
        const lookupUserQuery = `SELECT * FROM Consultants WHERE consultant_email = '${ req.body.email }';`;

        dbCon.query(lookupUserQuery, async (err, results) => {
            if (err) { throw err; }

            if (results.length > 0) {
                const isMatch = await bcrypt.compare(req.body.pass, results[0].consultant_pass);

                try {
                    if (isMatch === true) {
                        res.cookie('userID', results[0].consultant_ID);
                        res.redirect('/dashboard');
                    }
                    else { 
                        validator.errorMessage = 'Invalid Login Credentials';
                        res.redirect('/login');
                    }
                }
                catch (e) { console.log(e); } 
            }
            else {
                validator.errorMessage = 'User Does Not Exist';
                res.redirect('/login');}      
        });    
    }
    else { res.redirect('/login'); }
};

exports.logout = (req, res) => {
    res.clearCookie('userID');
    res.redirect('/');
};

exports.ulookup = (req, res) => {
    const consultantLookupQuery = `SELECT consultant_ID, consultant_last_name, consultant_first_name, consultant_email FROM Consultants WHERE consultant_ID = ${ req.cookies.userID };`;
    
    dbCon.query(consultantLookupQuery, (err, results) => {
        if (err){ throw err; }
        
        res.json(results);
        res.status(200);
    });
};

exports.unew = async (req, res, next) => {
    consultant.consultantFirst = req.body.fname;
    consultant.consultantLast = req.body.lname;
    consultant.consultantEmail = req.body.eaddress;
    
    let isValid = false;

    isValid = validator.checkForNulls([consultant.consultantFirst, consultant.consultantLast, consultant.consultantEmail, req.body.createpass]);

    if (isValid === true) {
        isValid = validator.passwordsMatch(req.body.createpass, req.body.confpass);
        
        if (isValid === true) {
            const hashedPass = await bcrypt.hash(req.body.createpass, saltRounds);
            const regUserQuery = `INSERT INTO Consultants (consultant_first_name, consultant_last_name, consultant_email, consultant_pass) 
                                    VALUES ('${ consultant.consultantFirst }', '${ consultant.consultantLast }', '${ consultant.consultantEmail }', '${ hashedPass }');`;

            try {
                dbCon.query(regUserQuery, (err, results) => {
                    if (err){ throw err; }
                    console.log(results);
                });

                res.status = 500;
            }
            catch { res.status = 400; }          
        }
        else { res.status = 400; }
    }
    else { res.status = 400; }

    if (res.status === 400) { res.redirect('/auth/register'); }
    else if (res.status === 500) { res.redirect('/'); }
};

exports.ureg = (req, res) => {
    consultant.consultantID = 0;
    const consultantInfo = consultant;
    const errorMsg = validator.errorMessage;
    const formAction = '/auth/new';
    const cancelAction = '/';
    const actionLabel = 'New Consultant';

    res.render('registration_form', { actionLabel, formAction, consultantInfo, errorMsg, cancelAction });
};

exports.dashboard = (req, res) => {
    if (req.cookies.userID > 0) {
        // Clears Appointment Cookies
        res.clearCookie('appt_state');
        res.clearCookie('appt_project');
        res.clearCookie('appt_client');

        res.render('dashboard');
    }
    else {
        res.redirect('/');
    }   
};

exports.uedit = (req, res) => {
    consultant.consultantID = req.cookies.userID;
    const errorMsg = validator.errorMessage;
    const formAction = '/auth/modify';
    const cancelAction = '/dashboard';
    const actionLabel = 'Edit Consultant';

    const prefillQuery = `SELECT consultant_first_name, consultant_last_name, consultant_email 
                            FROM Consultants WHERE consultant_ID = ${ consultant.consultantID };`;

    dbCon.query(prefillQuery, (err, results) => {
        if (err){ throw err; }

        consultant.consultantFirst = results[0].consultant_first_name;
        consultant.consultantLast = results[0].consultant_last_name;
        consultant.consultantEmail = results[0].consultant_email;

        const consultantInfo = consultant; 

        res.render('registration_form', { actionLabel, errorMsg, formAction, consultantInfo, cancelAction });
    });
}

exports.umod = async (req, res) => {
    consultant.consultantID = req.cookies.userID;
    consultant.consultantFirst = req.body.fname;
    consultant.consultantLast = req.body.lname;
    consultant.consultantEmail = req.body.eaddress;

    const hashedPass = await bcrypt.hash(req.body.createpass, saltRounds);
    
    async function modValidation() {
        validator.checkForNulls([req.body.fname, req.body.lname, req.body.eaddress, req.body.createpass]);
        if (validator.isValid === true) { validator.passwordsMatch(req.body.createpass, req.body.confpass); }
        if (validator.isValid === true) { await validator.entryExists('Consultants', 'consultant_email', consultant.consultantEmail); }

        setTimeout(modFinalizer, 1000);
    }

    async function modFinalizer() {
        if (validator.isValid === true) {

            const modUserQuery = `UPDATE Consultants 
                                    SET consultant_first_name = '${ consultant.consultantFirst }', consultant_last_name = '${ consultant.consultantLast }', 
                                    consultant_email = '${ consultant.consultantEmail }', consultant_pass = '${ hashedPass }'
                                    WHERE consultant_ID = ${ consultant.consultantID };`

            try {
                dbCon.query(modUserQuery, (err, results) => {
                    if (err){ throw err; }
                    console.log(results);

                    res.redirect('/dashboard');
                });
            }
            catch (e) { res.status = 404; console.log(e); }
        }
        else if (validator.isValid === false) { res.status = 401; console.log('No Pass 4'); }
    }

    await modValidation();
    
}
