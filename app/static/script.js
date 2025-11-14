// DOM Elements
const suburbInput = document.getElementById('suburbInput');
const searchBtn = document.getElementById('searchBtn');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsSection');
const errorMessage = document.getElementById('errorMessage');
const propertiesGrid = document.getElementById('propertiesGrid');
const emptyState = document.getElementById('emptyState');
const suburbName = document.getElementById('suburbName');
const suburbScore = document.getElementById('suburbScore');
const walkability = document.getElementById('walkability');
const populationGrowth = document.getElementById('populationGrowth');
const propertyCount = document.getElementById('propertyCount');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const insightsSummary = document.getElementById('insightsSummary');

// Global state
let currentSuburb = '';
let currentOffset = 0;
let hasMore = false;
let allLoadedProperties = [];

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
suburbInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', handleLoadMore);
}

// Main search handler
async function handleSearch() {
    const suburb = suburbInput.value.trim();
    
    if (!suburb) {
        showError('Please enter a suburb name');
        return;
    }
    
    // Reset state for new search
    currentSuburb = suburb;
    currentOffset = 0;
    allLoadedProperties = [];
    
    // Reset UI
    hideError();
    hideResults();
    showLoading();
    
    try {
        const response = await fetch(`/search?q=${encodeURIComponent(suburb)}&offset=0&limit=15`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch properties');
        }
        
        hideLoading();
        displayResults(data, true);
        
    } catch (error) {
        hideLoading();
        showError(error.message || 'An error occurred while fetching data');
    }
}

// Load more properties
async function handleLoadMore() {
    if (!currentSuburb) return;
    
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';
    
    try {
        const response = await fetch(`/search?q=${encodeURIComponent(currentSuburb)}&offset=${currentOffset}&limit=10`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load more properties');
        }
        
        displayResults(data, false);
        
    } catch (error) {
        showError(error.message || 'Failed to load more properties');
    } finally {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Load More Properties';
    }
}

