<?php
// Path to your JSON file
$jsonFilePath = '../dashboard/proposals.json';

// Check if the file exists
if (file_exists($jsonFilePath)) {
    // Read the JSON file contents
    $jsonData = file_get_contents($jsonFilePath);
    
    // Set the content type to JSON
    header('Content-Type: application/json');
    
    // Output the JSON data
    echo $jsonData;
} else {
    // Handle error if file doesn't exist
    header('HTTP/1.1 404 Not Found');
    echo json_encode(array("error" => "File not found"));
}
?>
