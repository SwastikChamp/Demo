/**
 * SWASTIK SONI - PORTFOLIO INTERACTION LOGIC
 * Features:
 *  1. Interactive background doodle canvas (Books, Code, Badminton, Sports)
 *  2. Real-time dynamic age calculation for DOB 30-10-2007
 *  3. Local avatar image preview & persistence
 *  4. Skills category filtering & animated progress bars
 *  5. Dynamic GitHub-style contribution heatmap with tooltips
 *  6. Project modal previews
 *  7. Client-side contact form validation & toast notifications
 *  8. Responsive navigation & scroll observer
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all subsystems
    initAgeCalculator();
    initDoodleCanvas();
    initAvatarUpload();
    initSkillFilters();
    initContributionHeatmap();
    initProjectModals();
    initContactForm();
    initNavbarAndScroll();
    initMetricCounters();
    setCurrentYear();
});

/* ==========================================================================
   1. Date of Birth & Dynamic Age Calculator (DOB: 30-10-2007)
   ========================================================================== */
function initAgeCalculator() {
    const ageSpan = document.getElementById('calculatedAge');
    if (!ageSpan) return;

    const birthDate = new Date(2007, 9, 30); // Note: Month is 0-indexed (9 = October)
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    ageSpan.textContent = `${age} Years`;
}

/* ==========================================================================
   2. Interactive Background Doodle Canvas (Books, Code, Badminton, Sports)
   ========================================================================== */
