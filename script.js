const N8N_CONFIG = {
    CLASSIFICATION_ENDPOINT: 'YOUR_N8N_CLASSIFICATION_WEBHOOK_URL',
    DISPOSAL_GUIDE_ENDPOINT: 'YOUR_N8N_DISPOSAL_GUIDE_WEBHOOK_URL'
};

let currentMode = 'upload';
let selectedFile = null;
let classificationResult = null;

function init() {
    setupEventListeners();
    setupDragAndDrop();
    updateNavOnScroll();
}

function setupEventListeners() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    
    if (uploadPlaceholder) {
        uploadPlaceholder.addEventListener('click', () => {
            if (currentMode === 'upload') {
                document.getElementById('fileInput').click();
            } else {
                document.getElementById('cameraInput').click();
            }
        });
    }
}

function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

function updateNavOnScroll() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function switchMode(mode) {
    currentMode = mode;
    
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    clearImage();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB');
        return;
    }
    
    selectedFile = file;
    displayImagePreview(file);
    enableClassifyButton();
}

function displayImagePreview(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const placeholder = document.getElementById('uploadPlaceholder');
        const preview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        
        previewImage.src = e.target.result;
        placeholder.style.display = 'none';
        preview.style.display = 'block';
    };
    
    reader.readAsDataURL(file);
}

function clearImage() {
    selectedFile = null;
    classificationResult = null;
    
    const placeholder = document.getElementById('uploadPlaceholder');
    const preview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const fileInput = document.getElementById('fileInput');
    const cameraInput = document.getElementById('cameraInput');
    
    previewImage.src = '';
    placeholder.style.display = 'flex';
    preview.style.display = 'none';
    fileInput.value = '';
    cameraInput.value = '';
    
    disableClassifyButton();
    closeResults();
}

function enableClassifyButton() {
    const btn = document.getElementById('classifyBtn');
    btn.disabled = false;
}

function disableClassifyButton() {
    const btn = document.getElementById('classifyBtn');
    btn.disabled = true;
}

async function classifyWaste() {
    if (!selectedFile) {
        showToast('Please select an image first');
        return;
    }
    
    showLoading(true);
    
    try {
        const result = await callN8NClassification(selectedFile);
        
        classificationResult = result;
        displayClassificationResult(result);
        
        showToast('Classification complete!');
    } catch (error) {
        console.error('Classification error:', error);
        showToast('Classification failed. Please try again.');
    } finally {
        showLoading(false);
    }
}

async function callN8NClassification(file) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults = [
        {
            wasteType: 'recyclable',
            itemName: 'Plastic Bottle',
            confidence: 94.5,
            compostable: false,
            recyclable: true,
            tips: [
                'Remove the cap and label before recycling',
                'Rinse out any remaining liquid',
                'Crush the bottle to save space'
            ]
        },
        {
            wasteType: 'wet',
            itemName: 'Food Scraps',
            confidence: 97.2,
            compostable: true,
            recyclable: false,
            tips: [
                'Perfect for composting',
                'Can be added to your compost bin or pile',
                'Helps create nutrient-rich soil'
            ]
        },
        {
            wasteType: 'dry',
            itemName: 'Used Tissue',
            confidence: 89.8,
            compostable: false,
            recyclable: false,
            tips: [
                'Dispose in general waste bin',
                'Cannot be recycled due to contamination',
                'Keep separate from recyclables'
            ]
        }
    ];
    
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    
    return randomResult;
}

