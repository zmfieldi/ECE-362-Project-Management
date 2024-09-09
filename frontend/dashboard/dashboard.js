document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});

function updateDashboard() {
    const feedbackButtons = document.querySelectorAll('.feedback-button');
    const projectsNeedingReviewElement = document.getElementById('projects-needing-review');
    const studentsNotSubmittedElement = document.getElementById('students-not-submitted');
    const totalStudents = 360; // Total number of students
    const studentsPerGroup = 4;
    const numberOfGroups = feedbackButtons.length;
    
    // Initialize counts
    projectsNeedingReviewElement.textContent = numberOfGroups;
    studentsNotSubmittedElement.textContent = totalStudents - (numberOfGroups * studentsPerGroup);
}

function handleFeedback(button) {
    const isAcceptable = confirm("Is the proposal acceptable?");
    const currentStatus = button.getAttribute('data-status');  // Get the current status
    const acceptableCountElement = document.getElementById('acceptable-count');
    const rejectedCountElement = document.getElementById('rejected-count');
    const projectsNeedingReviewElement = document.getElementById('projects-needing-review');
    const studentsNotSubmittedElement = document.getElementById('students-not-submitted');
    
    let acceptableCount = parseInt(acceptableCountElement.textContent);
    let rejectedCount = parseInt(rejectedCountElement.textContent);
    let projectsNeedingReview = parseInt(projectsNeedingReviewElement.textContent);
    const totalStudents = 360; // Total number of students
    const studentsPerGroup = 4;
    const numberOfGroups = document.querySelectorAll('.feedback-button').length;

    // Remove both feedback classes first to ensure a clean state
    button.classList.remove("feedback-red", "feedback-green");

    if (isAcceptable) {
        button.classList.add("feedback-green");
        button.textContent = "Acceptable";
        if (currentStatus === 'pending') {
            acceptableCount++; // Increment acceptable count
            projectsNeedingReview--; // Decrement projects needing review
        } else if (currentStatus === 'needs-work') {
            rejectedCount--; // Decrement rejected count
            acceptableCount++; // Increment acceptable count
        }
        button.setAttribute('data-status', 'acceptable');
    } else {
        button.classList.add("feedback-red");
        button.textContent = "Needs Work";
        if (currentStatus === 'pending') {
            rejectedCount++; // Increment rejected count
            projectsNeedingReview--; // Decrement projects needing review
        } else if (currentStatus === 'acceptable') {
            acceptableCount--; // Decrement acceptable count
            rejectedCount++; // Increment rejected count
        }
        button.setAttribute('data-status', 'needs-work');
    }

    // Update the counts in the DOM
    acceptableCountElement.textContent = acceptableCount;
    rejectedCountElement.textContent = rejectedCount;
    projectsNeedingReviewElement.textContent = projectsNeedingReview;
    studentsNotSubmittedElement.textContent = totalStudents - (numberOfGroups * studentsPerGroup);
}
