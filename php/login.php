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

function redis_set($url, $token, $key, $value, $ex = 7200) {
    $ch = curl_init("$url/setex/$key/$ex/$value");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token"]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $res = curl_exec($ch);
    curl_close($ch);
    return $res;
}

function redis_get($url, $token, $key) {
    $ch = curl_init("$url/get/$key");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token"]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);
    return isset($res['result']) ? $res['result'] : null;
}

function redis_del($url, $token, $key) {
    $ch = curl_init("$url/del/$key");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token"]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $res = curl_exec($ch);
    curl_close($ch);
    return $res;
}

$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'logout') {
    $token = isset($_POST['token']) ? $_POST['token'] : '';
    if ($token) {
        redis_del(REDIS_URL, REDIS_TOKEN, "session:$token");
    }
    echo json_encode(['status' => 'success']);
    exit;
}

$email    = isset($_POST['email'])    ? trim($_POST['email'])  : '';
$password = isset($_POST['password']) ? $_POST['password']     : '';

if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required.']);
    exit;
}

try {
    $mysqli = get_db_connection();

    $stmt = $mysqli->prepare("SELECT id, name, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();
    $user = $res->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        $token = bin2hex(random_bytes(16));
        
        // Save session in Redis
        redis_set(REDIS_URL, REDIS_TOKEN, "session:$token", $email);

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful!',
            'token' => $token,
            'name' => $user['name'],
            'email' => $email
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    }

    $stmt->close();
    $mysqli->close();

} catch (Throwable $e) {
    echo json_encode(['status' => 'error', 'message' => 'Login Error: ' . $e->getMessage()]);
}
?>