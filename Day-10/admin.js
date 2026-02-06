document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('loginForm');
    const messagesList = document.getElementById('messagesList');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check Authentication Status
    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth-check');
            const data = await response.json();
            return data.isAuthenticated;
        } catch (error) {
            console.error('Auth check failed', error);
            return false;
        }
    };

    const isAuthenticated = await checkAuth();
    const currentPage = window.location.pathname;

    // Redirect logic
    if (currentPage.includes('login.html') && isAuthenticated) {
        window.location.href = 'dashboard.html';
        return;
    }

    if (currentPage.includes('dashboard.html') && !isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Login Page Logic
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const loginStatus = document.getElementById('loginStatus');

            loginStatus.textContent = 'Logging in...';
            loginStatus.className = 'form-status';

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    loginStatus.textContent = 'Success! Redirecting...';
                    loginStatus.className = 'form-status success';
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    loginStatus.textContent = data.error || 'Invalid credentials';
                    loginStatus.className = 'form-status error';
                }
            } catch (error) {
                console.error('Login error:', error);
                loginStatus.textContent = 'An error occurred';
                loginStatus.className = 'form-status error';
            }
        });
    }

    // Dashboard Page Logic
    if (messagesList) {
        loadMessages();

        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('/api/logout', { method: 'POST' });
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout failed', error);
            }
        });
    }

    async function loadMessages() {
        try {
            const response = await fetch('/api/messages');
            const data = await response.json();

            if (data.success) {
                renderMessages(data.messages);
            } else {
                messagesList.innerHTML = '<div class="empty-state">Failed to load messages.</div>';
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            messagesList.innerHTML = '<div class="empty-state">Error loading messages.</div>';
        }
    }

    function renderMessages(messages) {
        if (messages.length === 0) {
            messagesList.innerHTML = '<div class="empty-state">No messages yet.</div>';
            return;
        }

        messagesList.innerHTML = messages.map(msg => `
            <div class="message-card">
                <div class="message-header">
                    <div>
                        <div class="message-name">${escapeHtml(msg.name)}</div>
                        <div class="message-email">${escapeHtml(msg.email)}</div>
                    </div>
                    <div class="message-date">${new Date(msg.timestamp).toLocaleString()}</div>
                </div>
                <div class="message-body">
                    ${escapeHtml(msg.message)}
                </div>
            </div>
        `).join('');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
