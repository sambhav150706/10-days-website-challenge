const form = document.getElementById('contactForm');
const chatWindow = document.getElementById('chatWindow');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function getFieldErrorEl(name) {
  return document.querySelector(`.error[data-error-for="${name}"]`);
}

function setFieldError(name, message) {
  const errorEl = getFieldErrorEl(name);
  const fieldWrapper = errorEl ? errorEl.closest('.field') : null;
  if (!errorEl || !fieldWrapper) return;

  errorEl.textContent = message || '';
  if (message) {
    fieldWrapper.classList.add('invalid');
  } else {
    fieldWrapper.classList.remove('invalid');
  }
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validateForm(values) {
  let isValid = true;
  setFieldError('name');
  setFieldError('email');
  setFieldError('message');

  if (!values.name) {
    setFieldError('name', 'Please enter your name.');
    isValid = false;
  }

  if (!values.email) {
    setFieldError('email', 'Please enter your email.');
    isValid = false;
  } else if (!validateEmail(values.email)) {
    setFieldError('email', 'Please enter a valid email address.');
    isValid = false;
  }

  if (!values.message) {
    setFieldError('message', 'Please write a short message.');
    isValid = false;
  } else if (values.message.length < 5) {
    setFieldError('message', 'Your message is a bit too short.');
    isValid = false;
  }

  return isValid;
}

function setStatus(type, message) {
  if (!statusEl) return;
  statusEl.textContent = message || '';
  statusEl.className = `form-status ${type || ''}`.trim();
}

function setSending(isSending) {
  if (!submitBtn) return;
  submitBtn.disabled = isSending;
  if (isSending) {
    submitBtn.classList.add('sending');
  } else {
    submitBtn.classList.remove('sending');
  }
}

function addUserBubble(message) {
  if (!chatWindow) return;

  const bubble = document.createElement('div');
  bubble.className = 'bubble bubble-out';

  const text = document.createElement('p');
  text.textContent = message;
  bubble.appendChild(text);

  const meta = document.createElement('span');
  meta.className = 'bubble-meta';
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  meta.textContent = `You • ${timeStr}`;
  bubble.appendChild(meta);

  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const values = {
    name: formData.get('name').toString().trim(),
    email: formData.get('email').toString().trim(),
    message: formData.get('message').toString().trim(),
  };

  if (!validateForm(values)) {
    setStatus('error', 'Please fix the highlighted fields.');
    return;
  }

  setSending(true);
  setStatus('', '');

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      const message =
        data && data.error
          ? data.error
          : 'Something went wrong while sending your message. Please try again.';
      setStatus('error', message);
      return;
    }

    setStatus('success', data.message || 'Your message has been sent!');
    addUserBubble(values.message);
    form.reset();
  } catch (error) {
    console.error(error);
    setStatus('error', 'Network error. Please check your connection and try again.');
  } finally {
    setSending(false);
  }
});

