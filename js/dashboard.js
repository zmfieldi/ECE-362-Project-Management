// Email address from which the email will be sent
const emailSender = 'ece362@purdue.edu'; 


// Fetch proposals from proposals.json
fetch('../backend/dashboard.php')
    .then(response => response.json())
    .then(proposals => {
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

            const acceptButtonClass = proposal.status === 'accepted' ? 'accepted' : '';
            const rejectButtonClass = proposal.status === 'rejected' ? 'rejected' : '';

            groupDiv.innerHTML = `
                <div class="group-name">Group ${index + 1}: ${proposal.groupName}</div>
                <div class="group-members">
                    <span>Members: ${proposal.usernames.join(', ')}</span>
                    <a href="#" class="proposal-link">View Proposal</a>
                    <div class="group-buttons">
                        <button class="feedback-button feedback-gray accept-button ${acceptButtonClass}">Accept</button>
                        <button class="feedback-button feedback-gray reject-button ${rejectButtonClass}">Reject</button>
                    </div>
                </div>
                
                <div class="additional-info" style="display: none;">
                    <div><strong>Project Description:</strong> <br>${proposal.projectDescription}</div>
                    <div><strong>Main Features:</strong> <br>${proposal.mainFeatures}</div>
                    <div><strong>External Interfaces:</strong> <br>${proposal.externalInterfaces}</div>
                    <div><strong>Internal Peripherals:</strong> <br>${proposal.internalPeripherals}</div>
                    <div><strong>Timeline:</strong> <br>${proposal.timeline}</div>
                    <div><strong>Related Projects:</strong> <br>${proposal.relatedProjects}</div>
                    ${proposal.status === 'rejected' ? `<div><strong>Revisions:</strong> <br>${proposal.revisions}</div>` : ''}
                    ${proposal.status === 'accepted' ? `<div><strong>Comments:</strong> <br>${proposal.comments}</div>` : ''}
                </div>
            `;

            groupList.appendChild(groupDiv);

            // Update button colors and disable based on status
            const acceptButton = groupDiv.querySelector('.accept-button');
            const rejectButton = groupDiv.querySelector('.reject-button');

            if (acceptButtonClass === 'accepted') {
                acceptButton.style.backgroundColor = '#4CAF50'; // Green
                acceptButton.style.color = 'white';
                acceptButton.disabled = true;
                rejectButton.disabled = true;
                rejectButton.style.backgroundColor = '#ccc';  // Gray
                rejectButton.style.color = '#666';
                clearedProjects++; 
                reviewCount--;

            } else if (rejectButtonClass === 'rejected') {
                rejectButton.style.backgroundColor = '#F44336'; // Red
                rejectButton.style.color = 'white';
                rejectButton.disabled = true;
                acceptButton.disabled = true;
                acceptButton.style.backgroundColor = '#ccc'; // Gray
                acceptButton.style.color = '#666';
                rejectedProjects++;
                reviewCount--
            }

            // Add event listener for viewing proposal details
            const proposalLink = groupDiv.querySelector('.proposal-link');
            const additionalInfo = groupDiv.querySelector('.additional-info');

            proposalLink.addEventListener('click', function(event) {
                event.preventDefault(); 

                if (additionalInfo.style.display === 'none' || additionalInfo.style.display === '') {
                    additionalInfo.style.display = 'block';
                    proposalLink.textContent = 'Hide Proposal';
                } else {
                    additionalInfo.style.display = 'none';
                    proposalLink.textContent = 'View Proposal';
                }
            });

            // Add event listener for accept and reject
            acceptButton.addEventListener('click', function() {
                if (!acceptButton.classList.contains('accepted') && !rejectButton.classList.contains('rejected')) {
                    reviewCount--;
                    clearedProjects++;
                    const acceptPopup = document.createElement('div');
                    acceptPopup.setAttribute('id', 'accept-popup');
                    acceptPopup.innerHTML = `
                        <h3>Please provide comments for the proposal:</h3>
                        <textarea id="accept-comments" placeholder="Enter your comments here..." rows="10" cols="100"></textarea>
                        <br>
                        <button id="finish-accept-btn">Finish</button>
                    `;
                    acceptPopup.style.position = 'fixed';
                    acceptPopup.style.top = '20%';
                    acceptPopup.style.left = '50%';
                    acceptPopup.style.transform = 'translate(-50%, -50%)';
                    acceptPopup.style.padding = '20px';
                    acceptPopup.style.backgroundColor = '#1e1e1e';
                    acceptPopup.style.border = '1px solid #ccc';
                    acceptPopup.style.zIndex = '1000';

                    document.body.appendChild(acceptPopup);
                    document.getElementById('finish-accept-btn').addEventListener('click', function() {
                        const comments = document.getElementById('accept-comments').value;
                        if (comments.trim() === "") {
                            alert("Please provide comments before submitting.");
                        } else {
                            fetch('../backend/update_proposal.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                body: new URLSearchParams({
                                    'index': index,
                                    'status': 'accepted',
                                    'comments': comments
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    alert('Proposal accepted with comments provided!');
                                    acceptButton.classList.add('accepted');
                                    acceptButton.style.backgroundColor = '#4CAF50'; // Green
                                    acceptButton.style.color = 'white';
                                    acceptButton.disabled = true;
                                    rejectButton.disabled = true;
                                    rejectButton.style.backgroundColor = '#ccc'; // Gray
                                    rejectButton.style.color = '#666';
                                    document.body.removeChild(acceptPopup);
                                    updateCounts();
                                    sendEmail(proposal.groupName, 'Accepted', comments, proposal.usernames, proposal);
                                } else {
                                    alert('Error updating proposal.');
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                        }
                    });
                }
            });

            rejectButton.addEventListener('click', function() {
                if (!rejectButton.classList.contains('rejected') && !acceptButton.classList.contains('accepted')) {
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

                    document.body.appendChild(rejectionPopup);
                    document.getElementById('finish-rejection-btn').addEventListener('click', function() {
                        const feedback = document.getElementById('rejection-feedback').value;
                        if (feedback.trim() === "") {
                            alert("Please provide revision feedback before submitting.");
                        } else {
                            fetch('../backend/update_proposal.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                body: new URLSearchParams({
                                    'index': index,
                                    'status': 'rejected',
                                    'revisions': feedback
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    alert('Proposal rejected with revisions provided!');
                                    rejectButton.classList.add('rejected');
                                    rejectButton.style.backgroundColor = '#F44336'; // Red
                                    rejectButton.style.color = 'white';
                                    rejectButton.disabled = true;
                                    acceptButton.disabled = true;
                                    acceptButton.style.backgroundColor = '#ccc'; // Grey
                                    acceptButton.style.color = '#666';
                                    document.body.removeChild(rejectionPopup);
                                    addRevisionsSection(additionalInfo, feedback);
                                    updateCounts();
                                    sendEmail(proposal.groupName, 'Rejected', feedback, proposal.usernames, proposal);
                                } else {
                                    alert('Error updating proposal.');
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                        }
                    });
                }
            });
        });


        function addRevisionsSection(additionalInfo, feedback) {
            let revisionsSection = additionalInfo.querySelector('.revisions-section');
            if (!revisionsSection) {
                revisionsSection = document.createElement('div');
                revisionsSection.classList.add('revisions-section');
                revisionsSection.innerHTML = `
                    <div><strong>Revisions:</strong> <br>${feedback}</div>
                `;
                additionalInfo.appendChild(revisionsSection);
            } else {
                revisionsSection.querySelector('div').innerHTML = `<strong>Revisions:</strong> <br>${feedback}`;
            }
        }

        // Update submission counts
        function updateCounts() {
            studentsNotSubmitted.textContent = 360 - (proposals.length * 4); 
            projectsNeedingReview.textContent = reviewCount;
            clearedCount.textContent = clearedProjects;
            rejectedCount.textContent = rejectedProjects;
        }

        function sendEmail(groupName, status, feedback, usernames, additionalInfo) {
            const subject = `Proposal ${status}: ${groupName}`;
            const body = `
                \rGroup Name: ${groupName}\n
                \r${status === 'Accepted' ? 'Comments:' : 'Reasons For Rejection:'}\n
                \r${feedback}\n
                \rProject Proposal:\n
                \rProject Description: ${additionalInfo.projectDescription}\n
                \rMain Features: ${additionalInfo.mainFeatures}\n
                \rExternal Interfaces: ${additionalInfo.externalInterfaces}\n
                \rInternal Peripherals: ${additionalInfo.internalPeripherals}\n
                \rTimeline: ${additionalInfo.timeline}\n
                \rRelated Projects: ${additionalInfo.relatedProjects}
            `;
        
            // Collect recipient email addresses
            const recipients = usernames.map(username => `${username}@purdue.edu`);
        
            // Send a post request to send email
            fetch('../backend/send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'subject': subject,
                    'body': body,
                    'recipients': recipients.join(','),
                    'from': emailSender
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Email sent successfully');
                } else {
                    console.error('Error sending email');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }        

        updateCounts();
    })
    .catch(error => {
        console.error('Error fetching proposals:', error);
    });



    