function initDoodleCanvas() {
    const canvas = document.getElementById('doodleCanvas');
    const toggleBtn = document.getElementById('doodleToggleBtn');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isRunning = true;
    let width, height;

    // Mouse interaction
    const mouse = { x: -1000, y: -1000, radius: 100 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Responsive resize
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Doodle items definitions: Books, Code, Badminton & Sports
    const doodleTypes = ['badminton', 'shuttlecock', 'book', 'codeBracket', 'binary', 'sportsBall'];
    const doodles = [];
    const doodleCount = Math.min(32, Math.floor(window.innerWidth / 45));

    class Doodle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 40;
            this.size = 18 + Math.random() * 22;
            this.speedY = -(0.25 + Math.random() * 0.45);
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.angle = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.008;
            this.type = doodleTypes[Math.floor(Math.random() * doodleTypes.length)];
            this.opacity = 0.12 + Math.random() * 0.16; // Subtle lazy white doodle watermark
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.angle += this.rotSpeed;

            // Mouse gentle repulsion
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                this.x -= (dx / dist) * force * 2.5;
                this.y -= (dy / dist) * force * 2.5;
            }

            // Wrap around
            if (this.y < -50) this.reset();
            if (this.x < -50) this.x = width + 40;
            if (this.x > width + 50) this.x = -40;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.strokeStyle = `rgba(135, 120, 100, ${this.opacity})`;
            ctx.fillStyle = `rgba(135, 120, 100, ${this.opacity})`;
            ctx.lineWidth = 1.6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const s = this.size;

            switch (this.type) {
                case 'badminton': // Badminton Racquet
                    ctx.beginPath();
                    ctx.ellipse(0, -s * 0.3, s * 0.28, s * 0.38, 0, 0, Math.PI * 2);
                    ctx.stroke();
                    // Shaft & handle
                    ctx.beginPath();
                    ctx.moveTo(0, s * 0.08);
                    ctx.lineTo(0, s * 0.65);
                    ctx.stroke();
                    // Grip
                    ctx.beginPath();
                    ctx.moveTo(-s * 0.04, s * 0.65);
                    ctx.lineTo(s * 0.04, s * 0.65);
                    ctx.stroke();
                    break;

                case 'shuttlecock': // Badminton Shuttlecock
                    ctx.beginPath();
                    // Cork (semi-circle base)
                    ctx.arc(0, s * 0.2, s * 0.12, 0, Math.PI);
                    ctx.fill();
                    // Feathers flare upwards
                    ctx.beginPath();
                    ctx.moveTo(-s * 0.12, s * 0.2);
                    ctx.lineTo(-s * 0.28, -s * 0.25);
                    ctx.lineTo(s * 0.28, -s * 0.25);
                    ctx.lineTo(s * 0.12, s * 0.2);
                    ctx.stroke();
                    // Inner ribs
                    ctx.beginPath();
                    ctx.moveTo(-s * 0.04, s * 0.2);
                    ctx.lineTo(-s * 0.1, -s * 0.25);
                    ctx.moveTo(s * 0.04, s * 0.2);
                    ctx.lineTo(s * 0.1, -s * 0.25);
                    ctx.stroke();
                    break;

                case 'book': // Open Book
                    ctx.beginPath();
                    // Left page
                    ctx.moveTo(0, s * 0.2);
                    ctx.quadraticCurveTo(-s * 0.2, s * 0.05, -s * 0.35, s * 0.12);
                    ctx.lineTo(-s * 0.35, -s * 0.25);
                    ctx.quadraticCurveTo(-s * 0.2, -s * 0.32, 0, -s * 0.18);
                    // Right page
                    ctx.quadraticCurveTo(s * 0.2, -s * 0.32, s * 0.35, -s * 0.25);
                    ctx.lineTo(s * 0.35, s * 0.12);
                    ctx.quadraticCurveTo(s * 0.2, s * 0.05, 0, s * 0.2);
                    ctx.stroke();
                    // Spine
                    ctx.beginPath();
                    ctx.moveTo(0, -s * 0.18);
                    ctx.lineTo(0, s * 0.2);
                    ctx.stroke();
                    break;

                case 'codeBracket': // Code braces/tags < /> or { }
                    ctx.font = `600 ${Math.floor(s * 0.85)}px 'Fira Code', monospace`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('< />', 0, 0);
                    break;

                case 'binary': // Code terminal prompt { }
                    ctx.font = `600 ${Math.floor(s * 0.75)}px 'Fira Code', monospace`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('{ ; }', 0, 0);
                    break;

                case 'sportsBall': // Sports Trophy / Ball circle
                    ctx.beginPath();
                    ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
                    ctx.stroke();
                    // Curve seams
                    ctx.beginPath();
                    ctx.arc(-s * 0.12, 0, s * 0.16, -Math.PI / 2, Math.PI / 2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(s * 0.12, 0, s * 0.16, Math.PI / 2, -Math.PI / 2);
                    ctx.stroke();
                    break;
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < doodleCount; i++) {
        doodles.push(new Doodle());
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < doodles.length; i++) {
            doodles[i].update();
            doodles[i].draw(ctx);
        }
        if (isRunning) {
            animationFrameId = requestAnimationFrame(loop);
        }
    }

    loop();

    // Toggle button functionality
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isRunning = !isRunning;
            if (isRunning) {
                loop();
                toggleBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i>';
                showToast('Background doodle animation resumed');
            } else {
                cancelAnimationFrame(animationFrameId);
                toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                showToast('Background doodle animation paused');
            }
        });
    }
}

/* ==========================================================================
   3. Local Avatar Image Replacement & Persistence
   ========================================================================== */
