const dbCon = require('./db_con');
const validator = require('./validator');
const client = require('../Models/client');

// New Client Page
exports.cnew = (req, res) => {
    client.clientID = 0;
    const clientInfo = client;
    const errorMsg = '';
    const formAction = '/clients/add';
    const actionLabel = 'New Client';

    res.render('client_form', { actionLabel, formAction, clientInfo, errorMsg });
};

// Add New Client to Database
exports.cadd = async (req, res) => {
    client.clientName = req.body.cname;
    client.clientPOC = req.body.pocname;
    client.clientEmail = req.body.pocemail;
    client.clientPhone = req.body.pocphone.replace(/\D/g, '');
    client.clientNotes = req.body.cnotes;

    if (req.body.clientsize === 'ind') { client.clientIsOrg = false; }
    else if (req.body.clientsize === 'org') { client.clientIsOrg = true; }

    const clientAddQuery = `INSERT INTO Clients (client_name, client_is_org, client_poc_name, client_phone, client_email, client_notes, client_created, client_consultant_fk)
                            VALUES ('${ client.clientName }', ${ client.clientIsOrg }, '${ client.clientPOC }', '${ client.clientPhone }', '${ client.clientEmail }', '${ client.clientNotes }', CURDATE(), ${ req.cookies.userID })`;

    async function clientValidation() {
        validator.checkForNulls([req.body.cname, req.body.pocphone, req.body.pocemail]);
        if (validator.isValid === true) { validator.phoneValidation(client.clientPhone); }
        if (validator.isValid === true) { validator.emailValidation(req.body.pocemail); }
        
        if (validator.isValid === true) { await clientFinalizer(); }
        else if (validator.isValid === false) { await res.redirect('/clients/revise'); }
    }

    async function clientFinalizer() {
        dbCon.query(clientAddQuery, (err, results) => {
            if (err){ throw err; }
            console.log(results);
    
            res.redirect('/dashboard');
        });
    }

    await clientValidation();
};

// Pull List of Clients
exports.clist = (req, res) => {
    const clientListQuery = `SELECT client_ID, client_name, client_created FROM Clients WHERE client_consultant_fk = ${ req.cookies.userID } ORDER BY client_created DESC;`;

    dbCon.query(clientListQuery, (err, results) => {
        if (err){ throw err; }
        res.send(results);
        res.status(200);
    });
};

// Find Individual Clients
exports.cfind = (req, res) => {
    const clientFindQuery = `SELECt * FROM Clients WHERE client_ID = ${ req.body.cname }`;

    dbCon.query(clientFindQuery, (err, results) => {
        if (err){ throw err; }
        
        client.clientID = results[0].client_ID;
        client.clientName = results[0].client_name;
        client.clientPOC = results[0].client_poc_name;
        client.clientEmail = results[0].client_email;
        client.clientPhone = results[0].client_phone;
        client.clientNotes = results[0].client_notes;
        client.clientOwner = results[0].client_consultant_fk;

        if (results[0].client_is_org === 1) { client.clientIsOrg = true }
        else { client.clientIsOrg = false }

        res.cookie('client_info', client);
        res.redirect('/clients/edit');
    });
};

// Edit Client Page
exports.cedit = (req, res) => {
    const actionLabel = 'Edit Client';
    const formAction = '/clients/modify';
    const errorMsg = '';
    const clientInfo = req.cookies.client_info;

    res.render('client_form', { actionLabel, formAction, clientInfo, errorMsg });
};

// Render Client Form With Validation Errors
exports.cerror = (req, res) => {
    let actionLabel = '';
    let formAction = '';
    let clientInfo = {};

    if (client.clientID === 0) {
        actionLabel = 'New Client';
        formAction = '/clients/add';
        clientInfo = client;
    }
    else {
        actionLabel = 'Edit Client';
        formAction = '/clients/modify';
        clientInfo = req.cookies.client_info;
    }

    const errorMsg = validator.errorMessage;
    res.render('client_form', { actionLabel, formAction, clientInfo, errorMsg });
};

// Modify Client in the Database
exports.cmod = async (req, res) => {
    client.clientID = req.cookies.client_info.clientID;
    client.clientName = req.body.cname;
    client.clientPOC = req.body.pocname;
    client.clientEmail = req.body.pocemail;
    client.clientPhone = req.body.pocphone.replace(/\D/g, '');
    client.clientNotes = req.body.cnotes;
    client.clientOwner = req.cookies.client_info.clientOwner;

    if (req.body.clientsize === 'ind') { client.clientIsOrg = false; }
    else if (req.body.clientsize === 'org') { client.clientIsOrg = true; }
    
    const clientModQuery = `UPDATE Clients 
                            SET client_name = '${ client.clientName }', client_is_org = ${ client.clientIsOrg }, 
                            client_poc_name = '${ client.clientPOC }', client_email = '${ client.clientEmail }', 
                            client_phone = '${ client.clientPhone }', client_notes = '${ client.clientNotes }', 
                            client_modified = CURDATE(), client_consultant_fk = ${ client.clientOwner }
                            WHERE client_ID = ${ client.clientID };`;

    async function clientValidation() {
        validator.checkForNulls([req.body.cname, req.body.pocphone, req.body.pocemail]);
        if (validator.isValid === true) { validator.phoneValidation(client.clientPhone); }
        if (validator.isValid === true) { validator.emailValidation(req.body.pocemail); }
        
        if (validator.isValid === true) { await clientFinalizer(); }
        else if (validator.isValid === false) { await res.redirect('/clients/revise'); }
    }

    async function clientFinalizer() {
        dbCon.query(clientModQuery, (err, results) => {
            if (err){ throw err; }
            console.log(results);
    
            res.redirect('/dashboard');
        });
    }

    await clientValidation();
};

// Delete Existing Client in Database
exports.cdel = (req, res) => {
    console.log(req.body);

    const delClientQuery = `DELETE FROM Clients WHERE client_ID = ${ req.body.cnum };`;

    dbCon.query(delClientQuery, (err, results) => {
        if (err){ throw err; }
        console.log(results);

        res.redirect('/dashboard');
    });
};
