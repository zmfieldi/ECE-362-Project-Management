document.getElementById('project-proposal-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent actual form submission

    // Capture form data
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());

    // Convert form data to JSON and store in localStorage
    const storedData = JSON.parse(localStorage.getItem('projectProposals') || '[]');
    storedData.push(formObject);
    localStorage.setItem('projectProposals', JSON.stringify(storedData));

    // Clear the form and display a thank you message
    const formElement = document.getElementById('project-proposal-form');
    formElement.innerHTML = '<h2>Thank you for your submission!</h2>';
});