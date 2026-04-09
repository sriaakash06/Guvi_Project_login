// Three.js Background Animation
function initBackground() {
    const canvas = document.querySelector('#background-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Creating a group of floating geometric shapes
    const group = new THREE.Group();
    scene.add(group);

    // Mouse movement tracking
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const geometry = new THREE.IcosahedronGeometry(1, 1);
    
    for (let i = 0; i < 60; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: i % 2 === 0 ? 0x7f00ff : 0xe100ff,
            transparent: true,
            opacity: 0.4,
            wireframe: true
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        const scale = Math.random() * 2 + 1;
        mesh.scale.set(scale, scale, scale);
        group.add(mesh);
    }

    const light = new THREE.PointLight(0xffffff, 1, 500);
    light.position.set(20, 20, 20);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    function animate() {
        requestAnimationFrame(animate);
        
        // Tilt the whole group based on mouse
        group.rotation.y += (mouseX * 0.5 - group.rotation.y) * 0.05;
        group.rotation.x += (mouseY * 0.5 - group.rotation.x) * 0.05;
        
        group.children.forEach((child, i) => {
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
            // Subtle floating effect
            child.position.y += Math.sin(Date.now() * 0.001 + i) * 0.02;
        });

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// Profile Data Management
$(document).ready(function() {
    initBackground();

    // Fetch initial profile data
    function loadProfile() {
        const token = localStorage.getItem('session_token');
        const email = localStorage.getItem('user_email');

        if (!token || !email) {
            window.location.href = 'login.html';
            return;
        }

        $.ajax({
            url: 'php/profile.php',
            type: 'GET',
            data: { action: 'get', token: token, email: email },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    const data = response.data;
                    $('#username').val(data.username || email.split('@')[0]);
                    $('#email').val(email);
                    $('#age').val(data.age || '');
                    $('#contact').val(data.contact || '');
                    $('#dob').val(data.dob || '');
                } else if (response.status === 'error' && (response.message === 'Invalid session' || response.message === 'Unauthorized request.')) {
                    localStorage.removeItem('session_token');
                    localStorage.removeItem('user_email');
                    window.location.href = 'login.html';
                } else {
                    showAlert('Error loading profile: ' + response.message, 'danger');
                }
            },
            error: function() {
                showAlert('Failed to connect to server', 'danger');
            }
        });
    }

    // Update profile data
    $('#profileForm').on('submit', function(e) {
        e.preventDefault();
        const token = localStorage.getItem('session_token');
        const email = localStorage.getItem('user_email');

        const formData = {
            age: $('#age').val(),
            contact: $('#contact').val(),
            dob: $('#dob').val(),
            action: 'update',
            token: token,
            email: email
        };

        $.ajax({
            url: 'php/profile.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    showAlert('Profile updated successfully!', 'success');
                } else {
                    showAlert('Update failed: ' + response.message, 'danger');
                }
            },
            error: function() {
                showAlert('Server error during update', 'danger');
            }
        });
    });

    // Logout logic
    $('#logoutBtn').on('click', function() {
        const token = localStorage.getItem('session_token');
        $.ajax({
            url: 'php/login.php',
            type: 'POST',
            data: { action: 'logout', token: token },
            success: function() {
                localStorage.removeItem('session_token');
                localStorage.removeItem('user_email');
                window.location.href = 'login.html';
            }
        });
    });

    function showAlert(message, type) {
        const alertHtml = `<div class="alert alert-${type}">${message}</div>`;
        $('#alert-container').html(alertHtml).hide().fadeIn();
        setTimeout(() => {
            $('.alert').fadeOut(() => $(this).remove());
        }, 5000);
    }

    loadProfile();
});
