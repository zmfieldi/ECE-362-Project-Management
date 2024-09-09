<?php
$servername = "localhost";
$username = "zach";
$password = "Scoobydook0!";
$dbname = "ece362";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $group_id = $_POST['group_id'];

    // Handle feedback file upload
    if (isset($_FILES['feedback']) && $_FILES['feedback']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/feedback/';
        $uploadFile = $uploadDir . basename($_FILES['feedback']['name']);
        if (move_uploaded_file($_FILES['feedback']['tmp_name'], $uploadFile)) {
            $stmt = $conn->prepare("UPDATE groups SET feedback_file = ? WHERE id = ?");
            $stmt->bind_param("si", $uploadFile, $group_id);
            $stmt->execute();
            $stmt->close();
        } else {
            echo "Failed to upload feedback.";
        }
    }

    // Redirect to the dashboard
    header("Location: dashboard.php");
    exit();
}

$conn->close();
?>
