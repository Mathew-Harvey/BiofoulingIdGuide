/**
 * Hull Biofouling ID Guide - JavaScript
 * Franmarine Underwater Services
 */

// =============================================
// Region Selector
// =============================================

const regionData = {
    wa: {
        name: 'Western Australia',
        shortName: 'WA',
        icon: '🦘'
    },
    nsw: {
        name: 'New South Wales',
        shortName: 'NSW',
        icon: '🌊'
    }
};

function setRegion(region) {
    // Update body data attribute
    document.body.setAttribute('data-region', region);
    
    // Update region buttons
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-region') === region) {
            btn.classList.add('active');
        }
    });
    
    // Update region badge
    const badgeText = document.getElementById('region-badge-text');
    if (badgeText) {
        badgeText.textContent = regionData[region].name;
        // Add animation
        badgeText.parentElement.style.animation = 'none';
        badgeText.parentElement.offsetHeight; // Trigger reflow
        badgeText.parentElement.style.animation = 'fadeInUp 0.3s ease';
    }
    
    // Update hero subtitle
    const regionTextSpans = document.querySelectorAll('.region-text');
    regionTextSpans.forEach(span => {
        span.textContent = regionData[region].shortName;
    });
    
    // Store preference in localStorage
    localStorage.setItem('biofouling-region', region);
    
    // Scroll to top smoothly when changing regions
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize region from localStorage or default to WA
function initRegion() {
    const savedRegion = localStorage.getItem('biofouling-region') || 'wa';
    setRegion(savedRegion);
}

// Run on page load
document.addEventListener('DOMContentLoaded', initRegion);

// =============================================
// Species Search Filter
// =============================================

function filterSpecies(type) {
    const searchInput = document.getElementById(type + '-search').value.toLowerCase();
    const grid = document.getElementById(type + '-grid');
    const cards = grid.querySelectorAll('.species-card');
    
    cards.forEach(card => {
        const searchData = card.getAttribute('data-name').toLowerCase();
        const content = card.textContent.toLowerCase();
        if (searchData.includes(searchInput) || content.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// =============================================
// Smooth Scrolling for Navigation
// =============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// =============================================
// Image Error Handling with Placeholders
// =============================================

document.querySelectorAll('.species-image img').forEach(img => {
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    const speciesName = img.alt || 'Species';
    placeholder.innerHTML = '<div class="placeholder-icon">🔍</div><div>' + speciesName + '</div><div style="font-size:0.75rem;margin-top:5px;">Image not available</div>';
    img.parentNode.appendChild(placeholder);
    
    img.addEventListener('error', function() {
        this.classList.add('error');
    });
    if (img.complete && img.naturalHeight === 0) {
        img.classList.add('error');
    }
});

// =============================================
// Species Gallery Modal
// =============================================

const galleryOverlay = document.getElementById('gallery-overlay');
const galleryHeader = document.getElementById('gallery-header');
const galleryTitle = document.getElementById('gallery-title');
const galleryScientific = document.getElementById('gallery-scientific');
const galleryImage = document.getElementById('gallery-image');
const galleryDescription = document.getElementById('gallery-description');
const galleryFeatures = document.getElementById('gallery-features');
const galleryLookalike = document.getElementById('gallery-lookalike');
const galleryClose = document.getElementById('gallery-close');

// Open modal when clicking a species card
document.querySelectorAll('.species-card').forEach(card => {
    card.addEventListener('click', function() {
        // Get species info from card
        const name = this.querySelector('.species-name').textContent;
        const scientific = this.querySelector('.species-scientific').textContent;
        const description = this.querySelector('.species-description').textContent;
        const img = this.querySelector('.species-image img');
        const imgSrc = img ? img.src : '';
        const imgAlt = img ? img.alt : name;
        
        // Get features list
        const featuresList = this.querySelector('.species-features ul');
        const featuresHTML = featuresList ? '<h4>How to Spot It</h4>' + featuresList.outerHTML : '';
        
        // Get lookalike info if present
        const lookalikeBox = this.querySelector('.lookalike-box');
        const lookalikeHTML = lookalikeBox ? lookalikeBox.innerHTML : '';
        
        // Determine priority/type for header color
        galleryHeader.className = 'gallery-header';
        if (this.classList.contains('invasive')) {
            const priority = this.querySelector('.priority');
            if (priority && priority.classList.contains('high')) {
                galleryHeader.classList.add('high-priority');
            } else {
                galleryHeader.classList.add('medium-priority');
            }
        } else if (this.classList.contains('native')) {
            galleryHeader.classList.add('native');
        } else if (this.classList.contains('niche-species')) {
            galleryHeader.classList.add('niche');
        }
        
        // Populate modal
        galleryTitle.textContent = name;
        galleryScientific.textContent = scientific;
        galleryImage.src = imgSrc;
        galleryImage.alt = imgAlt;
        galleryDescription.textContent = description;
        galleryFeatures.innerHTML = featuresHTML;
        
        if (lookalikeHTML) {
            galleryLookalike.innerHTML = lookalikeHTML;
            galleryLookalike.style.display = 'block';
        } else {
            galleryLookalike.style.display = 'none';
        }
        
        // Show modal
        galleryOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal function
function closeGallery() {
    galleryOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close button click
galleryClose.addEventListener('click', closeGallery);

// Click outside to close
galleryOverlay.addEventListener('click', function(e) {
    if (e.target === galleryOverlay) {
        closeGallery();
    }
});

// Escape key to close
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && galleryOverlay.classList.contains('active')) {
        closeGallery();
    }
});

