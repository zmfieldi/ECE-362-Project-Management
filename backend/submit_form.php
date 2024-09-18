<?php
// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Handle form data without htmlspecialchars
    $groupName = $_POST['group_name'];
    $usernames = [
        $_POST['user1'],
        $_POST['user2'],
        $_POST['user3'],
        $_POST['user4']
    ];
    $projectDescription = $_POST['project_description'];
    $mainFeatures = $_POST['main_features'];
    $externalInterfaces = $_POST['external_interfaces'];
    $internalPeripherals = $_POST['internal_peripherals'];
    $timeline = $_POST['timeline'];
    $relatedProjects = $_POST['related_projects'];

    // Prepare data to be stored
    $data = [
        'groupName' => $groupName,
        'usernames' => $usernames,
        'projectDescription' => $projectDescription,
        'mainFeatures' => $mainFeatures,
        'externalInterfaces' => $externalInterfaces,
        'internalPeripherals' => $internalPeripherals,
        'timeline' => $timeline,
        'relatedProjects' => $relatedProjects,
        'status' => 'Needs Review', // Default status
        'feedback' => '' // Default feedback
    ];

    // Load existing data
    $existingDataPath = '../dashboard/proposals.json';
    $existingData = json_decode(file_get_contents($existingDataPath), true);
    if (!$existingData) {
        $existingData = [];
    }

    // Append new data
    $existingData[] = $data;

    // Save updated data
    file_put_contents($existingDataPath, json_encode($existingData, JSON_PRETTY_PRINT));

    // Redirect to a thank-you page or another appropriate page
    header('Location: thank_you.html');
    exit();
} else {
    // If the form wasn't submitted via POST, redirect to the form page
    header('Location: index.html');
    exit();
}
?>