function displayClassificationResult(result) {
    const resultsPanel = document.getElementById('resultsPanel');
    const resultContent = document.getElementById('resultContent');
    
    const wasteTypeInfo = getWasteTypeInfo(result.wasteType);
    
    resultContent.innerHTML = `
        <div class="result-card">
            <div class="result-icon" style="background: ${wasteTypeInfo.color};">
                ${wasteTypeInfo.icon}
            </div>
            <div class="result-badge badge-${result.wasteType}">
                ${wasteTypeInfo.name}
            </div>
            <h3 class="result-type">${result.itemName}</h3>
            <p class="result-confidence">Confidence: ${result.confidence}%</p>
            <p class="result-tip">${wasteTypeInfo.description}</p>
        </div>
    `;
    
    resultsPanel.style.display = 'block';
    resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getWasteTypeInfo(type) {
    const wasteTypes = {
        recyclable: {
            name: 'Recyclable',
            color: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>`,
            description: 'This item can be recycled! Processing it will help create new products and reduce waste.'
        },
        wet: {
            name: 'Wet Waste',
            color: 'linear-gradient(135deg, #28A745 0%, #1B5E20 100%)',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>`,
            description: 'Organic waste perfect for composting! This will naturally decompose and enrich soil.'
        },
        dry: {
            name: 'Dry Waste',
            color: 'linear-gradient(135deg, #6C757D 0%, #495057 100%)',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>`,
            description: 'Non-biodegradable waste. Dispose properly in designated bins to minimize environmental impact.'
        }
    };
    
    return wasteTypes[type] || wasteTypes.dry;
}

function closeResults() {
    const resultsPanel = document.getElementById('resultsPanel');
    resultsPanel.style.display = 'none';
}

async function showDisposalGuide() {
    if (!classificationResult) {
        showToast('No classification data available');
        return;
    }
    
    showLoading(true);
    
    try {
        const guideData = await callN8NDisposalGuide(classificationResult);
        
        displayDisposalGuide(guideData);
        
        const classifySection = document.getElementById('classify');
        classifySection.style.display = 'none';
        
        const disposalSection = document.getElementById('disposal-guide');
        disposalSection.style.display = 'block';
        disposalSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Disposal guide error:', error);
        showToast('Failed to load disposal guide');
    } finally {
        showLoading(false);
    }
}

async function callN8NDisposalGuide(classificationData) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
        ...classificationData,
        disposalMethod: getDisposalMethod(classificationData.wasteType),
        safetyTips: getSafetyTips(classificationData.wasteType),
        environmentalImpact: getEnvironmentalImpact(classificationData.wasteType)
    };
}

function getDisposalMethod(type) {
    const methods = {
        recyclable: [
            'Clean and dry the item before recycling',
            'Place in the blue recycling bin',
            'Check local recycling guidelines for specific items',
            'Remove any non-recyclable components'
        ],
        wet: [
            'Add to your compost bin or pile',
            'Bury in your garden for natural decomposition',
            'Use municipal organic waste collection if available',
            'Ensure proper moisture levels in compost'
        ],
        dry: [
            'Dispose in general waste bin',
            'Seal properly to prevent littering',
            'Consider reduction alternatives for future',
            'Check if any parts can be reused'
        ]
    };
    
    return methods[type] || methods.dry;
}

function getSafetyTips(type) {
    const tips = {
        recyclable: [
            'Wash containers to remove food residue',
            'Be careful with sharp edges on metal items',
            'Flatten cardboard boxes to save space'
        ],
        wet: [
            'Avoid adding meat or dairy in home compost',
            'Maintain a balance of green and brown materials',
            'Keep compost moist but not waterlogged'
        ],
        dry: [
            'Wrap sharp objects before disposal',
            'Double bag if contents are messy',
            'Store waste in covered bins to prevent pests'
        ]
    };
    
    return tips[type] || tips.dry;
}

function getEnvironmentalImpact(type) {
    const impacts = {
        recyclable: 'Recycling this item saves energy, reduces greenhouse gas emissions, and conserves natural resources. Every ton of recycled material prevents the need for new raw material extraction.',
        wet: 'Composting organic waste prevents methane emissions from landfills, creates nutrient-rich soil, and supports healthy plant growth. It\'s one of the most environmentally beneficial disposal methods.',
        dry: 'While this waste cannot be recycled or composted, proper disposal ensures it doesn\'t pollute natural environments. Consider reducing consumption of similar items in the future.'
    };
    
    return impacts[type] || impacts.dry;
}

function displayDisposalGuide(data) {
    const disposalContent = document.getElementById('disposalContent');
    const wasteTypeInfo = getWasteTypeInfo(data.wasteType);
    
    disposalContent.innerHTML = `
        <div class="disposal-header">
            <div class="disposal-icon" style="background: ${wasteTypeInfo.color};">
                ${wasteTypeInfo.icon}
            </div>
            <h2 class="disposal-title">${data.itemName}</h2>
            <p class="disposal-subtitle">${wasteTypeInfo.name} - Disposal Guide</p>
        </div>
        
        <div class="disposal-info">
            <div class="info-section">
                <h3>
                    <div class="info-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    How to Dispose
                </h3>
                <ul>
                    ${data.disposalMethod.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            
            <div class="info-section">
                <h3>
                    <div class="info-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    Safety Tips
                </h3>
                <ul>
                    ${data.safetyTips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            
            <div class="info-section">
                <h3>
                    <div class="info-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                    </div>
                    Environmental Impact
                </h3>
                <p style="padding: 12px 0; padding-left: 36px; color: var(--text-secondary); line-height: 1.6;">
                    ${data.environmentalImpact}
                </p>
            </div>
            
            <div class="info-section">
                <h3>
                    <div class="info-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                    </div>
                    Classification Details
                </h3>
                <ul>
                    <li><strong>Compostable:</strong> ${data.compostable ? 'Yes ✓' : 'No ✗'}</li>
                    <li><strong>Recyclable:</strong> ${data.recyclable ? 'Yes ✓' : 'No ✗'}</li>
                    <li><strong>Confidence:</strong> ${data.confidence}%</li>
                </ul>
            </div>
        </div>
    `;
}

function closeDisposalGuide() {
    const classifySection = document.getElementById('classify');
    classifySection.style.display = 'block';
    
    const disposalSection = document.getElementById('disposal-guide');
    disposalSection.style.display = 'none';
    
    classifySection.scrollIntoView({ behavior: 'smooth' });
}

function shareAchievement() {
    const streakCount = document.getElementById('streakCount').textContent;
    const shareText = `I'm on a ${streakCount}-day streak with EcoSort! Join me in building a sustainable future. 🌱♻️ #EcoSort #ZeroWaste`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My EcoSort Achievement',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Share failed:', err));
    } else {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText);
            showToast('Achievement copied to clipboard!');
        } else {
            showToast('Sharing not supported on this device');
        }
    }
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    
    toastText.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
