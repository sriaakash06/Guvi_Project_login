$(document).ready(function() {
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        
        let name = $('#name').val().trim();
        let email = $('#email').val().trim();
        let password = $('#password').val().trim();
        
        let $btn = $(this).find('button[type="submit"]');
        let originalText = $btn.text();
        $btn.prop('disabled', true).text('Registering...');
        
        $.ajax({
            url: 'php/register.php',
            type: 'POST',
            data: {
                name: name,
                email: email,
                password: password
            },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    $('#register-alert').html('<div class="alert alert-success">' + response.message + ' Redirecting...</div>');
                    setTimeout(function() {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    $('#register-alert').html('<div class="alert alert-danger">' + response.message + '</div>');
                    $btn.prop('disabled', false).text(originalText);
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                $('#register-alert').html('<div class="alert alert-danger">An error occurred while processing your request. Check console for details.</div>');
                $btn.prop('disabled', false).text(originalText);
            }
        });
    });
});