// Display results
function displayResults(data, isNewSearch = true) {
    const { suburb, suburb_metrics, properties, count, total, offset, limit, has_more } = data;
    
    // Update global state
    currentOffset = offset + properties.length;
    hasMore = has_more;
    
    if (isNewSearch) {
        allLoadedProperties = properties;
        
        // Show results section
        resultsSection.style.display = 'block';
        
        // Update suburb overview
        suburbName.textContent = capitalizeWords(suburb);
        suburbScore.textContent = suburb_metrics.suburb_score.toFixed(0);
        walkability.textContent = suburb_metrics.walkability.toFixed(0);
        populationGrowth.textContent = `${suburb_metrics.population_growth.toFixed(1)}%`;
        
        // Generate insights summary
        generateInsightsSummary(properties, total);
    } else {
        // Append to existing properties
        allLoadedProperties = allLoadedProperties.concat(properties);
    }
    
    // Display properties
    if (allLoadedProperties && allLoadedProperties.length > 0) {
        propertiesGrid.style.display = 'grid';
        emptyState.style.display = 'none';
        
        if (isNewSearch) {
            propertiesGrid.innerHTML = allLoadedProperties.map((property, index) => 
                createPropertyCard(property, index)
            ).join('');
        } else {
            // Append new cards
            const startIndex = allLoadedProperties.length - properties.length;
            const newCards = properties.map((property, index) => 
                createPropertyCard(property, startIndex + index)
            ).join('');
            propertiesGrid.insertAdjacentHTML('beforeend', newCards);
        }
        
        // Attach event listeners to all cards
        attachCardEventListeners();
    } else {
        propertiesGrid.style.display = 'none';
        emptyState.style.display = 'block';
    }
    
    // Show/hide load more button
    if (loadMoreBtn) {
        if (hasMore) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // Scroll to results on new search
    if (isNewSearch) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Generate insights summary
function generateInsightsSummary(properties, total) {
    const scores = properties.map(p => p.opportunity_score);
    const excellent = scores.filter(s => s >= 80).length;
    const veryGood = scores.filter(s => s >= 70 && s < 80).length;
    const good = scores.filter(s => s >= 60 && s < 70).length;
    const fair = scores.filter(s => s >= 50 && s < 60).length;
    const limited = scores.filter(s => s < 50).length;
    
    let summaryParts = [];
    if (excellent > 0) summaryParts.push(`<span class="summary-excellent">${excellent} excellent</span>`);
    if (veryGood > 0) summaryParts.push(`<span class="summary-verygood">${veryGood} very good</span>`);
    if (good > 0) summaryParts.push(`<span class="summary-good">${good} good</span>`);
    if (fair > 0) summaryParts.push(`<span class="summary-fair">${fair} fair</span>`);
    if (limited > 0) summaryParts.push(`<span class="summary-limited">${limited} limited</span>`);
    
    const summaryText = summaryParts.join(', ');
    
    if (insightsSummary) {
        insightsSummary.innerHTML = `
            <p>Found <strong>${total}</strong> properties in ${capitalizeWords(currentSuburb)}</p>
            <p class="summary-breakdown">${summaryText} opportunities</p>
        `;
    }
}

// Create property card HTML
function createPropertyCard(property, index) {
    const {
        address, price, bedrooms, bathrooms, property_type,
        parking_spaces, internal_area, days_on_market,
        opportunity_score, badges, insights, price_per_bedroom,
        distance_to_train, distance_to_shops
    } = property;
    
    const scoreClass = getScoreClass(opportunity_score);
    const scoreLabel = getScoreLabel(opportunity_score);
    
    // Create badges HTML
    const badgesHTML = badges && badges.length > 0 
        ? `<div class="property-badges">
            ${badges.map(badge => `<span class="badge badge-${getBadgeClass(badge)}">${getBadgeIcon(badge)} ${badge}</span>`).join('')}
           </div>`
        : '';
    
    // Create insights HTML
    const insightsHTML = insights && insights.length > 0
        ? `<div class="property-insights">
            ${insights.slice(0, 2).map(insight => `<div class="insight-item">• ${insight}</div>`).join('')}
           </div>`
        : '';
    
    return `
        <div class="property-card" data-property-index="${index}">
            <div class="property-image-placeholder">
                <span class="placeholder-icon">🏠</span>
                <div class="property-type-badge">${property_type}</div>
                ${days_on_market < 14 ? '<div class="fresh-badge">NEW</div>' : ''}
            </div>
            
            <div class="property-content">
                <div class="property-header">
                    <h4 class="property-address">${address}</h4>
                    <div class="property-price">${formatPrice(price)}</div>
                </div>
                
                ${badgesHTML}
                
                <div class="property-details">
                    <span class="detail-item">
                        <span class="detail-icon">🛏️</span>
                        <span>${bedrooms} bed${bedrooms !== 1 ? 's' : ''}</span>
                    </span>
                    <span class="detail-item">
                        <span class="detail-icon">🚿</span>
                        <span>${bathrooms} bath${bathrooms !== 1 ? 's' : ''}</span>
                    </span>
                    <span class="detail-item">
                        <span class="detail-icon">🚗</span>
                        <span>${parking_spaces} parking</span>
                    </span>
                    <span class="detail-item">
                        <span class="detail-icon">📐</span>
                        <span>${internal_area}m²</span>
                    </span>
                </div>
                
                ${insightsHTML}
                
                <div class="property-meta">
                    <span class="meta-item" title="Price per bedroom">💰 ${formatPrice(price_per_bedroom)}/bed</span>
                    <span class="meta-item" title="Days on market">📅 ${days_on_market} days</span>
                </div>
                
                <div class="opportunity-score ${scoreClass}">
                    <div class="score-header">
                        <div class="score-label">Opportunity Score</div>
                        <div class="score-value">${opportunity_score.toFixed(1)}</div>
                    </div>
                    <div class="score-badge">${scoreLabel}</div>
                </div>
                
                <button class="view-details-btn" data-property-index="${index}">
                    <span class="btn-text">View Details</span>
                    <span class="btn-arrow">▼</span>
                </button>
                
                <div class="property-details-expanded" id="details-${index}" style="display: none;">
                    ${createDetailedView(property)}
                </div>
            </div>
        </div>
    `;
}

// Create detailed view with score breakdown and comparison
function createDetailedView(property) {
    const { score_breakdown, comparison_metrics, distance_to_train, distance_to_shops, recently_renovated } = property;
    
    const sb = score_breakdown.suburb_factors;
    const vb = score_breakdown.value_factors;
    const fb = score_breakdown.feature_factors;
    
    return `
        <div class="details-content">
            <h5>Score Breakdown</h5>
            
            <div class="score-section">
                <div class="score-section-header">
                    <span class="section-title">Suburb Factors</span>
                    <span class="section-score">${sb.total}/${sb.max}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill progress-suburb" style="width: ${(sb.total/sb.max)*100}%"></div>
                </div>
                <div class="score-components">
                    <div class="component-item">
                        <span>Suburb Quality:</span>
                        <span>${sb.components.suburb_quality}/${20}</span>
                    </div>
                    <div class="component-item">
                        <span>Population Growth:</span>
                        <span>${sb.components.population_growth}/${10}</span>
                    </div>
                    <div class="component-item">
                        <span>Walkability:</span>
                        <span>${sb.components.walkability}/${10}</span>
                    </div>
                </div>
            </div>
            
            <div class="score-section">
                <div class="score-section-header">
                    <span class="section-title">Value Factors</span>
                    <span class="section-score">${vb.total}/${vb.max}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill progress-value" style="width: ${(vb.total/vb.max)*100}%"></div>
                </div>
                <div class="score-components">
                    <div class="component-item">
                        <span>Price per Bedroom:</span>
                        <span>${vb.components.price_per_bedroom}/${15}</span>
                    </div>
                    <div class="component-item">
                        <span>vs Suburb Median:</span>
                        <span>${vb.components.vs_suburb_median}/${10}</span>
                    </div>
                    <div class="component-item">
                        <span>Price per m²:</span>
                        <span>${vb.components.price_per_sqm}/${10}</span>
                    </div>
                </div>
            </div>
            
            <div class="score-section">
                <div class="score-section-header">
                    <span class="section-title">Feature Factors</span>
                    <span class="section-score">${fb.total}/${fb.max}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill progress-features" style="width: ${(fb.total/fb.max)*100}%"></div>
                </div>
                <div class="score-components">
                    <div class="component-item">
                        <span>Property Type:</span>
                        <span>${fb.components.property_type}/${8}</span>
                    </div>
                    <div class="component-item">
                        <span>Parking:</span>
                        <span>${fb.components.parking}/${5}</span>
                    </div>
                    <div class="component-item">
                        <span>Renovation:</span>
                        <span>${fb.components.renovation}/${4}</span>
                    </div>
                    <div class="component-item">
                        <span>Amenities:</span>
                        <span>${fb.components.amenities}/${5}</span>
                    </div>
                    <div class="component-item">
                        <span>Market Velocity:</span>
                        <span>${fb.components.market_velocity}/${3}</span>
                    </div>
                </div>
            </div>
            
            <h5 style="margin-top: 1.5rem;">Property vs Suburb Average</h5>
            
            <div class="comparison-table">
                <div class="comparison-row comparison-header">
                    <div class="comparison-label"></div>
                    <div class="comparison-this">This Property</div>
                    <div class="comparison-avg">Suburb Avg</div>
                    <div class="comparison-verdict">Verdict</div>
                </div>
                
                <div class="comparison-row">
                    <div class="comparison-label">Price vs Median</div>
                    <div class="comparison-this">-</div>
                    <div class="comparison-avg">-</div>
                    <div class="comparison-verdict ${comparison_metrics.price_vs_median_pct < 0 ? 'verdict-good' : 'verdict-bad'}">
                        ${comparison_metrics.price_vs_median_pct < 0 ? '↓' : '↑'} ${Math.abs(comparison_metrics.price_vs_median_pct)}% ${comparison_metrics.price_vs_median_pct < 0 ? 'below ✓' : 'above'}
                    </div>
                </div>
                
                <div class="comparison-row">
                    <div class="comparison-label">Size</div>
                    <div class="comparison-this">-</div>
                    <div class="comparison-avg">-</div>
                    <div class="comparison-verdict ${comparison_metrics.size_vs_avg_pct > 0 ? 'verdict-good' : 'verdict-neutral'}">
                        ${comparison_metrics.size_vs_avg_pct > 0 ? '↑ Larger ✓' : comparison_metrics.size_vs_avg_pct < -10 ? '↓ Smaller' : '≈ Average'}
                    </div>
                </div>
                
                <div class="comparison-row">
                    <div class="comparison-label">Parking</div>
                    <div class="comparison-this">-</div>
                    <div class="comparison-avg">-</div>
                    <div class="comparison-verdict ${comparison_metrics.parking_vs_avg > 0 ? 'verdict-good' : 'verdict-neutral'}">
                        ${comparison_metrics.parking_vs_avg > 0 ? '↑ Above avg ✓' : comparison_metrics.parking_vs_avg < 0 ? '↓ Below avg' : '≈ Average'}
                    </div>
                </div>
                
                <div class="comparison-row">
                    <div class="comparison-label">Days on Market</div>
                    <div class="comparison-this">-</div>
                    <div class="comparison-avg">-</div>
                    <div class="comparison-verdict ${comparison_metrics.days_vs_avg > 30 ? 'verdict-warning' : 'verdict-neutral'}">
                        ${comparison_metrics.days_vs_avg > 30 ? '↑ Sitting longer ⚠️' : comparison_metrics.days_vs_avg < -10 ? '↓ Moving fast ✓' : '≈ Average'}
                    </div>
                </div>
            </div>
            
            <div class="additional-info">
                <div class="info-item">
                    <span class="info-icon">🚆</span>
                    <span>${distance_to_train}km to train station</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">🛒</span>
                    <span>${distance_to_shops}km to shops</span>
                </div>
                ${recently_renovated ? '<div class="info-item"><span class="info-icon">✨</span><span>Recently renovated</span></div>' : ''}
            </div>
        </div>
    `;
}

// Attach event listeners to property cards
function attachCardEventListeners() {
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = this.getAttribute('data-property-index');
            const detailsPanel = document.getElementById(`details-${index}`);
            const arrow = this.querySelector('.btn-arrow');
            
            if (detailsPanel.style.display === 'none') {
                detailsPanel.style.display = 'block';
                arrow.textContent = '▲';
                this.querySelector('.btn-text').textContent = 'Hide Details';
            } else {
                detailsPanel.style.display = 'none';
                arrow.textContent = '▼';
                this.querySelector('.btn-text').textContent = 'View Details';
            }
        });
    });
}

