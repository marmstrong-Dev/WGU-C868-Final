const moment = require('moment');
const dbCon = require('./db_con');
const validator = require('./validator');
const appointment = require('../Models/appointment');

// New Appointment Form
exports.anew = (req, res) => {
    appointment.appointmentID = 0;
    const appointmentInfo = appointment;
    const formAction = '/appointments/add';
    const errorMsg = '';
    const actionLabel = 'New Appointment';

    res.render('appointment_form', { actionLabel, formAction, appointmentInfo, errorMsg });
};

// Edit Appointment Form
exports.aedit = (req, res) => {
    const actionLabel = 'Edit Appointment';
    const formAction = '/appointments/modify';
    const errorMsg = '';
    const appointmentInfo = req.cookies.appointment_info;

    res.cookie('appt_state', appointment.appointmentLocationState);
    res.cookie('appt_client', appointment.appointmentClient);

    res.render('appointment_form', { actionLabel, formAction, appointmentInfo, errorMsg });
};

// Pass Validation Error if Fail
exports.aerror = (req, res) => {
    let actionLabel = '';
    let formAction = '';
    let appointmentInfo = {};

    if (appointment.appointmentID === 0) {
        actionLabel = 'New Appointment';
        formAction = '/appointments/add';

        appointmentInfo = appointment
    }
    else {
        actionLabel = 'Edit Appointment';
        formAction = '/appointments/modify';

        appointmentInfo = req.cookies.appointment_info;

        res.cookie('appt_state', appointment.appointmentLocationState);
        res.cookie('appt_client', appointment.appointmentClient);
    }
    
    const errorMsg = validator.errorMessage;
    res.render('appointment_form', { actionLabel, formAction, appointmentInfo, errorMsg });
};

// Add New Appointment to DB
exports.aadd = async (req, res) => {
    appointment.appointmentDesc = req.body.adesc;
    appointment.appointmentClient = req.body.cname;
    appointment.appointmentStart = moment(req.body.astart).utc().format('YYYY-MM-DD HH:mm:ss');
    appointment.appointmentEnd = moment(req.body.aend).utc().format('YYYY-MM-DD HH:mm:ss');
    appointment.appointmentLocationStreet = req.body.astreet;
    appointment.appointmentLocationCity = req.body.acity;
    appointment.appointmentLocationState = req.body.astate;
    appointment.appointmentNotes = req.body.anotes;

    const appointmentAddQuery = `INSERT INTO Appointments(appointment_desc, appointment_start, appointment_end, appointment_street, appointment_city, appointment_state, appointment_notes, appointment_created, appointment_client_fk, appointment_consultant_fk)
                                VALUES ('${ appointment.appointmentDesc }', '${ appointment.appointmentStart }', '${ appointment.appointmentEnd }', '${ appointment.appointmentLocationStreet }', '${ appointment.appointmentLocationCity }', '${ appointment.appointmentLocationState }', 
                                '${ appointment.appointmentNotes }', CURDATE(), ${ appointment.appointmentClient }, ${ req.cookies.userID });`;
    
    async function appointmentValidation(req) {
        validator.checkForNulls([req.body.adesc, req.body.astreet, req.body.acity, req.body.astart, req.body.aend]);
        if (validator.isValid === true) { validator.dateValidation(req.body.astart, req.body.aend); }
    
        if (validator.isValid === true) { await appointmentFinalizer(); }
        else { await res.redirect('/appointments/revise'); }
    }

    async function appointmentFinalizer() {
        dbCon.query(appointmentAddQuery, (err, results) => {
            if (err){ throw err; }
            console.log(results);
            res.redirect('/dashboard');
        });
    }

    await appointmentValidation(req);
};

// Pull List of Appointments for Dashboard / Dropdowns
exports.alist = (req, res) => { // Fix
    const appointmentListQuery = `SELECT appointment_ID, appointment_desc, appointment_created FROM Appointments WHERE appointment_consultant_fk = ${ req.cookies.userID } ORDER BY appointment_created DESC;`;

    dbCon.query(appointmentListQuery, (err, results) => {
        if (err){ throw err; }
        res.send(results);
        res.status(200);
    });
};

