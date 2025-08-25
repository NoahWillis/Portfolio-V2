// Simple Email and Modal System - Starting Fresh

// EmailJS Configuration (encoded for security)
const EMAIL_CONFIG = {
    publicKey: 'c-h3e75GW6xwDto_m', // Public key can remain visible
    serviceId: atob('c2VydmljZV9saGdueXVt'), // Base64 encoded service ID
    templateId: atob('dGVtcGxhdGVfYnVoeTdkYQ==') // Base64 encoded template ID
};

// Simple Modal Functions
function openContactModal() {
    document.getElementById('contactModal').style.display = 'flex';
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
}

function openSuccessModal() {
    document.getElementById('successModal').style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Simple Email Handler
function handleContactForm(event) {
    event.preventDefault();
    
    console.log('Form submitted');
    
    // Get form data
    const formData = new FormData(event.target);
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Prepare email template parameters
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        to_name: 'Noah Willis',
        reply_to: formData.get('email')
    };
    
    console.log('Sending email with params:', templateParams);
    console.log('Using Service ID:', EMAIL_CONFIG.serviceId);
    console.log('Using Template ID:', EMAIL_CONFIG.templateId);
    
    // Send email using EmailJS
    emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            
            // Reset form
            event.target.reset();
            
            // Close contact modal
            closeContactModal();
            
            // Update success message
            document.getElementById('successMessage').textContent = 
                `Thank you, ${templateParams.from_name}! Your message has been sent successfully. I'll get back to you soon!`;
            
            // Show success modal
            openSuccessModal();
            
        }, function(error) {
            console.error('Email failed:', error);
            alert('Sorry, there was an error sending your message. Please try again.');
        })
        .finally(function() {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAIL_CONFIG.publicKey);
        console.log('EmailJS initialized');
    } else {
        console.error('EmailJS library not found');
    }
    
    // Setup form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        console.log('Contact form handler attached');
    } else {
        console.error('Contact form not found');
    }
    
    // Setup modal click outside to close
    window.addEventListener('click', function(event) {
        const contactModal = document.getElementById('contactModal');
        const successModal = document.getElementById('successModal');
        
        if (event.target === contactModal) {
            closeContactModal();
        }
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });
});

// Page Transitions
function navigateWithTransition(url) {
    const overlay = document.getElementById('transitionOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
        setTimeout(() => window.location.href = url, 300);
    }
}

// Page Load Transition
window.addEventListener('load', function() {
    setTimeout(() => {
        const overlay = document.getElementById('transitionOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 300);
        }
    }, 400);
});

// Method Collapsing
function toggleMethod(contentId, iconElement) {
    const content = document.getElementById(contentId);
    const dots = iconElement.nextElementSibling;
    const isCollapsed = content.style.display === 'none';
    
    if (isCollapsed) {
        content.style.display = 'block';
        iconElement.textContent = '▼';
        iconElement.title = 'Collapse method';
        dots.style.display = 'none';
    } else {
        content.style.display = 'none';
        iconElement.textContent = '▶';
        iconElement.title = 'Expand method';
        dots.style.display = 'inline';
    }
}

// Terminal Functions
function runCode() {
    document.getElementById('terminalModal').style.display = 'flex';
    setTimeout(() => {
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.focus();
            document.querySelector('.cursor')?.classList.add('blinking');
        }
    }, 500);
}

function closeTerminal() {
    document.getElementById('terminalModal').style.display = 'none';
}

// Terminal Command Handling
function handleTerminalCommand(command) {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalPrompt = document.querySelector('.terminal-prompt');
    
    // Add command line
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.textContent = `C:\\Portfolio> ${command}`;
    terminalOutput.insertBefore(commandLine, terminalPrompt);
    
    // Process command
    let response = '';
    const cmd = command.toLowerCase().trim();
    
    const commands = {
        help: 'Available commands: help, clear, about, contact, projects, dir, cd projects, echo [text]',
        about: 'Noah Willis - Software Developer\nPassionate about creating innovative solutions.',
        contact: 'Email: noah.willis2014@gmail.com\nLinkedIn: linkedin.com/in/noah-willis07',
        projects: 'Check out my projects page for detailed information about my work.',
        dir: 'NoahWillis.java\nREADME.md\nprojects/\ncontact.txt',
        ls: 'NoahWillis.java\nREADME.md\nprojects/\ncontact.txt'
    };
    
    if (commands[cmd]) {
        response = commands[cmd];
    } else if (['clear', 'cls'].includes(cmd)) {
        const lines = terminalOutput.querySelectorAll('.terminal-line, .terminal-output-line');
        lines.forEach((line, index) => {
            if (index >= 6) line.remove();
        });
        return;
    } else if (['cd projects', 'cd projects/'].includes(cmd)) {
        response = 'Navigating to projects directory...';
        setTimeout(() => navigateWithTransition('projects.html'), 1000);
    } else if (cmd.startsWith('echo ')) {
        response = command.substring(5);
    } else if (cmd === '') {
        return;
    } else {
        response = `'${command}' is not recognized as an internal or external command.`;
    }
    
    // Add response
    if (response) {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-output-line';
        responseLine.style.whiteSpace = 'pre-line';
        responseLine.textContent = response;
        terminalOutput.insertBefore(responseLine, terminalPrompt);
    }
    
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Setup Additional Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Terminal input handling
    const terminalInput = document.getElementById('terminal-input');
    if (terminalInput) {
        terminalInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                handleTerminalCommand(this.value);
                this.value = '';
            }
        });
    }
    
    // Projects navigation
    const projectsLink = document.querySelector('a[href="projects.html"]');
    if (projectsLink) {
        projectsLink.addEventListener('click', function(e) {
            e.preventDefault();
            navigateWithTransition('projects.html');
        });
    }
});
