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
    $puid1 = $_POST['puid1'];
    $puid2 = $_POST['puid2'];
    $puid3 = $_POST['puid3'];
    $puid4 = $_POST['puid4'];

    // Handle file upload
    if (isset($_FILES['proposal']) && $_FILES['proposal']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/proposals/';
        $uploadFile = $uploadDir . basename($_FILES['proposal']['name']);
        if (move_uploaded_file($_FILES['proposal']['tmp_name'], $uploadFile)) {
            $stmt = $conn->prepare("INSERT INTO groups (puid1, puid2, puid3, puid4, proposal_file) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $puid1, $puid2, $puid3, $puid4, $uploadFile);
            $stmt->execute();
            $stmt->close();
        } else {
            echo "Failed to upload proposal.";
        }
    }

    // Redirect to the dashboard
    header("Location: dashboard.php");
    exit();
}

$conn->close();
?>