function initAvatarUpload() {
    const fileInput = document.getElementById('imageUploadInput');
    const profileImg = document.getElementById('profileImage');

    if (!fileInput || !profileImg) return;

    // Restore saved photo from localStorage if present
    const savedAvatar = localStorage.getItem('swastik_custom_avatar');
    if (savedAvatar) {
        profileImg.src = savedAvatar;
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast('Please select a valid image file');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target.result;
                profileImg.src = result;
                try {
                    localStorage.setItem('swastik_custom_avatar', result);
                    showToast('Profile photo updated successfully!');
                } catch (err) {
                    // In case local storage quota exceeded for high-res image
                    showToast('Profile photo updated for this session!');
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

/* ==========================================================================
   4. Skills Filter & Animation
   ========================================================================== */
function initSkillFilters() {
    const tabBtns = document.querySelectorAll('.skill-tab-btn');
    const cards = document.querySelectorAll('.skill-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    // Re-trigger bar animation
                    const bar = card.querySelector('.skill-bar');
                    if (bar) {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => { bar.style.width = width; }, 40);
                    }
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ==========================================================================
   5. Interactive GitHub-Style Contribution Heatmap
   ========================================================================== */
function initContributionHeatmap() {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const totalDays = 52 * 7; // 1 year representation (364 days)

    // Date calculation from 1 year ago to today
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - totalDays);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < totalDays; i++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + i);

        const cell = document.createElement('div');
        cell.classList.add('heat-cell');

        // Generate realistic activity distribution (higher on weekdays & evenings)
        const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
        const rand = Math.random();
        let level = 0;
        let count = 0;

        if (!isWeekend && rand > 0.3) {
            if (rand > 0.85) { level = 4; count = 8 + Math.floor(Math.random() * 5); }
            else if (rand > 0.65) { level = 3; count = 5 + Math.floor(Math.random() * 3); }
            else if (rand > 0.45) { level = 2; count = 3 + Math.floor(Math.random() * 2); }
            else { level = 1; count = 1 + Math.floor(Math.random() * 2); }
        } else if (isWeekend && rand > 0.6) {
            level = Math.floor(Math.random() * 3);
            count = level * 2;
        }

        if (level > 0) {
            cell.classList.add(`lvl-${level}`);
        }

        const dateStr = `${cellDate.getDate()} ${months[cellDate.getMonth()]} ${cellDate.getFullYear()}`;
        const activityText = count === 0 ? `No contributions on ${dateStr}` : `${count} contributions on ${dateStr}`;
        cell.setAttribute('title', activityText);

        cell.addEventListener('mouseenter', () => {
            const summary = document.getElementById('heatmapSummary');
            if (summary) {
                summary.firstElementChild.innerHTML = `<strong>${activityText}</strong>`;
            }
        });

        cell.addEventListener('mouseleave', () => {
            const summary = document.getElementById('heatmapSummary');
            if (summary) {
                summary.firstElementChild.innerHTML = `<strong>284 contributions</strong> recorded across this academic year.`;
            }
        });

        grid.appendChild(cell);
    }
}

/* ==========================================================================
   6. Project Modals & Live Previews
   ========================================================================== */
const projectDetails = {
    shuttlescore: {
        tag: 'Sports Tech & Analytics',
        title: 'ShuttleScore — Smart Badminton Analytics & Match Tracker',
        body: `
      <p><strong>Overview:</strong> Built for collegiate badminton athletes and campus tournament organizers to score matches in real-time, compute rally lengths, and plot court error frequencies.</p>
      <br>
      <h4>Key Capabilities:</h4>
      <ul style="padding-left: 20px; margin-top: 8px; line-height: 1.6;">
        <li>Follows official BWF standard 21-point rally scoring system.</li>
        <li>Interactive court map highlighting smash winners vs net-drop faults.</li>
        <li>Audio announcements for current server and match points via Web Audio API.</li>
        <li>Local persistence: resume paused matches seamlessly.</li>
      </ul>
      <br>
      <p><strong>Tech Stack:</strong> JavaScript (ES6), HTML5 Canvas, Web Audio API, LocalStorage.</p>
    `,
        repo: 'https://github.com'
    },
    campussync: {
        tag: 'Student Collaboration',
        title: 'CampusSync — ADYPU Student Resource Exchange',
        body: `
      <p><strong>Overview:</strong> A dedicated campus repository where B.Tech first-year peers at Ajeenkya DY Patil University share study materials, past question papers, and lab manuals.</p>
      <br>
      <h4>Key Capabilities:</h4>
      <ul style="padding-left: 20px; margin-top: 8px; line-height: 1.6;">
        <li>Categorized by engineering semesters and core subjects (DSA, C++, Maths).</li>
        <li>Fuzzy client-side search across uploaded document tags and titles.</li>
        <li>Upvoting system to bubble up high-quality verified lecture notes.</li>
      </ul>
      <br>
      <p><strong>Tech Stack:</strong> Node.js, Express, JavaScript, CSS3 Grid.</p>
    `,
        repo: 'https://github.com'
    },
    devsnippet: {
        tag: 'Developer Productivity',
        title: 'DevSnippet Vault — Markdown & Code Snippet Manager',
        body: `
      <p><strong>Overview:</strong> A fast, lightweight snippet organizer that helps programmers save, tag, and copy reusable code snippets without context switching.</p>
      <br>
      <h4>Key Capabilities:</h4>
      <ul style="padding-left: 20px; margin-top: 8px; line-height: 1.6;">
        <li>One-click clipboard copy with instant visual checkmark confirmation.</li>
        <li>Live syntax highlighting support for C++, JavaScript, Python, and SQL.</li>
        <li>Multi-tag filtering to isolate snippets in milliseconds.</li>
      </ul>
      <br>
      <p><strong>Tech Stack:</strong> Vanilla JavaScript, Prism.js, CSS Custom Properties.</p>
    `,
        repo: 'https://github.com'
    },
    fitpulse: {
        tag: 'Athletics & Fitness',
        title: 'FitPulse — Collegiate Athlete Training & Recovery Logger',
        body: `
      <p><strong>Overview:</strong> A personalized athletic log for student players balancing collegiate training sessions with rigorous coursework.</p>
      <br>
      <h4>Key Capabilities:</h4>
      <ul style="padding-left: 20px; margin-top: 8px; line-height: 1.6;">
        <li>Logs sprint times, shuttle runs, jump height records, and resting heart rates.</li>
        <li>Visual readiness score indicating recovery requirements before tournaments.</li>
        <li>Mobile-friendly courtside UI for immediate post-match entry.</li>
      </ul>
      <br>
      <p><strong>Tech Stack:</strong> HTML5, CSS Keyframes, JavaScript, Chart.js.</p>
    `,
        repo: 'https://github.com'
    }
};

function initProjectModals() {
    const modal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalDismissBtn = document.getElementById('modalDismissBtn');
    const modalTag = document.getElementById('modalTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalRepoBtn = document.getElementById('modalRepoBtn');

    if (!modal) return;

    function openModal(projectId) {
        const data = projectDetails[projectId];
        if (!data) return;

        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.body;
        modalRepoBtn.href = data.repo;

        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Bind demo buttons
    document.querySelectorAll('.project-demo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const proj = btn.getAttribute('data-project');
            openModal(proj);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   7. Contact Form Handling
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById('senderName');
        const email = document.getElementById('senderEmail');
        const message = document.getElementById('senderMessage');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');

        // Name check
        if (!name.value.trim()) {
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }

        // Email check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }

        // Message check
        if (!message.value.trim()) {
            messageError.style.display = 'block';
            isValid = false;
        } else {
            messageError.style.display = 'none';
        }

        if (isValid) {
            // Simulate form transmission
            const submitBtn = document.getElementById('submitContactBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                if (feedback) feedback.style.display = 'flex';
                showToast('Message sent to Swastik Soni!');

                setTimeout(() => {
                    if (feedback) feedback.style.display = 'none';
                }, 6000);
            }, 900);
        }
    });
}

/* ==========================================================================
   8. Navbar, Mobile Drawer & Scroll Observation
   ========================================================================== */
function initNavbarAndScroll() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const backToTop = document.getElementById('backToTopBtn');

    // Sticky header & back to top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile menu toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // Intersection Observer for Active Nav link
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   9. Metric Counters Animation
   ========================================================================== */
function initMetricCounters() {
    const counters = document.querySelectorAll('.metric-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    if (isNaN(target)) return;

                    let current = 0;
                    const step = Math.ceil(target / 40);
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(interval);
                        }
                        if (counter.textContent.includes('st')) {
                            counter.textContent = `${current}st`;
                        } else if (counter.textContent.includes('%')) {
                            counter.textContent = `${current}%`;
                        } else if (counter.textContent.includes('+')) {
                            counter.textContent = `${current}+`;
                        } else {
                            counter.textContent = current;
                        }
                    }, 30);
                });
            }
        });
    }, { threshold: 0.5 });

    const metricsGrid = document.querySelector('.metrics-grid');
    if (metricsGrid) observer.observe(metricsGrid);
}

/* ==========================================================================
   10. Toast Notification Helper
   ========================================================================== */
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const msgSpan = document.getElementById('toastMessage');
    if (!toast || !msgSpan) return;

    msgSpan.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/* ==========================================================================
   11. Dynamic Year Setter
   ========================================================================== */
function setCurrentYear() {
    const yearSpan = document.getElementById('currentYearSpan');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
