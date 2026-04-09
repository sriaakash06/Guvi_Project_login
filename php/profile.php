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

function redis_get($url, $token, $key) {
    $ch = curl_init("$url/get/$key");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token"]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $res = json_decode(curl_exec($ch), true);
    curl_close($ch);
    return isset($res['result']) ? $res['result'] : null;
}

function redis_expire($url, $token, $key, $seconds) {
    $ch = curl_init("$url/expire/$key/$seconds");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token"]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_exec($ch);
    curl_close($ch);
}

$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';
$token = $_POST['token'] ?? $_GET['token'] ?? '';
$email = $_POST['email'] ?? $_GET['email'] ?? '';

if (empty($token) || empty($email)) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized request.']);
    exit;
}

try {
    // 1. Check Session in Redis
    $sessionEmail = redis_get(REDIS_URL, REDIS_TOKEN, "session:$token");

    if (!$sessionEmail || $sessionEmail !== $email) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid or expired session.']);
        exit;
    }

    // Extend session
    redis_expire(REDIS_URL, REDIS_TOKEN, "session:$token", 7200);

    // 2. Connect to MySQL
    $mysqli = get_db_connection();

    if ($action === 'get') {
        $stmt = $mysqli->prepare("SELECT age, dob, contact FROM profiles WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $res = $stmt->get_result();
        $profileData = $res->fetch_assoc();
        
        if (!$profileData) {
            $profileData = ['age' => '', 'dob' => '', 'contact' => ''];
        }

        echo json_encode(['status' => 'success', 'data' => $profileData]);
        $stmt->close();

    } elseif ($action === 'update') {
        $age     = trim($_POST['age']     ?? '');
        $dob     = trim($_POST['dob']     ?? '');
        $contact = trim($_POST['contact'] ?? '');

        $stmt = $mysqli->prepare("UPDATE profiles SET age=?, dob=?, contact=? WHERE email = ?");
        $stmt->bind_param("ssss", $age, $dob, $contact, $email);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows === 0) {
                $stmt_ins = $mysqli->prepare("INSERT INTO profiles (email, age, dob, contact) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE age=?, dob=?, contact=?");
                $stmt_ins->bind_param("sssssss", $email, $age, $dob, $contact, $age, $dob, $contact);
                $stmt_ins->execute();
                $stmt_ins->close();
            }
            echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully!']);
        } else {
             echo json_encode(['status' => 'error', 'message' => 'SQL Update Error.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action.']);
    }

    $mysqli->close();

} catch (Throwable $e) {
    http_response_code(200);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>