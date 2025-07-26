// Main application logic for OTPGen.online

let totpInterval;
let currentSecret = '';

/**
 * Show alert message
 * @param {string} message - Message to show
 * @param {string} type - Alert type (success|error)
 */
function showAlert(message, type = 'success') {
    const alertDiv = document.getElementById('alert');
    if (!alertDiv) return;
    
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.classList.remove('hidden');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        alertDiv.classList.add('hidden');
    }, 3000);
}

/**
 * Generate 2FA code from secret key
 */
async function generateCode() {
    const secretKey = document.getElementById('secretKey')?.value?.trim();
    
    if (!secretKey) {
        showAlert(getMessage('msgKeyRequired'), 'error');
        return;
    }
    
    // Validate secret key format
    if (!window.TOTPGenerator.validate(secretKey)) {
        showAlert(getMessage('msgInvalidKey'), 'error');
        return;
    }
    
    try {
        currentSecret = secretKey.replace(/\s/g, '');
        const code = await window.TOTPGenerator.generate(currentSecret);
        
        // Display the code
        const codeElement = document.getElementById('totpCode');
        if (codeElement) {
            codeElement.textContent = code;
        }
        
        // Show code section
        const codeSection = document.getElementById('codeSection');
        if (codeSection) {
            codeSection.classList.remove('hidden');
        }
        
        // Clear any existing interval
        if (totpInterval) {
            clearInterval(totpInterval);
        }
        
        // Start countdown timer
        startTimer();
        showAlert(getMessage('msgCodeGenerated'));
        
        // Track event for analytics
        trackEvent('generate_code', {
            success: true,
            platform: detectPlatform(secretKey)
        });
        
    } catch (error) {
        console.error('Error generating TOTP:', error);
        showAlert(getMessage('msgInvalidKey'), 'error');
        
        // Track error for analytics
        trackEvent('generate_code', {
            success: false,
            error: error.message
        });
    }
}

/**
 * Start countdown timer for TOTP code
 */
function startTimer() {
    const updateTimer = async () => {
        const timeLeft = window.TOTPGenerator.getRemainingTime();
        
        // Update display
        const timeLeftElement = document.getElementById('timeLeft');
        if (timeLeftElement) {
            timeLeftElement.textContent = timeLeft;
        }
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progress = ((30 - timeLeft) / 30) * 100;
            progressFill.style.width = progress + '%';
        }
        
        // Generate new code when timer resets (timeLeft = 30)
        if (timeLeft === 30 && currentSecret) {
            try {
                const newCode = await window.TOTPGenerator.generate(currentSecret);
                const codeElement = document.getElementById('totpCode');
                if (codeElement) {
                    codeElement.textContent = newCode;
                }
                
                // Track auto refresh
                trackEvent('auto_refresh_code');
                
            } catch (error) {
                console.error('Error refreshing code:', error);
            }
        }
    };
    
    // Update immediately and then every second
    updateTimer();
    totpInterval = setInterval(updateTimer, 1000);
}

/**
 * Manually refresh the TOTP code
 */
async function refreshCode() {
    if (!currentSecret) {
        showAlert(getMessage('msgKeyRequiredFirst'), 'error');
        return;
    }
    
    try {
        const code = await window.TOTPGenerator.generate(currentSecret);
        const codeElement = document.getElementById('totpCode');
        if (codeElement) {
            codeElement.textContent = code;
        }
        
        showAlert(getMessage('msgCodeRefreshed'));
        
        // Track manual refresh
        trackEvent('manual_refresh_code');
        
    } catch (error) {
        console.error('Error refreshing code:', error);
        showAlert(getMessage('msgRefreshError'), 'error');
    }
}

/**
 * Copy TOTP code to clipboard
 */
async function copyCode() {
    const codeElement = document.getElementById('totpCode');
    if (!codeElement) return;
    
    const code = codeElement.textContent;
    if (code === '------') {
        showAlert(getMessage('msgNoCode'), 'error');
        return;
    }
    
    try {
        // Use modern clipboard API if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(code);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = code;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        showAlert(getMessage('msgCodeCopied'));
        
        // Track copy event
        trackEvent('copy_code');
        
    } catch (error) {
        console.error('Error copying code:', error);
        showAlert('Copy failed', 'error');
    }
}

/**
 * Detect platform from secret key patterns (for analytics)
 * @param {string} secret - Secret key
 * @returns {string} - Detected platform
 */
function detectPlatform(secret) {
    const cleanSecret = secret.replace(/\s/g, '').toUpperCase();
    
    // This is just for analytics, not security
    if (cleanSecret.length === 32) return 'google';
    if (cleanSecret.length === 40) return 'facebook';
    if (cleanSecret.length === 26) return 'microsoft';
    
    return 'unknown';
}

/**
 * Track events for analytics
 * @param {string} eventName - Event name
 * @param {Object} properties - Event properties
 */
function trackEvent(eventName, properties = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Console log for debugging
    console.log('Event:', eventName, properties);
}

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Ctrl/Cmd + Enter to generate code
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            generateCode();
        }
        
        // Ctrl/Cmd + C to copy code (when code is visible)
        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
            const codeSection = document.getElementById('codeSection');
            if (codeSection && !codeSection.classList.contains('hidden')) {
                event.preventDefault();
                copyCode();
            }
        }
        
        // F5 or Ctrl/Cmd + R to refresh code (when code is visible)
        if (event.key === 'F5' || ((event.ctrlKey || event.metaKey) && event.key === 'r')) {
            const codeSection = document.getElementById('codeSection');
            if (codeSection && !codeSection.classList.contains('hidden')) {
                event.preventDefault();
                refreshCode();
            }
        }
    });
}

