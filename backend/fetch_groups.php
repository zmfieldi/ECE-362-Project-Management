<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Path to the JSON file containing group data
$filePath = '../group_data.json';

// Check if the file exists
if (file_exists($filePath)) {
    // Read the contents of the file
    $jsonData = file_get_contents($filePath);
    
    // Set the Content-Type header to JSON
    header('Content-Type: application/json');
    
    // Output the JSON data
    echo $jsonData;
} else {
    // Return an error message if the file does not exist
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['error' => 'Group data file not found.']);
}
?>
