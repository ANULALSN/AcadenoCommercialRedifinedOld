document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileBtn) mobileBtn.textContent = '☰';
        });
    });

    // Smooth Scroll for Anchor Links (Native handles it well, but this is a backup/polisher)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Particle Network Animation (Canvas) ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        // Create Particle
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.directionX = (Math.random() * 1) - 0.5; // Speed
                this.directionY = (Math.random() * 1) - 0.5;
                this.size = (Math.random() * 2) + 1;
                this.color = '#6366f1'; // Accent color
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        // Init Particles
        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / 15000; // Density
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        // Connect Particles
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(99, 102, 241,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        init();
        animate();
    }

    // --- Typewriter Effect: completes "AI-Powered ___" ---
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        // Second line — reads like a headline pair with "AI-Powered" above
        // ✦ "AI-Powered / Digital Solutions"
        // ✦ "AI-Powered / Business Automation"
        // ✦ "AI-Powered / Web & Mobile Apps"
        // ✦ "AI-Powered / Smart Innovation"
        // ✦ "AI-Powered / Growth & Scale"
        // ✦ "AI-Powered / Future Delivered"
        const words = [
            "Digital Transformation",
            "Business Intelligence",
            "Software Development",
            "Marketing Solutions",
            "Product Innovation",
            "Enterprise Solutions"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause to let the reader absorb the headline
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400;
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 800);
    }

    // --- 3D Tilt Effect for Cards ---
    const cards = document.querySelectorAll('.program-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before bottom
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // --- Google Sheets Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        // Function to validate a single field
        const validateField = (field) => {
            const name = field.getAttribute('name');
            const value = field.value.trim();
            let isValid = false;

            if (name === 'phone') {
                isValid = /^[0-9]{10}$/.test(value);
            } else {
                isValid = value !== "";
            }

            if (isValid) {
                field.classList.remove('error-field');
                field.classList.add('success-field');
            } else {
                field.classList.remove('success-field');
                field.classList.add('error-field');
            }
            return isValid;
        };

        // Add real-time input listeners
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                // Only start showing validation colors after a class has been applied once (after first submit attempt)
                if (field.classList.contains('error-field') || field.classList.contains('success-field')) {
                    validateField(field);
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isFormValid = true;
            let firstInvalidField = null;

            // Validate all fields
            contactForm.querySelectorAll('input, textarea').forEach(field => {
                const isValid = validateField(field);
                if (!isValid) {
                    isFormValid = false;
                    if (!firstInvalidField) firstInvalidField = field;
                }
            });

            if (!isFormValid) {
                formStatus.style.display = 'block';
                formStatus.textContent = 'Please fix the errors in the fields highlighted in red.';
                formStatus.style.color = '#ef4444'; // Red
                if (firstInvalidField) firstInvalidField.focus();
                return;
            }

            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.style.display = 'block';
            formStatus.textContent = 'Submitting your request...';
            formStatus.style.color = 'var(--text-muted)';

            // SheetDB URL (Replace with your actual URL from sheetdb.io)
            const SCRIPT_URL = 'https://sheetdb.io/api/v1/x7lah61xqtmom';

            fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    data: [
                        {
                            ...data,
                            timestamp: new Date().toLocaleString()
                        }
                    ]
                }),
            })
                .then(response => response.json())
                .then(html => {
                    formStatus.textContent = 'Success! We will contact you soon.';
                    formStatus.style.color = '#10b981'; // Green
                    contactForm.reset();
                    // Clear validation styles after reset
                    contactForm.querySelectorAll('input, textarea').forEach(field => {
                        field.classList.remove('error-field', 'success-field');
                    });
                    submitBtn.textContent = 'Schedule Free Consultation';
                    submitBtn.disabled = false;

                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    formStatus.textContent = 'Something went wrong. Please try again.';
                    formStatus.style.color = '#ef4444'; // Red
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Schedule Free Consultation';
                });
        });
    }
});
