document.getElementById('project-proposal-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    var formData = new FormData(this);

    // Extract usernames from FormData
    const usernames = [];
    formData.forEach((value, key) => {
        if (key.startsWith('user')) { // Assuming input fields are named username1, username2, etc.
            usernames.push(value);
        }
    });

    // Create the recipients list
    const recipients = usernames.map(username => `${username}@purdue.edu`);

     // Construct email body with all form data
     let emailBody = 'Here is your submitted proposal:\n\n';
     formData.forEach((value, key) => {
         emailBody += `${key}: ${value}\n`;
     });

    // First, submit the form data to submit_form.php
    fetch('submit_form.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log('Form submission successful:', data);
        console.log('names:', recipients.join(','));

        // Now, send an email to the usernames collected above
        fetch('/~zmfieldi/dashboard/send_email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'subject': 'Proposal Submitted Successfully',
                'body': emailBody, // Customize the body content as needed
                'recipients': recipients.join(','), // Join recipients as a comma-separated string
                'from': 'ece362@purdue.edu' // Specify the sender's email
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log('Email sent successfully:', data);
            window.location.href = 'thank_you.html'; // Redirect on success
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
    })
    .catch((error) => {
        console.error('Error submitting form:', error);
    });
});
