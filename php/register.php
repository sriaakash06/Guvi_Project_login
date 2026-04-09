<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once 'config.php';

if (file_exists('../vendor/autoload.php')) {
    require_once '../vendor/autoload.php';
}

$name     = isset($_POST['name'])     ? trim($_POST['name'])     : '';
$email    = isset($_POST['email'])    ? trim($_POST['email'])    : '';
$password = isset($_POST['password']) ? $_POST['password']       : '';

if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

try {
    $mysqli = get_db_connection();

    // Check duplicate email
    $check = $mysqli->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already registered.']);
        $check->close();
        $mysqli->close();
        exit;
    }
    $check->close();

    // Hash + Insert into MySQL
    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $mysqli->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $hashed);

    if ($stmt->execute()) {
        // ✅ Insert profile into MySQL
        $prof = $mysqli->prepare("INSERT INTO profiles (email) VALUES (?)");
        if ($prof) {
            $prof->bind_param("s", $email);
            $prof->execute();
            $prof->close();
        }
        echo json_encode(['status' => 'success', 'message' => 'Registration successful!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $stmt->error]);
    }

    $stmt->close();
    $mysqli->close();

} catch (Throwable $e) {
    http_response_code(200);
    echo json_encode(['status' => 'error', 'message' => "Registration Error: " . $e->getMessage()]);
}
?>
