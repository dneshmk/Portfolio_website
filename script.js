// Project Data loaded from cms_data.js
const projects = cmsData.projects;

// Main Page Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Populate Hero Section
    // Populate Hero Section
    if (document.getElementById('hero-headline')) {
        // Static text is hardcoded in HTML for structure, but we can ensure description is loaded
        document.getElementById('hero-description').innerText = cmsData.hero.description;

        // Init Text Loop
        const loopElement = document.getElementById('hero-loop');
        const skills = ["Modeling", "Animation", "Lighting", "Cinematics"];
        let skillIndex = 0;

        if (loopElement) {
            loopElement.textContent = skills[0]; // Start with first

            // Smoother fade logic
            setInterval(() => {
                // Start Fade Out
                loopElement.classList.add('fade-out');

                // Wait for fade out transition (matches CSS 0.5s)
                setTimeout(() => {
                    skillIndex = (skillIndex + 1) % skills.length;
                    loopElement.textContent = skills[skillIndex];

                    // Start Fade In
                    loopElement.classList.remove('fade-out');
                    loopElement.classList.add('fade-in');

                    // Clean up class after transition
                    setTimeout(() => {
                        loopElement.classList.remove('fade-in');
                    }, 500);

                }, 500); // 500ms match css transition

            }, 2500); // Total cycle: 2s visible + 0.5s fade
        }

        // Update Video Source
        const video = document.querySelector('.hero-video video');
        if (video && cmsData.hero.video) {
            const source = video.querySelector('source');
            if (source) source.src = cmsData.hero.video;
            video.load();
        }
    }

    // Populate Profile Section
    if (document.getElementById('profile-name')) {
        document.getElementById('profile-name').innerText = cmsData.profile.name;
        document.getElementById('profile-bio').innerHTML = cmsData.profile.bio.replace(/\n/g, '<br>');

        const profileImg = document.querySelector('.image-wrapper img');
        if (profileImg && cmsData.profile.image) {
            profileImg.src = cmsData.profile.image;
        }
    }

    // Populate Skills Section
    const skillsList = document.getElementById('skills-list');
    if (skillsList && cmsData.skills.list) {
        skillsList.innerHTML = cmsData.skills.list.map(skill => `<span>• ${skill}</span>`).join('');
    }

    // Populate Software Ticker
    const ticker = document.getElementById('software-ticker');
    if (ticker && cmsData.skills.icons) {
        // Create duplicate set for seamless loop
        const iconsHtml = cmsData.skills.icons.map(icon => `<div class="software-item"><img src="${icon}" alt="Software"></div>`).join('');
        ticker.innerHTML = iconsHtml + iconsHtml; // Duplicate for marquee
    }

    // Initialize Projects Grid if it exists
    if (document.querySelector('.projects-grid')) {
        initProjectGrid();
        initSmoothScrollNav();
    }
});

// Old listener removed (merged into top initialization)

function initSmoothScrollNav() {
    const navLinks = document.querySelectorAll('nav a');
    const header = document.querySelector('header');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').split('#')[1];
            if (!targetId) return;

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                // Subtract header height to avoid covering the section title
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight;

                smoothScrollTo(targetPosition, 1000);
            }
        });

        link.addEventListener('click', (e) => e.preventDefault());
    });
}

function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;

        // Ease-in-out function (easeInOutCubic)
        // t is time (0 to 1)
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);

        window.scrollTo(0, run);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    // Cubic Ease In Out function
    // t: current time, b: start value, c: change in value, d: duration
    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
}

function initProjectGrid() {
    const navButtons = document.querySelectorAll('.projects-nav button');
    const gridContainer = document.querySelector('.projects-grid');

    // Default category
    renderProjects('all');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Get category
            const category = btn.getAttribute('data-category');
            renderProjects(category);
        });
    });

    function renderProjects(category) {
        gridContainer.innerHTML = ''; // Clear existing

        let filteredProjects;
        if (category === 'all') {
            filteredProjects = projects;
        } else {
            filteredProjects = projects.filter(p => p.category === category);
        }

        // Limit to 6 projects for the grid (optional, maybe remove limit for 'all'?)
        // const displayProjects = filteredProjects.slice(0, 6); 
        const displayProjects = filteredProjects; // Show all for now

        if (displayProjects.length === 0) {
            gridContainer.innerHTML = '<p style="margin:20px; font-style:italic; color:#666;">No projects found in this category.</p>';
            return;
        }

        displayProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card large'; // Reusing existing class for size
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.src='header/images/logo.svg'">
                <div class="card-overlay">
                    <span>${project.title}</span>
                </div>
            `;
            // Add click listener
            card.addEventListener('click', () => {
                window.location.href = `project-details.html?id=${project.id}`;
            });

            gridContainer.appendChild(card);
        });
    }
}

// Detail Page Logic
// Detail Page Logic
let currentGallery = [];
let currentIndex = 0;

function loadProjectDetail(id) {
    const project = projects.find(p => p.id === id);
    const contentDiv = document.getElementById('project-content');

    if (!project) {
        contentDiv.innerHTML = '<h2>Project not found.</h2><p>The requested project could not be located.</p>';
        return;
    }

    currentGallery = project.gallery; // Store for lightbox

    // Build Gallery HTML
    const galleryHTML = project.gallery.map((item, index) => {
        const isVideo = item.endsWith('.mp4') || item.endsWith('.webm') || item.endsWith('.ogg');
        if (isVideo) {
            return `
                <div class="gallery-item" onclick="openLightbox(${index})">
                    <video playsinline loop muted>
                        <source src="${item}" type="video/mp4">
                    </video>
                    <div class="play-icon">▶</div>
                </div>
            `;
        } else {
            return `
                <div class="gallery-item" onclick="openLightbox(${index})">
                    <img src="${item}" alt="${project.title} View">
                </div>
            `;
        }
    }).join('');

    contentDiv.innerHTML = `
        <div class="project-header-info">
            <h1>${project.title}</h1>
            <p>${project.description}</p>
        </div>
        <div class="gallery-grid">
            ${galleryHTML}
        </div>
    `;

    initLightboxEvents();
}

// Lightbox Functions
function initLightboxEvents() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.querySelector('.close-btn');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (closeBtn) closeBtn.onclick = closeLightbox;

    // Outside click close
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal || e.target.classList.contains('lightbox-content-container')) {
                closeLightbox();
            }
        };
    }

    if (nextBtn) nextBtn.onclick = () => changeSlide(1);
    if (prevBtn) prevBtn.onclick = () => changeSlide(-1);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal && modal.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') changeSlide(1);
            if (e.key === 'ArrowLeft') changeSlide(-1);
        }
    });
}

function openLightbox(index) {
    currentIndex = index;
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        modal.classList.add('active');
        updateLightboxContent();
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        modal.classList.remove('active');
        // Pause any playing videos
        const video = modal.querySelector('video');
        if (video) video.pause();
    }
}

function changeSlide(direction) {
    currentIndex += direction;
    if (currentIndex >= currentGallery.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = currentGallery.length - 1;
    }
    updateLightboxContent();
}

function updateLightboxContent() {
    const container = document.querySelector('.lightbox-content-container');
    const item = currentGallery[currentIndex];
    const isVideo = item.endsWith('.mp4') || item.endsWith('.webm') || item.endsWith('.ogg');

    container.innerHTML = ''; // Clear current

    if (isVideo) {
        const video = document.createElement('video');
        video.src = item;
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '85vh';
        container.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = item;
        container.appendChild(img);
    }
}
