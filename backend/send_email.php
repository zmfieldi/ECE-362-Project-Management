<?php
// Collect POST data
$subject = isset($_POST['subject']) ? $_POST['subject'] : '';
$body = isset($_POST['body']) ? $_POST['body'] : '';
$recipients = isset($_POST['recipients']) ? $_POST['recipients'] : '';
$from = isset($_POST['from']) ? $_POST['from'] : '';

// Validate required fields
if (empty($subject) || empty($body) || empty($recipients) || empty($from)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Set headers
$headers = "From: $from\r\n";
$headers .= "Reply-To: $from\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mail_sent = mail($recipients, $subject, $body, $headers);

// Return response
if ($mail_sent) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?>
