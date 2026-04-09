$(document).ready(function() {
    let token = localStorage.getItem('session_token');
    let email = localStorage.getItem('user_email');
    let name  = localStorage.getItem('user_name');
    
    if (!token || !email) {
        alert('Please login to access this profile page.');
        window.location.href = 'login.html';
        return;
    }
    
    $('#email').val(email);
    $('#username').val(name || email.split('@')[0]);
    
    fetchProfile(token, email);
    
    $('#profileForm').on('submit', function(e) {
        e.preventDefault();
        
        let age     = $('#age').val();
        let dob     = $('#dob').val();
        let contact = $('#contact').val();
        
        let $btn = $(this).find('button[type="submit"]');
        let originalText = $btn.text();
        $btn.prop('disabled', true).text('Updating...');
        
        $.ajax({
            url: 'php/profile.php',
            type: 'POST',
            data: {
                action: 'update',
                token: token,
                email: email,
                age: age,
                dob: dob,
                contact: contact
            },
            dataType: 'json',
            success: function(response) {
                $btn.prop('disabled', false).text(originalText);
                if (response.status === 'success') {
                    $('#profile-alert').html('<div class="alert alert-success">' + response.message + '</div>');
                    setTimeout(function(){ $('#profile-alert').empty(); }, 3000);
                } else {
                    handleErrorResponse(response);
                }
            },
            error: function(xhr) {
                console.error(xhr.responseText);
                $btn.prop('disabled', false).text(originalText);
                $('#profile-alert').html('<div class="alert alert-danger">An error occurred while communicating with the server.</div>');
            }
        });
    });
    
    $('#logoutBtn').on('click', function() {
        $.ajax({
            url: 'php/login.php',
            type: 'POST',
            data: { action: 'logout', token: token },
            dataType: 'json',
            complete: function() {
                localStorage.removeItem('session_token');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_name');
                window.location.href = 'login.html';
            }
        });
    });
});

function fetchProfile(token, email) {
    $.ajax({
        url: 'php/profile.php',
        type: 'GET',
        data: { action: 'get', token: token, email: email },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success' && response.data) {
                $('#age').val(response.data.age || '');
                $('#dob').val(response.data.dob || '');
                $('#contact').val(response.data.contact || '');
            } else if (response.status === 'error') {
                handleErrorResponse(response);
            }
        },
        error: function(xhr) {
            console.error(xhr.responseText);
            $('#profile-alert').html('<div class="alert alert-warning">Could not load profile data.</div>');
        }
    });
}

function handleErrorResponse(response) {
    if (response.message === 'Invalid session' || response.message === 'Session expired' || response.message === 'Unauthorized request.' || response.message === 'Invalid or expired session.') {
        localStorage.removeItem('session_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        alert('Your session has expired. Please login again.');
        window.location.href = 'login.html';
    } else {
        $('#profile-alert').html('<div class="alert alert-danger">' + response.message + '</div>');
    }
}