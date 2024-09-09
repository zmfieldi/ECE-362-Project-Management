<?php
// Example code for storing data (you may use a database in a real application)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $groupName = $_POST['group_name'];
    $members = [
        $_POST['user1'],
        $_POST['user2'],
        $_POST['user3'],
        $_POST['user4']
    ];

    // Here you would save $groupName and $members to your database or a file
    // Example of saving to a JSON file:
    $filePath = 'path/to/group_data.json';
    $data = json_decode(file_get_contents($filePath), true);
    $data[] = ['name' => $groupName, 'members' => $members, 'status' => 'pending'];
    file_put_contents($filePath, json_encode($data));
}
?>
