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
            acceptButton.classList.add('accepted');
            acceptButton.style.backgroundColor = '#4CAF50'; // Green
            acceptButton.style.color = 'white';
            rejectButton.disabled = true;
            rejectButton.style.backgroundColor = '#ccc'; // Grey
            rejectButton.style.color = '#666';
            updateCounts();
        }
    });

    rejectButton.addEventListener('click', function() {
        if (!rejectButton.classList.contains('rejected')) {
            // Update counts
            reviewCount--;
            rejectedProjects++;
            rejectButton.classList.add('rejected');
            rejectButton.style.backgroundColor = '#F44336'; // Red
            rejectButton.style.color = 'white';
            acceptButton.disabled = true;
            acceptButton.style.backgroundColor = '#ccc'; // Grey
            acceptButton.style.color = '#666';
            updateCounts();
        }
    });
});

function updateCounts() {
    studentsNotSubmitted.textContent = 360 - (proposals.length * 4); // Assuming 4 members per group
    projectsNeedingReview.textContent = reviewCount;
    clearedCount.textContent = clearedProjects;
    rejectedCount.textContent = rejectedProjects;
}

// Initialize counts
updateCounts();
