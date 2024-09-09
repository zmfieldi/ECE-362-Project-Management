document.addEventListener('DOMContentLoaded', () => {
    fetchGroupData();
});

function fetchGroupData() {
    fetch('path/to/group_data.json')
        .then(response => response.json())
        .then(groupsData => {
            updateDashboard(groupsData);
            renderGroupList(groupsData);
        })
        .catch(error => console.error('Error fetching group data:', error));
}


function updateDashboard(groupsData) {
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

function renderGroupList(groupsData) {
    const groupListElement = document.querySelector('.group-list');
    groupListElement.innerHTML = ''; // Clear existing content

    groupsData.forEach(group => {
        const groupItem = document.createElement('div');
        groupItem.className = 'group-item';

        const groupName = document.createElement('div');
        groupName.className = 'group-name';
        groupName.textContent = group.name;

        const groupMembers = document.createElement('div');
        groupMembers.className = 'group-members';
        groupMembers.textContent = group.members.join(', ');

        const groupButtons = document.createElement('div');
        groupButtons.className = 'group-buttons';

        const proposalLink = document.createElement('a');
        proposalLink.href = `path/to/proposals/${group.name.replace(/\s+/g, '-')}.pdf`; // Adjust as needed
        proposalLink.textContent = 'Proposal';
        proposalLink.target = '_blank';
        proposalLink.className = 'proposal-link';

        const feedbackButton = document.createElement('button');
        feedbackButton.textContent = 'Feedback';
        feedbackButton.className = `feedback-button feedback-${group.status}`;
        feedbackButton.setAttribute('data-status', group.status);
        feedbackButton.onclick = () => handleFeedback(feedbackButton);

        groupButtons.appendChild(proposalLink);
        groupButtons.appendChild(feedbackButton);

        groupItem.appendChild(groupName);
        groupItem.appendChild(groupMembers);
        groupItem.appendChild(groupButtons);

        groupListElement.appendChild(groupItem);
    });
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

// function fetchGroups() {
//     fetch('fetch_groups.php')
//         .then(response => response.json())
//         .then(data => {
//             const groupList = document.querySelector('.group-list');
//             groupList.innerHTML = ''; // Clear existing content
            
//             data.forEach(group => {
//                 const groupItem = document.createElement('div');
//                 groupItem.className = 'group-item';
                
//                 groupItem.innerHTML = `
//                     <div class="group-name">${group.name}</div>
//                     <div class="group-members">${group.members.join(', ')}</div>
//                     <div class="group-buttons">
//                         <a href="proposals/${group.proposal_file}" class="proposal-link">Proposal</a>
//                         <button class="feedback-button" data-group="${group.name}" data-status="${group.status}">Feedback</button>
//                     </div>
//                 `;
                
//                 groupList.appendChild(groupItem);
//             });
//         })
//         .catch(error => console.error('Error fetching group data:', error));
// }

// // Fetch and display groups when the page loads
// document.addEventListener('DOMContentLoaded', fetchGroups);