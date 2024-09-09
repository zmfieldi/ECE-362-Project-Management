function handleFeedback(button) {
    const isAcceptable = confirm("Is the proposal acceptable?");
    
    // Remove both feedback classes first to ensure a clean state
    button.classList.remove("feedback-red", "feedback-green");

    if (isAcceptable) {
        button.classList.add("feedback-green");
        button.textContent = "Acceptable";
    } else {
        button.classList.add("feedback-red");
        button.textContent = "Needs Work";
    }
}