// Get badge class for styling
function getBadgeClass(badge) {
    const badgeMap = {
        'Great Value': 'value',
        'Premium Features': 'premium',
        'Transit Hub': 'location',
        'High Growth Area': 'growth',
        'Fresh Listing': 'fresh',
        'Affordable': 'value',
        'Family Home': 'family',
        'Investor Special': 'investor'
    };
    return badgeMap[badge] || 'default';
}

// Get badge icon
function getBadgeIcon(badge) {
    const iconMap = {
        'Great Value': '🏆',
        'Premium Features': '💎',
        'Transit Hub': '🚆',
        'High Growth Area': '📈',
        'Fresh Listing': '⚡',
        'Affordable': '💰',
        'Family Home': '🏠',
        'Investor Special': '🌟'
    };
    return iconMap[badge] || '✓';
}

// Get score class for styling
function getScoreClass(score) {
    if (score >= 75) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
}

// Get score label
function getScoreLabel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Limited';
}

// Format price
function formatPrice(price) {
    if (typeof price === 'string') {
        return price;
    }
    
    if (typeof price === 'number') {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }
    
    return 'Price on application';
}

// Capitalize words
function capitalizeWords(str) {
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// UI State Management
function showLoading() {
    loadingState.style.display = 'block';
}

function hideLoading() {
    loadingState.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function hideResults() {
    resultsSection.style.display = 'none';
}

// Auto-focus search input on page load
window.addEventListener('DOMContentLoaded', () => {
    suburbInput.focus();
});
