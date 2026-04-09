$(document).ready(function() {
    if (localStorage.getItem('session_token')) {
        window.location.href = 'profile.html';
    }
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        let email = $('#email').val().trim();
        let password = $('#password').val();
        
        let $btn = $(this).find('button[type="submit"]');
        let originalText = $btn.text();
        $btn.prop('disabled', true).text('Logging in...');
        
        $.ajax({
            url: 'php/login.php',
            type: 'POST',
            data: {
                action: 'login',
                email: email,
                password: password
            },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    localStorage.setItem('session_token', response.token);
                    localStorage.setItem('user_email', response.email);
                    localStorage.setItem('user_name', response.name);
                    
                    $('#login-alert').html('<div class="alert alert-success">Login successful! Redirection in progress...</div>');
                    setTimeout(function() {
                        window.location.href = 'profile.html';
                    }, 1000);
                } else {
                    $('#login-alert').html('<div class="alert alert-danger">' + response.message + '</div>');
                    $btn.prop('disabled', false).text(originalText);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", xhr.responseText);
                $('#login-alert').html('<div class="alert alert-danger">A server error occurred. Please try again.</div>');
                $btn.prop('disabled', false).text(originalText);
            }
        });
    });
});