// Page transition functionality
window.addEventListener('load', function() {
    // Hide the transition overlay after page loads
    setTimeout(() => {
        const overlay = document.getElementById('transitionOverlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }, 400);
});

// Add transition when navigating away
function navigateWithTransition(url) {
    const overlay = document.getElementById('transitionOverlay');
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Update navigation links to use transitions
document.addEventListener('DOMContentLoaded', function() {
    const projectsLink = document.querySelector('a[href="projects.html"]');
    if (projectsLink) {
        projectsLink.addEventListener('click', function(e) {
            e.preventDefault();
            navigateWithTransition('projects.html');
        });
    }
});

// Contact Modal Functions
function openContactModal() {
    document.getElementById('contactModal').style.display = 'flex';
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
}

// Success Modal Functions
function openSuccessModal() {
    document.getElementById('successModal').style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const contactModal = document.getElementById('contactModal');
    const successModal = document.getElementById('successModal');
    const terminalModal = document.getElementById('terminalModal');
    
    if (event.target === contactModal) {
        closeContactModal();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
    if (event.target === terminalModal) {
        closeTerminal();
    }
}

// Handle form submission with EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // EmailJS configuration (obfuscated)
    const config = {
        publicKey: atob('Yy1oM2U3NUdXNnh3RHQwX20='), // Base64 encoded - replace with your encoded public key
        serviceId: atob('c2VydmljZV9paGdueXVt'), // Base64 encoded - replace with your encoded service ID
        templateId: atob('dGVtcGxhdGVfYnVoeTdkYQ==') // Base64 encoded - replace with your encoded template ID
    };
    
    // Initialize EmailJS
    emailjs.init(config.publicKey);
    
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitButton = document.querySelector('.btn-primary');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = new FormData(this);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            to_name: 'Noah Willis', // Your name
            reply_to: formData.get('email')
        };
        
        // Send email using EmailJS
        emailjs.send(config.serviceId, config.templateId, templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Reset form and close contact modal
                document.getElementById('contactForm').reset();
                closeContactModal();
                
                // Show success modal
                document.getElementById('successMessage').textContent = 
                    `Thank you, ${templateParams.from_name}! Your message has been sent successfully. I'll get back to you soon!`;
                openSuccessModal();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
            }, function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                alert('Sorry, there was an error sending your message. Please try again or contact me directly.');
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
    });
});

// Method collapsing functionality
function toggleMethod(contentId, iconElement) {
    const content = document.getElementById(contentId);
    const dots = iconElement.nextElementSibling;
    
    if (content.style.display === 'none') {
        // Expand
        content.style.display = 'block';
        iconElement.textContent = '▼';
        iconElement.title = 'Collapse method';
        dots.style.display = 'none';
    } else {
        // Collapse
        content.style.display = 'none';
        iconElement.textContent = '▶';
        iconElement.title = 'Expand method';
        dots.style.display = 'inline';
    }
}

// Terminal/Command Prompt functionality
function runCode() {
    document.getElementById('terminalModal').style.display = 'flex';
    
    // Focus on the terminal input
    setTimeout(() => {
        const terminalInput = document.getElementById('terminal-input');
        terminalInput.focus();
        
        // Add cursor blinking effect
        const cursor = document.querySelector('.cursor');
        cursor.classList.add('blinking');
    }, 500);
}

function closeTerminal() {
    document.getElementById('terminalModal').style.display = 'none';
}

// Terminal input handling
document.addEventListener('DOMContentLoaded', function() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (terminalInput) {
        terminalInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                handleTerminalCommand(this.value);
                this.value = '';
            }
        });
        
        // Focus terminal when clicked
        terminalOutput.addEventListener('click', function() {
            terminalInput.focus();
        });
    }
});

function handleTerminalCommand(command) {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    
    // Add the command to the output
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.textContent = `C:\\Portfolio> ${command}`;
    
    // Insert before the terminal prompt
    const terminalPrompt = document.querySelector('.terminal-prompt');
    terminalOutput.insertBefore(commandLine, terminalPrompt);
    
    // Process the command
    let response = '';
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'help') {
        response = 'Available commands: help, clear, about, contact, projects, dir, cd projects, echo [text]';
    } else if (cmd === 'clear' || cmd === 'cls') {
        // Clear all lines except the header and initial java command
        const lines = terminalOutput.querySelectorAll('.terminal-line, .terminal-output-line');
        lines.forEach((line, index) => {
            if (index >= 6) { // Keep first 6 lines (header + java command)
                line.remove();
            }
        });
        return;
    } else if (cmd === 'cd projects' || cmd === 'cd projects/') {
        response = 'Navigating to projects directory...';
        // Add a delay to simulate directory change, then navigate
        setTimeout(() => {
            window.location.href = 'projects.html';
        }, 1000);
    } else if (cmd === 'about') {
        response = 'Noah Willis - Software Developer\nPassionate about creating innovative solutions.';
    } else if (cmd === 'contact') {
        response = 'Email: noahwillis03@gmail.com\nLinkedIn: linkedin.com/in/noah-willis-498548230';
    } else if (cmd === 'projects') {
        response = 'Check out my projects page for detailed information about my work.';
    } else if (cmd === 'dir' || cmd === 'ls') {
        response = 'NoahWillis.java\nREADME.md\nprojects/\ncontact.txt';
    } else if (cmd.startsWith('echo ')) {
        response = command.substring(5);
    } else if (cmd === '') {
        // Empty command, just add a new prompt
        return;
    } else {
        response = `'${command}' is not recognized as an internal or external command.`;
    }
    
    // Add the response
    if (response) {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-output-line';
        responseLine.style.whiteSpace = 'pre-line';
        responseLine.textContent = response;
        terminalOutput.insertBefore(responseLine, terminalPrompt);
    }
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
