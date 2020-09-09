const pass1 = document.getElementById('createPassword');
const pass2 = document.getElementById('confirmPassword');

// Toggles Correct / Incorrect Validation Icons - Matching
function swapMatchIcons() {
    if (pass1.value === pass2.value && pass1.value != '') {
        $('#passMatch').show();
        $("#passMismatch").hide();
    }
    else if (pass1.value != pass2.value) {
        $('#passMatch').hide();
        $("#passMismatch").show();
    }
}

// Toggles Correct / Incorrect Validation Icons - Complexity
function swapValidateIcons() {
    let meetsCapsCriteria = false;
    let meetsNumCriteria = false;

    if (pass1.value.length >= 8) {
        for (i = 0; i < pass1.value.length; i++) {
            if (pass1.value[i].toUpperCase() === pass1.value[i] && !Number.isInteger(Number.parseInt(pass1.value[i]))) {
                meetsCapsCriteria = true;
            }

            if (Number.isInteger(Number.parseInt(pass1.value[i]))) {
                meetsNumCriteria = true;
            }
        }
    }

    if (meetsCapsCriteria && meetsNumCriteria) {
        console.log('Passed'); 
        $('#passConfirm').show();
        $('#passInvalid').hide();
        swapMatchIcons();
    }
    else {
        console.log('Failed'); 
        $('#passConfirm').hide();
        $('#passInvalid').show();
        swapMatchIcons();
    }
}

// On Page Load
$(document).ready(function () {
    $("#passMatch").hide();
    $("#passMismatch").hide();
    $("#passConfirm").hide();
    $("#passInvalid").hide();

    $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' }); 

    $('#createPassword').blur(function () {
        swapValidateIcons();
    });

    $('#confirmPassword').blur(function () {
        swapMatchIcons();
    });

    $('#delBtn').on('click', (e) => {
        e.preventDefault();
        
        $("#promptDel").modal();
    
        $('#confirmDel').on('click', (e) => {
            $('#delRequest').submit();
        });
    });
});
