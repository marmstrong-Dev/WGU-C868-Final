const express = require('express');
const router = express.Router();
const authController = require('./Controllers/auth_con');
const clientController = require('./Controllers/client_con');
const projectController = require('./Controllers/project_con');
const appointmentController = require('./Controllers/appointment_con');
const reportController = require('./Controllers/report_con');
const validator = require('./Controllers/validator');

// Route for Login Page
router.get('/', (req, res) => {
    validator.errorMessage = '';
    const errorMsg = validator.errorMessage;
    res.clearCookie('userID');
    res.render('login', { errorMsg });
});

// Render Login Page With Validation Errors
router.get('/login', (req, res) => {
    const errorMsg = validator.errorMessage;
    res.render('login', { errorMsg });
});

// Authentication Routes
router.get('/dashboard', authController.dashboard);
router.get('/auth/register', authController.ureg);
router.get('/auth/lookup', authController.ulookup);
router.post('/auth/login', authController.login);
router.get('/auth/logout', authController.logout);
router.post('/auth/new', authController.unew);
router.get('/auth/edit', authController.uedit);
router.post('/auth/modify', authController.umod);

// Client Routes
router.get('/clients/new', clientController.cnew);
router.get('/clients/edit', clientController.cedit);
router.get('/clients/list', clientController.clist);
router.get('/clients/revise', clientController.cerror);
router.post('/clients/find', clientController.cfind);
router.post('/clients/add', clientController.cadd);
router.post('/clients/modify', clientController.cmod);
router.post('/clients/delete', clientController.cdel);

// Project Routes
router.get('/projects/db', projectController.pdb);
router.get('/projects/new', projectController.pnew);
router.get('/projects/edit', projectController.pedit);
router.get('/projects/list', projectController.plist);
router.get('/projects/revise', projectController.perror);
router.post('/projects/find', projectController.pfind);
router.post('/projects/add', projectController.padd);
router.post('/projects/modify', projectController.pmod);
router.post('/projects/delete', projectController.pdel);

// Appointment Routes
router.get('/appointments/db', appointmentController.adb);
router.get('/appointments/new', appointmentController.anew);
router.get('/appointments/edit', appointmentController.aedit);
router.get('/appointments/list', appointmentController.alist);
router.get('/appointments/revise', appointmentController.aerror);
router.post('/appointments/find', appointmentController.afind);
router.post('/appointments/add', appointmentController.aadd);
router.post('/appointments/modify', appointmentController.amod);
router.post('/appointments/delete', appointmentController.adel);

// Reports Routes
router.get('/reports/clients', reportController.rprtClient);
router.post('/reports/clients/filtered', reportController.filterClient);
router.get('/reports/projects', reportController.rprtProject);
router.post('/reports/projects/filtered', reportController.filterProject);
router.get('/reports/appointments', reportController.rprtAppointment);
router.post('/reports/appointments/filtered', reportController.filterAppointment);

module.exports = router;
