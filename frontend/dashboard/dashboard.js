// Function to handle feedback and update project status
function handleFeedback(button) {
    const isAcceptable = confirm("Is the proposal acceptable?");
    const currentStatus = button.getAttribute('data-status');  // Get the current status
    const acceptableCountElement = document.getElementById('acceptable-count');
    const rejectedCountElement = document.getElementById('rejected-count');
    let acceptableCount = parseInt(acceptableCountElement.textContent);
    let rejectedCount = parseInt(rejectedCountElement.textContent);

    // Remove both feedback classes first to ensure a clean state
    button.classList.remove("feedback-red", "feedback-green");

    if (isAcceptable) {
        // If proposal is marked as "Acceptable"
        button.classList.add("feedback-green");
        button.textContent = "Acceptable";
        if (currentStatus !== 'acceptable') {
            if (currentStatus === 'needs-work') {
                // If changing from 'needs-work', decrement rejected projects
                rejectedCount--;
            }
            acceptableCount++;
            button.setAttribute('data-status', 'acceptable');
        }
    } else {
        // If proposal is marked as "Needs Work"
        button.classList.add("feedback-red");
        button.textContent = "Needs Work";
        if (currentStatus !== 'needs-work') {
            if (currentStatus === 'acceptable') {
                // If changing from 'acceptable', decrement acceptable projects
                acceptableCount--;
            }
            rejectedCount++;
            button.setAttribute('data-status', 'needs-work');
        }
    }

    // Update the counts in the DOM
    acceptableCountElement.textContent = acceptableCount;
    rejectedCountElement.textContent = rejectedCount;
}
