let aptClient = 0;

const statesList = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 
                    'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 
                    'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE',
                    'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 
                    'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI','WV', 'WY'];

// Populates States Dropdown - Appointments
function populateStatesList() {
    const statePrompt = document.getElementById('appointmentState');

    for (i = 0; i < statesList.length; i++) {
        let stateOpt = document.createElement('option');

        stateOpt.textContent = statesList[i];
        stateOpt.value = statesList[i];

        statePrompt.appendChild(stateOpt);
    }
}

// Populate State Selection - Appointments
function statePrefill() {
    try {
        const aptState = document.cookie.split('; ').find(row => row.startsWith('appt_state')).split('=')[1];
        $('#appointmentState').val(aptState).change();
    }
    catch { console.log('No State Selected'); }    
}

// Pre-Fills Client Dropdown Selection - Projects / Appointments
function clientPrefill() {
    try {
        aptClient = document.cookie.split('; ').find(row => row.startsWith('appt_client')).split('=')[1];
        fetchClientList(aptClient);
    }
    catch {
        fetchClientList(0);
        console.log('New Entry');
    }
}

// Hides POC Name for Individual Clients and Shows for Organizations - Clients
function radioToggler() {
    $('#pocToggle').hide();

    $('#indRdio').click(function() {
        $('#pocName').val('');
        $('#pocToggle').hide();
    });

    $('#orgRdio').click(function() {
        $('#pocToggle').show();
    });
}

// Modal Prompt for Delete Button
$('#delBtn').on('click', (e) => {
    e.preventDefault();
    
    $("#promptDel").modal();

    $('#confirmDel').on('click', (e) => {
        $('#delRequest').submit();
    });
});
