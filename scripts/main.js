// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Add subtle animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards for animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Filter System
    let currentFilter = 'all';
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillTags = document.querySelectorAll('.skill-tag.clickable');
    const filterCount = document.querySelector('.filter-count');
    const filterInfo = document.querySelector('.filter-info');

    // Gallery elements
    const galleryModal = document.getElementById('galleryModal');
    const galleryClose = document.getElementById('galleryClose');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryImage = document.getElementById('galleryImage');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const galleryThumbnails = document.getElementById('galleryThumbnails');

    // Gallery state
    let currentImages = [];
    let currentImageIndex = 0;

    // Project gallery data (you can customize these images)
    const projectGalleries = {
        'project1': [
            { src: 'images/project1-diagram1.png', alt: 'Boxplot visualization of the dataset' },
            { src: 'images/project1-diagram2.png', alt: '95% Confidence level' },
            { src: 'images/project1-diagram3.png', alt: 'The town\'s reported times' }
        ],
        'project2': [
            { src: 'images/project2-image1.png', alt: 'First prompt' },
            { src: 'images/project2-image2.png', alt: 'Results of first prompt' },
            { src: 'images/project2-image3.png', alt: 'Second prompt' }
        ],
        // 'project3': [
        //     { src: 'images/project3-image1.png', alt: 'First prompt' },
        //     { src: 'images/project3-image2.png', alt: 'Results of first prompt' },
        //     { src: 'images/project3-image3.png', alt: 'Second prompt' }
        // ]
    };

    // Get all unique tags from projects
    const allTags = new Set();
    projectCards.forEach(card => {
        const tags = card.querySelectorAll('.tech-tag');
        tags.forEach(tag => allTags.add(tag.textContent.trim()));
    });

    // Make all skill tags clickable
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.trim();
            filterProjects(tagText);
        });
    });

    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });

    // Project card click functionality
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open gallery if clicking on buttons or tags
            if (e.target.closest('.project-links') || e.target.closest('.tech-tag')) {
                return;
            }
            
            const projectId = this.getAttribute('data-project');
            openGallery(projectId);
        });
    });

    // Make tech tags clickable for filtering
    const techTags = document.querySelectorAll('.tech-tag.clickable');
    techTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            const tagText = this.textContent.trim();
            filterProjects(tagText);
        });
    });

    // Gallery close functionality
    galleryClose.addEventListener('click', closeGallery);
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            closeGallery();
        }
    });

    // Gallery navigation
    galleryPrev.addEventListener('click', () => navigateGallery(-1));
    galleryNext.addEventListener('click', () => navigateGallery(1));

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!galleryModal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeGallery();
                break;
            case 'ArrowLeft':
                navigateGallery(-1);
                break;
            case 'ArrowRight':
                navigateGallery(1);
                break;
        }
    });

    function openGallery(projectId) {
        const projectCard = document.querySelector(`[data-project="${projectId}"]`);
        const projectTitle = projectCard.querySelector('.project-title').textContent;
        
        currentImages = projectGalleries[projectId] || [];
        currentImageIndex = 0;
        
        if (currentImages.length === 0) {
            // Fallback to single image if no gallery
            const mainImage = projectCard.querySelector('.project-image img');
            currentImages = [{
                src: mainImage.src,
                alt: mainImage.alt
            }];
        }
        
        galleryTitle.textContent = `${projectTitle} Gallery`;
        updateGalleryImage();
        updateGalleryThumbnails();
        updateGalleryNavigation();
        
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
        currentImages = [];
        currentImageIndex = 0;
    }

    function navigateGallery(direction) {
        currentImageIndex += direction;
        
        if (currentImageIndex < 0) {
            currentImageIndex = currentImages.length - 1;
        } else if (currentImageIndex >= currentImages.length) {
            currentImageIndex = 0;
        }
        
        updateGalleryImage();
        updateGalleryThumbnails();
        updateGalleryNavigation();
    }

    function updateGalleryImage() {
        if (currentImages.length === 0) return;
        
        const image = currentImages[currentImageIndex];
        galleryImage.src = image.src;
        galleryImage.alt = image.alt;
    }

    function updateGalleryThumbnails() {
        galleryThumbnails.innerHTML = '';
        
        currentImages.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image.src;
            thumbnail.alt = image.alt;
            thumbnail.className = `gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`;
            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateGalleryImage();
                updateGalleryThumbnails();
                updateGalleryNavigation();
            });
            galleryThumbnails.appendChild(thumbnail);
        });
    }

    function updateGalleryNavigation() {
        galleryPrev.disabled = currentImages.length <= 1;
        galleryNext.disabled = currentImages.length <= 1;
    }

    function filterProjects(selectedFilter) {
        let visibleCount = 0;
        
        // Update filter buttons
        filterButtons.forEach(button => {
            if (selectedFilter === 'all' || button.getAttribute('data-filter') === selectedFilter) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Filter project cards
        projectCards.forEach(card => {
            const tags = card.querySelectorAll('.tech-tag');
            const hasTag = Array.from(tags).some(tag => 
                tag.textContent.trim() === selectedFilter
            );
            
            if (selectedFilter === 'all' || hasTag) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Update all tags (both tech-tag and skill-tag) to show selected state
        const allTags = document.querySelectorAll('.tech-tag.clickable, .skill-tag.clickable');
        allTags.forEach(tag => {
            const tagText = tag.textContent.trim();
            
            if (selectedFilter === 'all') {
                // When "All" is selected, remove highlighting from all tags
                tag.classList.remove('selected');
            } else if (tagText === selectedFilter) {
                // Highlight the selected tag wherever it appears
                tag.classList.add('selected');
            } else {
                // Remove highlighting from non-selected tags
                tag.classList.remove('selected');
            }
        });

        // Update filter info
        if (filterCount) {
            filterCount.textContent = visibleCount;
        }
        
        if (filterInfo) {
            if (selectedFilter === 'all') {
                filterInfo.textContent = 'Showing all projects';
            } else {
                filterInfo.textContent = `Filtered by ${selectedFilter}`;
            }
        }
    }

    // Initialize with all projects visible
    filterProjects('all');
}); 
