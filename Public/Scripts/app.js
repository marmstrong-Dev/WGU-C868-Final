let clientData = [];
let projectData = [];
let appointmenData = [];

// Pulls List of Client Names and IDs
function fetchClientList(index) {
    let clientFetch = new XMLHttpRequest();

    clientFetch.open('GET', '/clients/list', true);
    clientFetch.send();

    clientFetch.onload = () => {
        if (clientFetch.status === 200) {
            const cNamePrompt = document.getElementById('clientName');
            let cNameList = JSON.parse(clientFetch.response);

            for (i = 0; i < cNameList.length; i++) {
                let cNameOpt = document.createElement('option');

                cNameOpt.textContent = cNameList[i].client_name;
                cNameOpt.value = cNameList[i].client_ID;

                cNamePrompt.appendChild(cNameOpt);

                clientData.push({
                    clientCreation: cNameList[i].client_created,
                    clientName: cNameList[i].client_name
                });
            }

            try {
                $.each(clientData, (key, val) => {
                    $('<tr><td>' + val.clientCreation.substr(0, 10) + '</td><td>' + val.clientName + '</td></tr>').appendTo('#clientHistory');
                });
            }
            catch { console.log('No List'); }

            $('#clientName').val(index).change();
        }
    };
}

// Pulls List of Project Names and IDs
function fetchProjectList(index) {
    let projectFetch = new XMLHttpRequest();

    projectFetch.open('GET', '/projects/list', true);
    projectFetch.send();

    projectFetch.onload = () => {
        if (projectFetch.status === 200) {
            const pNamePrompt = document.getElementById('projectName');
            let pNameList = JSON.parse(projectFetch.response);

            for (i = 0; i < pNameList.length; i++) {
                let pNameOpt = document.createElement('option');
                
                pNameOpt.textContent = pNameList[i].project_title;
                pNameOpt.value = pNameList[i].project_ID;

                pNamePrompt.appendChild(pNameOpt);

                projectData.push({
                    projectCreation: pNameList[i].project_created,
                    projectTitle: pNameList[i].project_title
                });
            }

            try {
                $.each(projectData, (key, val) => {
                    $('<tr><td>' + val.projectCreation.substr(0, 10) + '</td><td>' + val.projectTitle + '</td></tr>').appendTo('#projectHistory');
                });
            }
            catch { console.log('No List'); }

            $('#projectName').val(index).change();
        }
    };
}

// Pulls List of Appointment Names and IDs
function fetchAppointmentsList() {
    let appointmentFetch = new XMLHttpRequest();

    appointmentFetch.open('GET', '/appointments/list', true);
    appointmentFetch.send();

    appointmentFetch.onload = () => {
        if (appointmentFetch.status === 200) {
            const aNamePrompt = document.getElementById('appointmentName');
            let aNameList = JSON.parse(appointmentFetch.response);
    
            for (i = 0; i < aNameList.length; i++) {
                let aNameOpt = document.createElement('option');
                
                aNameOpt.textContent = aNameList[i].appointment_desc;
                aNameOpt.value = aNameList[i].appointment_ID;
    
                aNamePrompt.appendChild(aNameOpt);
    
                appointmenData.push({
                    appointmentCreation: aNameList[i].appointment_created,
                    appointmentDesc: aNameList[i].appointment_desc
                });
            }
    
            try {
                $.each(appointmenData, (key, val) => {
                    $('<tr><td>' + val.appointmentCreation.substr(0, 10) + '</td><td>' + val.appointmentDesc + '</td></tr>').appendTo('#appointmentHistory');
                });
            }
            catch { console.log('No List'); }
        }
    };
}

// Lookup User Information
function getConsultant() {
    let getUserData = new XMLHttpRequest();

    getUserData.open('GET', '/auth/lookup', true);
    getUserData.send();

    getUserData.onload = () => {
        if (getUserData.status === 200) {
            const loggedUser = JSON.parse(getUserData.response);

            let userNameBadge = loggedUser[0].consultant_first_name.substr(0, 1) + loggedUser[0].consultant_last_name.substr(0, 1);
            $('#profileBtn').text(userNameBadge);
        }
    };
}
