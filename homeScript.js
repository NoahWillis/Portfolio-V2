// Optimized Page transition functionality
const transitions = {
    overlay: null,
    
    init() {
        this.overlay = document.getElementById('transitionOverlay');
        this.hideOnLoad();
        this.setupNavigation();
    },
    
    hideOnLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.overlay.style.opacity = '0';
                setTimeout(() => this.overlay.style.display = 'none', 300);
            }, 400);
        });
    },
    
    navigate(url) {
        this.overlay.style.display = 'flex';
        this.overlay.style.opacity = '1';
        setTimeout(() => window.location.href = url, 300);
    },
    
    setupNavigation() {
        document.addEventListener('DOMContentLoaded', () => {
            const projectsLink = document.querySelector('a[href="projects.html"]');
            if (projectsLink) {
                projectsLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigate('projects.html');
                });
            }
        });
    }
};

// Optimized Modal Management System
const modals = {
    elements: {},
    
    init() {
        this.elements = {
            contact: document.getElementById('contactModal'),
            success: document.getElementById('successModal'),
            terminal: document.getElementById('terminalModal')
        };
        this.setupClickOutside();
    },
    
    open(type) {
        if (this.elements[type]) {
            this.elements[type].style.display = 'flex';
        }
    },
    
    close(type) {
        if (this.elements[type]) {
            this.elements[type].style.display = 'none';
        }
    },
    
    setupClickOutside() {
        window.onclick = (event) => {
            Object.entries(this.elements).forEach(([type, modal]) => {
                if (event.target === modal) {
                    this.close(type);
                }
            });
        };
    }
};

// Legacy function wrappers for backward compatibility
const openContactModal = () => modals.open('contact');
const closeContactModal = () => modals.close('contact');
const openSuccessModal = () => modals.open('success');
const closeSuccessModal = () => modals.close('success');
const closeTerminal = () => modals.close('terminal');

// Optimized EmailJS Handler
const emailHandler = {
    config: {
        publicKey: 'c-h3e75GW6xwDt0_m',
        serviceId: atob('c2VydmljZV9paGdueXVt'),
        templateId: atob('dGVtcGxhdGVfYnVoeTdkYQ')
    },
    
    init() {
        emailjs.init(this.config.publicKey);
        this.setupFormHandler();
    },
    
    setupFormHandler() {
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('contactForm');
            if (form) {
                form.addEventListener('submit', (e) => this.handleSubmit(e));
            }
        });
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitButton = document.querySelector('.btn-primary');
        const originalText = submitButton.textContent;
        
        this.setButtonState(submitButton, 'Sending...', true);
        
        try {
            const formData = new FormData(e.target);
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                to_name: 'Noah Willis',
                reply_to: formData.get('email')
            };
            
            await emailjs.send(this.config.serviceId, this.config.templateId, templateParams);
            this.handleSuccess(templateParams.from_name);
            e.target.reset();
            
        } catch (error) {
            console.error('Email send failed:', error);
            alert('Sorry, there was an error sending your message. Please try again or contact me directly.');
        } finally {
            this.setButtonState(submitButton, originalText, false);
        }
    },
    
    setButtonState(button, text, disabled) {
        button.textContent = text;
        button.disabled = disabled;
    },
    
    handleSuccess(senderName) {
        closeContactModal();
        document.getElementById('successMessage').textContent = 
            `Thank you, ${senderName}! Your message has been sent successfully. I'll get back to you soon!`;
        openSuccessModal();
    }
};

// Optimized Terminal System
const terminal = {
    input: null,
    output: null,
    commands: {
        help: 'Available commands: help, clear, about, contact, projects, dir, cd projects, echo [text]',
        about: 'Noah Willis - Software Developer\nPassionate about creating innovative solutions.',
        contact: 'Email: noah.willis2014@gmail.com\nLinkedIn: linkedin.com/in/noah-willis07',
        projects: 'Check out my projects page for detailed information about my work.',
        dir: 'NoahWillis.java\nREADME.md\nprojects/\ncontact.txt',
        ls: 'NoahWillis.java\nREADME.md\nprojects/\ncontact.txt'
    },
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.input = document.getElementById('terminal-input');
            this.output = document.getElementById('terminal-output');
            
            if (this.input) {
                this.setupEventListeners();
            }
        });
    },
    
    setupEventListeners() {
        this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.handleCommand(this.input.value);
                this.input.value = '';
            }
        });
        
        this.output.addEventListener('click', () => this.input.focus());
    },
    
    open() {
        modals.open('terminal');
        setTimeout(() => {
            this.input.focus();
            document.querySelector('.cursor')?.classList.add('blinking');
        }, 500);
    },
    
    handleCommand(command) {
        this.addCommandLine(command);
        
        const cmd = command.toLowerCase().trim();
        let response = '';
        
        if (this.commands[cmd]) {
            response = this.commands[cmd];
        } else if (['clear', 'cls'].includes(cmd)) {
            this.clearTerminal();
            return;
        } else if (['cd projects', 'cd projects/'].includes(cmd)) {
            response = 'Navigating to projects directory...';
            setTimeout(() => window.location.href = 'projects.html', 1000);
        } else if (cmd.startsWith('echo ')) {
            response = command.substring(5);
        } else if (cmd === '') {
            return;
        } else {
            response = `'${command}' is not recognized as an internal or external command.`;
        }
        
        if (response) {
            this.addResponse(response);
        }
        
        this.output.scrollTop = this.output.scrollHeight;
    },
    
    addCommandLine(command) {
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.textContent = `C:\\Portfolio> ${command}`;
        
        const terminalPrompt = document.querySelector('.terminal-prompt');
        this.output.insertBefore(commandLine, terminalPrompt);
    },
    
    addResponse(response) {
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-output-line';
        responseLine.style.whiteSpace = 'pre-line';
        responseLine.textContent = response;
        
        const terminalPrompt = document.querySelector('.terminal-prompt');
        this.output.insertBefore(responseLine, terminalPrompt);
    },
    
    clearTerminal() {
        const lines = this.output.querySelectorAll('.terminal-line, .terminal-output-line');
        lines.forEach((line, index) => {
            if (index >= 6) line.remove();
        });
    }
};

// Legacy function wrappers
const runCode = () => terminal.open();
const handleTerminalCommand = (command) => terminal.handleCommand(command);

// Optimized Method Collapsing
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

// Initialize all systems
document.addEventListener('DOMContentLoaded', () => {
    transitions.init();
    modals.init();
    emailHandler.init();
    terminal.init();
});
