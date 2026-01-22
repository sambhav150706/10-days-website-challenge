// Form validation and submission
const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const successMessage = document.getElementById('successMessage');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate name
function validateName(name) {
    if (!name.trim()) {
        return 'Name is required';
    }
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters';
    }
    return '';
}

// Validate email
function validateEmail(email) {
    if (!email.trim()) {
        return 'Email is required';
    }
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
}

// Clear errors
function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    nameInput.classList.remove('error');
    emailInput.classList.remove('error');
}

// Show error
function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add('error');
}

// Handle form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors and success message
    clearErrors();
    successMessage.classList.remove('show');
    
    // Get form values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    
    // Validate inputs
    const nameErrorMsg = validateName(name);
    const emailErrorMsg = validateEmail(email);
    
    let hasError = false;
    
    if (nameErrorMsg) {
        showError(nameInput, nameError, nameErrorMsg);
        hasError = true;
    }
    
    if (emailErrorMsg) {
        showError(emailInput, emailError, emailErrorMsg);
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // Disable submit button
    const submitButton = signupForm.querySelector('.btn-submit');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    try {
        // Send data to backend
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show success message
            successMessage.textContent = data.message || 'Thank you for signing up! We\'ll be in touch soon.';
            successMessage.classList.add('show');
            
            // Reset form
            signupForm.reset();
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Show error message
            successMessage.textContent = data.error || 'Something went wrong. Please try again.';
            successMessage.style.background = '#fee2e2';
            successMessage.style.color = '#991b1b';
            successMessage.classList.add('show');
        }
    } catch (error) {
        console.error('Error:', error);
        successMessage.textContent = 'Unable to connect to server. Please try again later.';
        successMessage.style.background = '#fee2e2';
        successMessage.style.color = '#991b1b';
        successMessage.classList.add('show');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Sign Up';
    }
});

// Real-time validation
nameInput.addEventListener('blur', () => {
    const error = validateName(nameInput.value);
    if (error) {
        showError(nameInput, nameError, error);
    } else {
        nameInput.classList.remove('error');
        nameError.textContent = '';
    }
});

emailInput.addEventListener('blur', () => {
    const error = validateEmail(emailInput.value);
    if (error) {
        showError(emailInput, emailError, error);
    } else {
        emailInput.classList.remove('error');
        emailError.textContent = '';
    }
});

// Clear errors on input
nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('error')) {
        const error = validateName(nameInput.value);
        if (!error) {
            nameInput.classList.remove('error');
            nameError.textContent = '';
        }
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
        const error = validateEmail(emailInput.value);
        if (!error) {
            emailInput.classList.remove('error');
            emailError.textContent = '';
        }
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

