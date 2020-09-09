let Appointment = {
    appointmentID: Number,
    appointmentDesc: String,
    appointmentStart: Date,
    appointmentEnd: Date,
    appointmentLocationStreet: String,
    appointmentLocationCity: String,
    appointmentLocationState: String,
    appointmentNotes: String,
    appointmentCreated: Date,
    appointmentModified: Date,
    appointmentClient: Number,
    appointmentOwner: Number
};

module.exports = Appointment;
