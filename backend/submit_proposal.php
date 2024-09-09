<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve form data
    $groupName = $_POST['group_name'];
    $members = [
        $_POST['user1'],
        $_POST['user2'],
        $_POST['user3'],
        $_POST['user4']
    ];

    // Handle file upload
    if (isset($_FILES['proposal']) && $_FILES['proposal']['error'] == UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['proposal']['tmp_name'];
        $fileName = $_FILES['proposal']['name'];
        $fileSize = $_FILES['proposal']['size'];
        $fileType = $_FILES['proposal']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        // Define allowed file extensions
        $allowedExtensions = ['pdf'];

        if (in_array($fileExtension, $allowedExtensions)) {
            $uploadFileDir = 'proposals/';
            $dest_path = $uploadFileDir . $fileName;

            if (move_uploaded_file($fileTmpPath, $dest_path)) {
                // File is successfully uploaded
                echo "File is successfully uploaded.<br>";

                // Save group data including file info
                $filePath = '../group_data.json';
                $data = json_decode(file_get_contents($filePath), true);
                $data[] = [
                    'name' => $groupName,
                    'members' => $members,
                    'proposal_file' => $fileName, // Store the uploaded file name
                    'status' => 'pending'
                ];
                file_put_contents($filePath, json_encode($data));

                // Redirect or provide feedback
                header('Location: index.html'); // Redirect to the form page or another page
                exit();
            } else {
                echo "Error moving the uploaded file.";
            }
        } else {
            echo "Upload failed. Allowed file types: " . implode(',', $allowedExtensions);
        }
    } else {
        echo "No file uploaded or upload error.";
    }
} else {
    echo "Invalid request method.";
}
?>
