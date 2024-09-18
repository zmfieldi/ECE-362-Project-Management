document.getElementById('project-proposal-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    var formData = new FormData(this);

    // Extract usernames from FormData
    const usernames = [];
    formData.forEach((value, key) => {
        if (key.startsWith('user')) { 
            usernames.push(value);
        }
    });

    // Create the recipients list
    const recipients = usernames.map(username => `${username}@purdue.edu`);

     // Construct email body with form data
     let emailBody = 'Here is your submitted proposal:\n\n';
     formData.forEach((value, key) => {
         emailBody += `${key}: ${value}\n`;
     });

    // Submit the form data to submit_form.php
    fetch('./backend/submit_form.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log('Form submission successful:', data);
        console.log('names:', recipients.join(','));

        // Send a post request to send email 
        fetch('./backend/send_email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'subject': 'Proposal Submitted Successfully',
                'body': emailBody, 
                'recipients': recipients.join(','), 
                'from': 'ece362@purdue.edu' 
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log('Email sent successfully:', data);
            window.location.href = 'thank_you.html'; 
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
    })
    .catch((error) => {
        console.error('Error submitting form:', error);
    });
});
