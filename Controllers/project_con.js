const dbCon = require('./db_con');
const validator = require('./validator');
const project = require('../Models/project');

// New Project Form
exports.pnew = (req, res) => {
    project.projectID = 0;
    const projectInfo = project;
    const formAction = '/projects/add';
    const errorMsg = '';
    const actionLabel = 'New Project';

    res.render('project_form', { actionLabel, formAction, projectInfo, errorMsg });
};

// Add New Project to Database
exports.padd = async (req, res) => {
    project.projectTitle = req.body.ptitle;
    project.projectDesc = req.body.pdesc;
    project.projectClient = req.body.cname;
    project.projectStart = req.body.pstart;
    project.projectEnd = req.body.pend;
    project.projectNotes = req.body.pnotes;

    const projectAddQuery = `INSERT INTO Projects(project_title, project_desc, project_start, project_end, project_phase, project_notes, project_created, project_client_fk, project_consultant_fk) 
                            VALUES('${ project.projectTitle }','${ project.projectDesc }','${ project.projectStart }','${ project.projectEnd }', 'Planning', '${ project.projectNotes }', CURDATE(), ${ project.projectClient }, ${ req.cookies.userID })`;
    
    async function projectValidation() {
        validator.checkForNulls([req.body.ptitle, req.body.pdesc, req.body.pstart, req.body.pend]);
        if (validator.isValid === true) { validator.dateValidation(project.projectStart, project.projectEnd); }

        if (validator.isValid === true) { await projectFinalizer(); }
        else { await res.redirect('/projects/revise'); }
    } 

    async function projectFinalizer() {
        dbCon.query(projectAddQuery, (err, results) => {
            if (err){ throw err; }
                            
            console.log(results);
            res.redirect('/dashboard');
        });
    }

    await projectValidation();
};

// Pull List of Projects
exports.plist = (req, res) => {
    const projectListQuery = `SELECT P.project_ID, P.project_title, P.project_created 
                                FROM Projects P  LEFT OUTER JOIN Clients C 
                                ON P.project_client_fk = C.client_ID 
                                WHERE C.client_consultant_fk = ${ req.cookies.userID } ORDER BY project_created DESC;`;

    dbCon.query(projectListQuery, (err, results) => {
        if (err){ throw err; }
        res.send(results);
        res.status(200);
    });
};

// Find Individual Projects
exports.pfind = (req, res) => {
    const projectFindQuery = `SELECT project_ID, project_title, project_desc, project_phase, project_start, project_end, project_notes, project_client_fk 
                                FROM Projects WHERE project_ID = ${ req.body.pname };`;

    dbCon.query(projectFindQuery, (err, results) => {
        if (err){ throw err; }
        
        project.projectID = results[0].project_ID;
        project.projectTitle = results[0].project_title;
        project.projectDesc = results[0].project_desc;
        project.projectPhase = results[0].project_phase;
        project.projectStart = results[0].project_start;
        project.projectEnd = results[0].project_end;
        project.projectNotes = results[0].project_notes;
        project.projectClient = results[0].project_client_fk;

        res.cookie('project_info', project);
        res.redirect('/projects/edit');
    });
};

// Edit Form For Projects
exports.pedit = (req, res) => {
    const actionLabel = 'Edit Project';
    const formAction = '/projects/modify';
    const errorMsg = '';
    const projectInfo = req.cookies.project_info;

    res.cookie('appt_client', project.projectClient);
    res.render('project_form', { actionLabel, formAction, projectInfo, errorMsg });
};

// Project Form With Error Code
exports.perror = (req, res) => {
    let actionLabel = '';
    let formAction = '';
    let projectInfo = {};

    console.log(project.projectID);
    if (project.projectID === 0) {
        actionLabel = 'New Project';
        formAction = '/projects/add';
        projectInfo = project;
    }
    else {
        actionLabel = 'Edit Project';
        formAction = '/projects/modify';
        projectInfo = req.cookies.project_info;
        res.cookie('proj_client', project.projectClient);
    }

    const errorMsg = validator.errorMessage;
    res.render('project_form', { actionLabel, formAction, projectInfo, errorMsg });
};

// Update Project Data in Database
exports.pmod = async (req, res) => {
    project.projectID = req.cookies.project_info.projectID;
    project.projectTitle = req.body.ptitle;
    project.projectDesc = req.body.pdesc;
    project.projectStart = req.body.pstart;
    project.projectEnd = req.body.pend;
    project.projectPhase = req.body.phase;
    project.projectClient = req.body.cname;
    project.projectNotes = req.body.pnotes;

    const projectModQuery = `UPDATE Projects 
                            SET project_title = '${ project.projectTitle }', project_desc = '${ project.projectDesc }', 
                            project_start = '${ project.projectStart }', project_end = '${ project.projectEnd }', 
                            project_phase = '${ project.projectPhase }', project_notes = '${ project.projectNotes }', 
                            project_client_fk = ${ project.projectClient }, project_modified = CURDATE()
                            WHERE project_ID = ${ project.projectID };`;

    async function projectValidation() {
        validator.checkForNulls([req.body.ptitle, req.body.pdesc, req.body.pstart, req.body.pend]);
        if (validator.isValid === true) { validator.dateValidation(project.projectStart, project.projectEnd); }

        if (validator.isValid === true) { await projectFinalizer(); }
        else { await res.redirect('/projects/revise'); }
    }    

    async function projectFinalizer() {
        dbCon.query(projectModQuery, (err, results) => {
            if (err){ throw err; }
            console.log(results);
    
            res.redirect('/dashboard');
        });
    }

    await projectValidation();
};

// Delete Project From Database
exports.pdel = (req, res) => {
    console.log(req.body);

    const delProjectQuery = `DELETE FROM Projects WHERE project_ID = ${ req.body.pnum };`;

    dbCon.query(delProjectQuery, (err, results) => {
        if (err){ throw err; }
        console.log(results);

        res.redirect('/dashboard');
    });
};

// Project Summary Dashboard Panel
exports.pdb = (req, res) => {
    const projectDBQuery = `SELECT project_phase, COUNT(*) AS phase_count 
                            FROM Projects WHERE project_consultant_fk = ${ req.cookies.userID } 
                            GROUP BY project_phase`;

    dbCon.query(projectDBQuery, (err, results) => {
        if (err){ throw err; }
        res.send(results);
    });
};
