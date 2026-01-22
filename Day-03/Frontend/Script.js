<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Landing Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="container">
            <div class="logo">ProductName</div>
            <ul class="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#signup" class="cta-button">Sign Up</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1 class="hero-title">Welcome to the Future</h1>
            <p class="hero-subtitle">Discover amazing features that will transform your workflow</p>
            <a href="#signup" class="btn-primary">Get Started</a>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
        <div class="container">
            <h2 class="section-title">Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Lightning Fast</h3>
                    <p>Experience blazing fast performance with our optimized platform</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure</h3>
                    <p>Your data is protected with enterprise-grade security</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Responsive</h3>
                    <p>Works seamlessly across all devices and screen sizes</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing">
        <div class="container">
            <h2 class="section-title">Pricing</h2>
            <div class="pricing-grid">
                <div class="pricing-card">
                    <h3>Basic</h3>
                    <div class="price">$9<span>/month</span></div>
                    <ul class="pricing-features">
                        <li>Feature 1</li>
                        <li>Feature 2</li>
                        <li>Feature 3</li>
                    </ul>
                    <button class="btn-secondary">Choose Plan</button>
                </div>
                <div class="pricing-card featured">
                    <div class="badge">Popular</div>
                    <h3>Pro</h3>
                    <div class="price">$29<span>/month</span></div>
                    <ul class="pricing-features">
                        <li>All Basic Features</li>
                        <li>Advanced Feature 1</li>
                        <li>Advanced Feature 2</li>
                        <li>Priority Support</li>
                    </ul>
                    <button class="btn-primary">Choose Plan</button>
                </div>
                <div class="pricing-card">
                    <h3>Enterprise</h3>
                    <div class="price">$99<span>/month</span></div>
                    <ul class="pricing-features">
                        <li>All Pro Features</li>
                        <li>Custom Integration</li>
                        <li>Dedicated Support</li>
                        <li>Custom SLA</li>
                    </ul>
                    <button class="btn-secondary">Choose Plan</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="testimonials">
        <div class="container">
            <h2 class="section-title">What Our Users Say</h2>
            <div class="testimonials-grid">
                <div class="testimonial-card">
                    <div class="stars">★★★★★</div>
                    <p>"This product has completely transformed how I work. Highly recommended!"</p>
                    <div class="testimonial-author">- John Doe</div>
                </div>
                <div class="testimonial-card">
                    <div class="stars">★★★★★</div>
                    <p>"The best investment I've made this year. The features are incredible."</p>
                    <div class="testimonial-author">- Jane Smith</div>
                </div>
                <div class="testimonial-card">
                    <div class="stars">★★★★★</div>
                    <p>"Simple, powerful, and exactly what I needed. Great customer support too!"</p>
                    <div class="testimonial-author">- Mike Johnson</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Signup Form Section -->
    <section id="signup" class="signup">
        <div class="container">
            <h2 class="section-title">Join Us Today</h2>
            <p class="section-subtitle">Sign up to get started and receive exclusive updates</p>
            <div class="form-container">
                <form id="signupForm" class="signup-form">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                        <span class="error-message" id="nameError"></span>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                        <span class="error-message" id="emailError"></span>
                    </div>
                    <button type="submit" class="btn-primary btn-submit">Sign Up</button>
                    <div id="successMessage" class="success-message"></div>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ProductName. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
