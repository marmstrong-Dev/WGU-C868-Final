const moment = require('moment');
const dbCon = require('./db_con');
let isFiltered = false;

// Client Report Full
exports.rprtClient = (req, res) => {
    const pullClientsQuery = `SELECT client_ID, client_name, client_is_org, client_poc_name, client_email, client_phone, client_notes, client_created, client_modified 
                                FROM Clients WHERE client_consultant_fk = ${ req.cookies.userID };`;

    dbCon.query(pullClientsQuery, (err, results) => {
        if (err){ throw err; }
        const clientsList = results;

        for (i = 0; i < clientsList.length; i++) {
            if (results[i].client_is_org === 1) {
                clientsList[i].client_is_org = 'ORG';
            }
            else {
                clientsList[i].client_is_org = 'IND'
            }

            clientsList[i].client_created = moment(results[i].client_created).local().format('MM/DD/YYYY - h:mm a');
            clientsList[i].client_modified = moment(results[i].client_modified).local().format('MM/DD/YYYY - h:mm a');
        }

        isFiltered = false;
        res.render('client_rpt', { clientsList, isFiltered });
    }); 
};

// Client Report Filtered
exports.filterClient = (req, res) => {
    const filteredClientsQuery = `SELECT client_ID, client_name, client_is_org, client_poc_name, client_email, client_phone, client_notes, client_created, client_modified 
                                    FROM Clients WHERE client_consultant_fk = ${ req.cookies.userID } AND ${ req.body.category } LIKE '%${ req.body.context }%';`;

    if (req.body.context === '' || req.body.category === undefined) {
        isFiltered = false;
        res.redirect('/reports/clients');
    }
    else {
        dbCon.query(filteredClientsQuery, (err, results) => {
            if (err){ throw err; }
            const clientsList = results;
    
            for (i = 0; i < clientsList.length; i++) {
                if (results[i].client_is_org === 1) {
                    clientsList[i].client_is_org = 'ORG';
                }
                else {
                    clientsList[i].client_is_org = 'IND'
                }
            }
    
            isFiltered = true;
            res.render('client_rpt', { clientsList, isFiltered });
        });
    }
};

// Appointment Report Full
exports.rprtAppointment = (req, res) => {
    const pullAppointmentsQuery = `SELECT appointment_ID, appointment_desc, appointment_start, appointment_end, appointment_street, appointment_city, appointment_state, appointment_notes, appointment_created, appointment_modified, client_name 
                                    FROM Appointments A LEFT OUTER JOIN Clients C on A.appointment_client_fk = C.client_ID 
                                    WHERE appointment_consultant_fk = ${ req.cookies.userID };`;


    dbCon.query(pullAppointmentsQuery, (err, results) => {
        if (err){ throw err; }

        for (i = 0; i < results.length; i++) {
            results[i].appointment_start = moment(results[i].appointment_start).local().format('MM/DD/YYYY - h:mm a');
            results[i].appointment_end = moment(results[i].appointment_end).local().format('MM/DD/YYYY - h:mm a');
            results[i].appointment_created = moment(results[i].appointment_created).local().format('MM/DD/YYYY - h:mm a');
            results[i].appointment_modified = moment(results[i].appointment_modified).local().format('MM/DD/YYYY - h:mm a');
        }

        const appointmentsList = results;

        isFiltered = false;
        res.render('appointment_rpt', { appointmentsList, isFiltered });
    });
};

// Appointment Report Filtered
exports.filterAppointment = (req, res) => {
    const filteredAppointmentsQuery = `SELECT appointment_ID, appointment_desc, appointment_start, appointment_end, appointment_street, appointment_city, appointment_state, appointment_notes, client_name 
                                    FROM Appointments A LEFT OUTER JOIN Clients C on A.appointment_client_fk = C.client_ID 
                                    WHERE appointment_consultant_fk = ${ req.cookies.userID } AND ${ req.body.category } LIKE '%${ req.body.context }%';`;

    if (req.body.context === '' || req.body.category === undefined) {
        isFiltered = false;
        res.redirect('/reports/appointments');
    }
    else {
        dbCon.query(filteredAppointmentsQuery, (err, results) => {
            if (err){ throw err; }
    
            for (i = 0; i < results.length; i++) {
                results[i].appointment_start = moment(results[i].appointment_start).local().format('MM/DD/YYYY - h:mm a');
                results[i].appointment_end = moment(results[i].appointment_end).local().format('MM/DD/YYYY - h:mm a');
            }
    
            const appointmentsList = results;
    
            isFiltered = true;
            res.render('appointment_rpt', { appointmentsList, isFiltered });
        });
    }
};

// Project Report Full
exports.rprtProject = (req, res) => {
    const pullProjectsQuery = `SELECT project_ID, project_title, project_desc, project_phase, project_start, project_end, project_notes, project_created, project_modified, client_name 
                                FROM Projects P LEFT OUTER JOIN Clients C ON P.project_client_fk = C.client_ID 
                                WHERE project_consultant_fk = ${ req.cookies.userID };`;

    dbCon.query(pullProjectsQuery, (err, results) => {
        if (err){ throw err; }

        for (i = 0; i < results.length; i++) {
            results[i].project_start = results[i].project_start.toLocaleDateString('en-US');
            results[i].project_end = results[i].project_end.toLocaleDateString('en-US');
            results[i].project_phase = results[i].project_phase.toUpperCase();
            results[i].project_created = moment(results[i].project_created).local().format('MM/DD/YYYY');
            results[i].project_modified = moment(results[i].project_modified).local().format('MM/DD/YYYY');
        }

        const projectsList = results;

        isFiltered = false;
        res.render('project_rpt', { projectsList, isFiltered });
    }); 
};

// Project Report Filtered
exports.filterProject = (req, res) => {
    const filteredProjectsQuery = `SELECT project_ID, project_title, project_desc, project_phase, project_start, project_end, client_name, project_notes, project_created, project_modified 
                                    FROM Projects P LEFT OUTER JOIN Clients C ON P.project_client_fk = C.client_ID
                                    WHERE project_consultant_fk = ${ req.cookies.userID } AND ${ req.body.category } LIKE '%${ req.body.context }%';`;
                                    
    if (req.body.context === '' || req.body.category === undefined) {
        isFiltered = false;
        res.redirect('/reports/projects');
    }
    else {
        dbCon.query(filteredProjectsQuery, (err, results) => {
            if (err){ throw err; }
    
            for (i = 0; i < results.length; i++) {
                results[i].project_start = results[i].project_start.toLocaleDateString('en-US');
                results[i].project_end = results[i].project_end.toLocaleDateString('en-US');
                results[i].project_phase = results[i].project_phase.toUpperCase();
                results[i].project_created = moment(results[i].project_created).local().format('MM/DD/YYYY');
                results[i].project_modified = moment(results[i].project_modified).local().format('MM/DD/YYYY');
            }
    
            const projectsList = results;
    
            isFiltered = true;
            res.render('project_rpt', { projectsList, isFiltered });
        });
    }
};
