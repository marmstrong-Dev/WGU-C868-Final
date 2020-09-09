function fillProjectSummary() {
    let projectSummaryFetch = new XMLHttpRequest();

    projectSummaryFetch.open('GET', '/projects/db', true);
    projectSummaryFetch.send();

    projectSummaryFetch.onload = () => {
        if (projectSummaryFetch.status === 200) {
            let pCountList = JSON.parse(projectSummaryFetch.response);

            let planningCount = 0;
            let progressCount = 0;
            let closingCount = 0;
            let totalCount = 0;

            for (i = 0; i < pCountList.length; i++) {
                switch(pCountList[i].project_phase) {
                    case 'Planning':
                        planningCount = pCountList[i].phase_count;
                        break;
                    case 'In Development':
                        progressCount = pCountList[i].phase_count;
                        break;
                    case 'Closing':
                        closingCount = pCountList[i].phase_count;
                        break;
                }

                if (pCountList[i].phase_count != 'Completed') { totalCount = totalCount + pCountList[i].phase_count; }
            }

            $('#totalProjectsCount').text(totalCount).change();
            $('#planningCount').text(`Planning : ${ planningCount }`).change();
            $('#inProgressCount').text(`In Progress : ${ progressCount }`).change();
            $('#closingCount').text(`Closing : ${ closingCount }`).change();
        }
    };
}

function fillUpcomingAppointments() {
    let appointmentSummaryFetch = new XMLHttpRequest();

    appointmentSummaryFetch.open('GET', '/appointments/db', true);
    appointmentSummaryFetch.send();

    appointmentSummaryFetch.onload = () => {
        if (appointmentSummaryFetch.status === 200) {
            let aCountList = JSON.parse(appointmentSummaryFetch.response);

            try {
                $.each(aCountList, (key, val) => {
                    $('<tr><td>' + val.appointment_desc + '</td><td>' + val.appointment_start + '</td><td>' + val.appointment_end + '</td></tr>').appendTo('#upcomingAppointments');
                });
            }
            catch { console.log('No List'); }
        }
    };
}

$(document).ready(function () {
    getConsultant();
    fetchClientList(0);
    fetchProjectList(0);
    fetchAppointmentsList();
    fillProjectSummary();
    fillUpcomingAppointments();
});
