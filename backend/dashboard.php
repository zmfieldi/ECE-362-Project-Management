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

$sql = "SELECT id, puid1, puid2, puid3, puid4, proposal_file, feedback_file FROM groups";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECE 36200 - Project Management Dashboard</title>
    <style>
        /* ... same styles as before ... */
    </style>
</head>
<body>
    <header>
        <div>Total Students: 360</div>
        <div>Students Left: 324</div>
        <div>Cleared Projects: <?php echo $result->num_rows; ?></div>
    </header>
    <div class="group-list">
        <?php
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo '<div class="group-item">';
                echo '<div class="group-name">Group ' . $row["id"] . '</div>';
                echo '<div class="group-members">' . $row["puid1"] . ', ' . $row["puid2"] . ', ' . $row["puid3"] . ', ' . $row["puid4"] . '</div>';
                echo '<div class="group-buttons">';
                echo '<a href="' . $row["proposal_file"] . '"><button>Proposal</button></a>';
                echo '<form action="submit_feedback.php" method="POST" enctype="multipart/form-data">';
                echo '<input type="hidden" name="group_id" value="' . $row["id"] . '">';
                echo '<input type="file" name="feedback" required>';
                echo '<button type="submit" class="feedback-button">Feedback</button>';
                echo '</form>';
                echo '</div>';
                echo '</div>';
            }
        } else {
            echo "No groups have submitted proposals yet.";
        }
        ?>
    </div>
</body>
</html>

<?php
$conn->close();
?>