/**
 * Initialize form enhancements
 */
function initFormEnhancements() {
    const secretKeyInput = document.getElementById('secretKey');
    if (!secretKeyInput) return;
    
    // Auto-format secret key input
    secretKeyInput.addEventListener('input', (event) => {
        const value = event.target.value;
        const cleanValue = value.replace(/[^A-Za-z2-7\s]/g, ''); // Remove invalid chars
        
        if (cleanValue !== value) {
            event.target.value = cleanValue;
        }
    });
    
    // Enter key to generate
    secretKeyInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            generateCode();
        }
    });
    
    // Paste event handling
    secretKeyInput.addEventListener('paste', (event) => {
        setTimeout(() => {
            const value = event.target.value;
            const cleanValue = value.replace(/[^A-Za-z2-7\s]/g, '').toUpperCase();
            
            if (cleanValue !== value) {
                event.target.value = cleanValue;
            }
        }, 10);
    });
}

/**
 * Check browser compatibility
 */
function checkCompatibility() {
    if (!window.TOTPGenerator.isSupported()) {
        showAlert('Your browser doesn\'t support required security features. Please use a modern browser.', 'error');
        return false;
    }
    return true;
}

/**
 * Initialize error handling
 */
function initErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        trackEvent('javascript_error', {
            message: event.error?.message || 'Unknown error',
            filename: event.filename,
            lineno: event.lineno
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        trackEvent('promise_rejection', {
            reason: event.reason?.message || 'Unknown rejection'
        });
    });
}

/**
 * Initialize mobile-specific features
 */
function initMobileFeatures() {
    // Prevent zoom on double-tap for iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', () => {
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
    });
}

/**
 * Initialize URL parameter handling
 */
function initURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Auto-fill secret key from URL parameter (for testing)
    const secretParam = urlParams.get('secret');
    if (secretParam && window.location.hostname === 'localhost') {
        const secretKeyInput = document.getElementById('secretKey');
        if (secretKeyInput) {
            secretKeyInput.value = secretParam;
        }
    }
    
    // Auto-generate if requested
    const autoGenerate = urlParams.get('auto');
    if (autoGenerate === 'true' && secretParam) {
        setTimeout(generateCode, 500);
    }
}

/**
 * Initialize offline detection
 */
function initOfflineDetection() {
    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        
        if (!isOnline) {
            showAlert('You are offline. The generator still works!', 'success');
        }
        
        // Track online/offline status
        trackEvent('connection_status', { online: isOnline });
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

/**
 * Initialize page visibility handling
 */
function initPageVisibility() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden, clear timer to save resources
            if (totpInterval) {
                clearInterval(totpInterval);
            }
        } else {
            // Page is visible again, restart timer if needed
            if (currentSecret) {
                startTimer();
            }
        }
    });
}

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        trackEvent('page_load_time', { duration: Math.round(loadTime) });
    });

    // Track TOTP generation time
    const originalGenerate = window.TOTPGenerator.generate;
    window.TOTPGenerator.generate = async function(...args) {
        const startTime = performance.now();
        const result = await originalGenerate.apply(this, args);
        const duration = performance.now() - startTime;
        
        trackEvent('totp_generation_time', { duration: Math.round(duration) });
        return result;
    };
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Add ARIA labels dynamically
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.setAttribute('aria-label', 'Generate 2FA authentication code');
    }

    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.setAttribute('aria-label', 'Copy authentication code to clipboard');
    }

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.setAttribute('aria-label', 'Refresh authentication code');
    }

    // Add keyboard navigation for language toggle
    const langToggle = document.querySelector('.language-toggle');
    if (langToggle) {
        langToggle.setAttribute('role', 'button');
        langToggle.setAttribute('tabindex', '0');
        langToggle.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleLanguage();
            }
        });
    }
}

/**
 * Cleanup function when page unloads
 */
function cleanup() {
    if (totpInterval) {
        clearInterval(totpInterval);
    }
    
    // Clear sensitive data
    currentSecret = '';
    
    const secretKeyInput = document.getElementById('secretKey');
    if (secretKeyInput) {
        secretKeyInput.value = '';
    }
    
    const codeElement = document.getElementById('totpCode');
    if (codeElement) {
        codeElement.textContent = '------';
    }
}

/**
 * Initialize service worker for PWA features
 */
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
                trackEvent('service_worker_registered');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
                trackEvent('service_worker_failed', { error: error.message });
            });
    }
}

/**
 * Main initialization function
 */
function init() {
    // Check browser compatibility first
    if (!checkCompatibility()) {
        return;
    }

    // Initialize all features
    initKeyboardShortcuts();
    initFormEnhancements();
    initErrorHandling();
    initMobileFeatures();
    initURLParams();
    initOfflineDetection();
    initPageVisibility();
    initPerformanceMonitoring();
    initAccessibility();
    initServiceWorker();

    // Set up cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);

    // Track page view
    trackEvent('page_view', {
        page: window.location.pathname,
        language: currentLanguage,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    });

    console.log('🔐 OTPGen.online initialized successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}