// Find Individual Appointment
exports.afind = (req, res) => {
    const appointmentFindQuery = `SELECT appointment_ID, appointment_desc, DATE_FORMAT(appointment_start, '%Y-%m-%dT%H:%i') AS appt_start, DATE_FORMAT(appointment_end, '%Y-%m-%dT%H:%i') AS appt_end, 
                                    appointment_street, appointment_city, appointment_state, appointment_notes, appointment_client_fk, appointment_consultant_fk
                                    FROM Appointments WHERE appointment_ID = ${ req.body.aname };`;

    dbCon.query(appointmentFindQuery, (err, results) => {
        if (err){ throw err; }
        
        appointment.appointmentID = results[0].appointment_ID;
        appointment.appointmentDesc = results[0].appointment_desc;
        appointment.appointmentStart = moment(results[0].appt_start).add((moment().utcOffset()/60), 'hour').format('YYYY-MM-DDTHH:mm:ss');
        appointment.appointmentEnd = moment(results[0].appt_end).add((moment().utcOffset()/60), 'hour').format('YYYY-MM-DDTHH:mm:ss');
        appointment.appointmentLocationStreet = results[0].appointment_street;
        appointment.appointmentLocationCity = results[0].appointment_city;
        appointment.appointmentLocationState = results[0].appointment_state;
        appointment.appointmentNotes = results[0].appointment_notes;
        appointment.appointmentClient = results[0].appointment_client_fk;

        res.cookie('appointment_info', appointment);
        res.redirect('/appointments/edit');
    });
};

// Update Appointment Data in DB
exports.amod = async (req, res) => {
    appointment.appointmentID = req.cookies.appointment_info.appointmentID;
    appointment.appointmentDesc = req.body.adesc;
    appointment.appointmentStart = moment(req.body.astart).utc().format('YYYY-MM-DD HH:mm:ss');
    appointment.appointmentEnd = moment(req.body.aend).utc().format('YYYY-MM-DD HH:mm:ss');
    appointment.appointmentLocationStreet = req.body.astreet;
    appointment.appointmentLocationCity = req.body.acity;
    appointment.appointmentLocationState = req.body.astate;
    appointment.appointmentNotes = req.body.anotes;
    appointment.appointmentClient = req.body.cname;

    const appointmentModQuery = `UPDATE Appointments 
                                SET appointment_desc = '${ appointment.appointmentDesc }', appointment_start = '${ appointment.appointmentStart }', 
                                appointment_end = '${ appointment.appointmentEnd }', appointment_street = '${ appointment.appointmentLocationStreet }', 
                                appointment_city = '${ appointment.appointmentLocationCity }', appointment_state = '${ appointment.appointmentLocationState }', 
                                appointment_client_fk = ${ appointment.appointmentClient }, appointment_modified = CURDATE()
                                WHERE appointment_ID = ${ appointment.appointmentID };`;

    async function appointmentValidation() {
        validator.checkForNulls([req.body.adesc, req.body.astreet, req.body.acity, req.body.astart, req.body.aend]);
        if (validator.isValid === true) { validator.dateValidation(req.body.astart, req.body.aend); }

        if (validator.isValid === true) { await appointmentFinalizer(); }
        else { await res.redirect('/appointments/revise'); }
    }

    async function appointmentFinalizer() {
        dbCon.query(appointmentModQuery, (err, results) => {
            if (err){ throw err; }
            console.log(results);
    
            res.redirect('/dashboard');
        });
    }

    await appointmentValidation();
};

// Delete Appointment in DB
exports.adel = (req, res) => {
    console.log(req.body);

    const delAppointmentQuery = `DELETE FROM Appointments WHERE appointment_ID = ${ req.body.anum };`;

    dbCon.query(delAppointmentQuery, (err, results) => {
        if (err){ throw err; }
        console.log(results);

        res.redirect('/dashboard');
    });
};

// Upcoming Appointments Dashboard Panel
exports.adb = (req, res) => {
    const appointmentDBQuery = `SELECT appointment_desc, appointment_start, appointment_end 
                                FROM Appointments WHERE appointment_consultant_fk = ${ req.cookies.userID } AND appointment_start > CURRENT_TIMESTAMP()
                                ORDER BY appointment_start;`;

    dbCon.query(appointmentDBQuery, (err, results) => {
        if (err){ throw err; }

        for (i = 0; i < results.length; i++) {
            results[i].appointment_start = moment(results[i].appointment_start).local().format('MM/DD/YYYY - h:mm a');
            results[i].appointment_end = moment(results[i].appointment_end).local().format('MM/DD/YYYY - h:mm a');
        }

        res.send(results);
    });
};
