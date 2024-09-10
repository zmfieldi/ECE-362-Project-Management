// Fetch JSON data from localStorage
const proposals = JSON.parse(localStorage.getItem('projectProposals') || '[]');
const groupList = document.getElementById('group-list');
const studentsNotSubmitted = document.getElementById('students-not-submitted');
const projectsNeedingReview = document.getElementById('projects-needing-review');
const clearedCount = document.getElementById('acceptable-count');
const rejectedCount = document.getElementById('rejected-count');

// Initial counts
let reviewCount = proposals.length;
let clearedProjects = 0;
let rejectedProjects = 0;

// Render group list
proposals.forEach((proposal, index) => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('group-item');

    groupDiv.innerHTML = `
        <div class="group-name">Group ${index + 1}: ${proposal.group_name}</div>
        <div class="group-members">
            <span>Members: ${proposal.user1}, ${proposal.user2}, ${proposal.user3}, ${proposal.user4}</span>
            <a href="#" class="proposal-link">View Proposal</a>
            <div class="group-buttons">
                <button class="feedback-button feedback-gray accept-button">Accept</button>
                <button class="feedback-button feedback-gray reject-button">Reject</button>
            </div>
        </div>
        
        <div class="additional-info">
            <div><strong>Project Description:</strong> <br>${proposal.project_description}</div>
            <div><strong>Main Features:</strong> <br>${proposal.main_features}</div>
            <div><strong>External Interfaces:</strong> <br>${proposal.external_interfaces}</div>
            <div><strong>Internal Peripherals:</strong> <br>${proposal.internal_peripherals}</div>
            <div><strong>Timeline:</strong> <br>${proposal.timeline}</div>
            <div><strong>Related Projects:</strong> <br>${proposal.related_projects}</div>
        </div>
    `;

    groupList.appendChild(groupDiv);

    // Add event listener for toggling proposal details
    const proposalLink = groupDiv.querySelector('.proposal-link');
    const additionalInfo = groupDiv.querySelector('.additional-info');

    proposalLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        // Toggle visibility
        if (additionalInfo.style.display === 'none' || additionalInfo.style.display === '') {
            additionalInfo.style.display = 'block';
            proposalLink.textContent = 'Hide Proposal';
        } else {
            additionalInfo.style.display = 'none';
            proposalLink.textContent = 'View Proposal';
        }
    });

    // Add event listeners for Accept and Reject buttons
    const acceptButton = groupDiv.querySelector('.accept-button');
    const rejectButton = groupDiv.querySelector('.reject-button');

    acceptButton.addEventListener('click', function() {
        if (!acceptButton.classList.contains('accepted')) {
            // Update counts
            reviewCount--;
            clearedProjects++;
            const acceptedPopup = document.createElement('div');
            acceptedPopup.setAttribute('id', 'accepted-popup');
            acceptedPopup.innerHTML = `
                <h3>Please provide revisions for the proposal:</h3>
                <textarea id="accepted-feedback" placeholder="Enter your revisions here..." rows="10" cols="100"></textarea>
                <br>
                <button id="finish-accepted-btn">Finish</button>
            `;
            acceptedPopup.style.position = 'fixed';
            acceptedPopup.style.top = '20%';
            acceptedPopup.style.left = '50%';
            acceptedPopup.style.transform = 'translate(-50%, -50%)';
            acceptedPopup.style.padding = '20px';
            acceptedPopup.style.backgroundColor = '#1e1e1e';
            acceptedPopup.style.border = '1px solid #ccc';
            acceptedPopup.style.zIndex = '1000';
            

            document.body.appendChild(acceptedPopup);
            document.getElementById('finish-accepted-btn').addEventListener('click', function() {
                const feedback = document.getElementById('accepted-feedback').value;

                if (feedback.trim() === "") {
                    alert("Please provide feedback before submitting.");
                } else {
                    // Handle rejection submission and feedback storage
                    alert('Proposal accepted with comments provided!');
                    
                    acceptButton.classList.add('accepted');
                    acceptButton.style.backgroundColor = '#4CAF50'; // Green
                    acceptButton.style.color = 'white';
                    rejectButton.disabled = true;
                    rejectButton.style.backgroundColor = '#ccc'; // Grey
                    rejectButton.style.color = '#666';
                    // Remove the popup after submission
                    document.body.removeChild(acceptedPopup);

                    //Include the Revisions
                    addCommentSection(additionalInfo, feedback);
                }
            });
            updateCounts();
        }
    });

    rejectButton.addEventListener('click', function() {
        if (!rejectButton.classList.contains('rejected')) {
            // Update counts
            reviewCount--;
            rejectedProjects++;
            const rejectionPopup = document.createElement('div');
            rejectionPopup.setAttribute('id', 'rejection-popup');
            rejectionPopup.innerHTML = `
                <h3>Please provide revisions for the proposal:</h3>
                <textarea id="rejection-feedback" placeholder="Enter your revisions here..." rows="10" cols="100"></textarea>
                <br>
                <button id="finish-rejection-btn">Finish</button>
            `;
            rejectionPopup.style.position = 'fixed';
            rejectionPopup.style.top = '20%';
            rejectionPopup.style.left = '50%';
            rejectionPopup.style.transform = 'translate(-50%, -50%)';
            rejectionPopup.style.padding = '20px';
            rejectionPopup.style.backgroundColor = '#1e1e1e';
            rejectionPopup.style.border = '1px solid #ccc';
            rejectionPopup.style.zIndex = '1000';

            // Append the popup to the body
            document.body.appendChild(rejectionPopup);
            document.getElementById('finish-rejection-btn').addEventListener('click', function() {
                const feedback = document.getElementById('rejection-feedback').value;

                if (feedback.trim() === "") {
                    alert("Please provide revision feedback before submitting.");
                } else {
                    // Handle rejection submission and feedback storage
                    alert('Proposal rejected with revisions provided!');
                    
                    rejectButton.classList.add('rejected');
                    rejectButton.style.backgroundColor = '#F44336'; // Red
                    rejectButton.style.color = 'white';
                    acceptButton.disabled = true;
                    acceptButton.style.backgroundColor = '#ccc'; // Grey
                    acceptButton.style.color = '#666'; // Change button color to red

                    // Remove the popup after submission
                    document.body.removeChild(rejectionPopup);

                    //Include the Revisions
                    addRevisionsSection(additionalInfo, feedback);
                }
            });
            updateCounts();
        }
    });
});

