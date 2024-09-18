<?php
    // Get the contents of the JSON file
    $file = '../dashboard/proposals.json';
    $proposals = json_decode(file_get_contents($file), true);

    // Get the POST data
    $index = $_POST['index'];
    $status = $_POST['status'];
    $feedback = isset($_POST['comments']) ? $_POST['comments'] : $_POST['revisions'];

    // Update the proposal's status and feedback
    $proposals[$index]['status'] = $status;
    if ($status == 'accepted') {
        $proposals[$index]['comments'] = $feedback; // Store comments for accepted proposals
    } elseif ($status == 'rejected') {
        $proposals[$index]['revisions'] = $feedback; // Store revisions for rejected proposals
    }

    // Save the updated proposals back to the JSON file
    file_put_contents($file, json_encode($proposals));

    // Return a success response
    echo json_encode(['success' => true]);
?>