function addRevisionsSection(additionalInfo, feedback) {
    // Check if a Revisions section already exists
    let revisionsSection = additionalInfo.querySelector('.revisions-section');
    if (!revisionsSection) {
        // Create a new Revisions section with similar formatting to the additional info
        revisionsSection = document.createElement('div');
        revisionsSection.classList.add('revisions-section');
        revisionsSection.innerHTML = `
            <div><strong>Revisions:</strong> <br>${feedback}</div>
        `;

        // Append the revisions section to the end of the additional info
        additionalInfo.appendChild(revisionsSection);
    } else {
        // If it exists, update the content
        revisionsSection.querySelector('div').innerHTML = `<strong>Revisions:</strong> <br>${feedback}`;
    }
}

function addCommentSection(additionalInfo, feedback) {
    // Check if a Revisions section already exists
    let revisionsSection = additionalInfo.querySelector('.revisions-section');
    if (!revisionsSection) {
        // Create a new Revisions section with similar formatting to the additional info
        revisionsSection = document.createElement('div');
        revisionsSection.classList.add('revisions-section');
        revisionsSection.innerHTML = `
            <div><strong>Comments:</strong> <br>${feedback}</div>
        `;

        // Append the revisions section to the end of the additional info
        additionalInfo.appendChild(revisionsSection);
    } else {
        // If it exists, update the content
        revisionsSection.querySelector('div').innerHTML = `<strong>Comments:</strong> <br>${feedback}`;
    }
}

function updateCounts() {
    studentsNotSubmitted.textContent = 360 - (proposals.length * 4); // Assuming 4 members per group
    projectsNeedingReview.textContent = reviewCount;
    clearedCount.textContent = clearedProjects;
    rejectedCount.textContent = rejectedProjects;
}

// Initialize counts
updateCounts();


