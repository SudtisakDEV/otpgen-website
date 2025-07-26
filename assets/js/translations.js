// Translation system for OTPGen.online

let currentLanguage = 'th';

const translations = {
    th: {
        // Navigation
        'nav-home': 'หน้าแรก',
        'nav-blog': 'บล็อก',
        'nav-guide': 'วิธีใช้',
        'nav-privacy': 'ความเป็นส่วนตัว',
        'nav-terms': 'เงื่อนไข',
        
        // Header
        mainTitle: '🔐 OTPGen.online',
        tagline: 'ฟรี! สร้างรหัส 2FA TOTP Code Generator ออนไลน์',
        keywords: 'Facebook • Instagram • Google Authenticator • รหัสยืนยัน • ปลอดภัย',
        
        // Main Content
        introTitle: 'สร้างรหัส 2FA แบบฟรี ปลอดภัย 100%',
        introText: 'ไม่ต้องติดตั้งแอป ใช้งานได้ทันที รองรับทุกแพลตฟอร์ม',
        
        // Features
        feature1: 'ปลอดภัย 100%',
        feature2: 'ใช้งานทันที',
        feature3: 'ฟรี ตลอดกาล',
        feature4: 'รองรับทุกอุปกรณ์',
        
        // Form
        secretLabel: '2FA Secret Key (รหัสลับจาก Facebook/Google)',
        generateBtn: '🚀 สร้างรหัส 2FA ทันที',
        codeLabel: 'รหัส 2FA ของคุณ (6 หลัก)',
        timerText: 'รหัสจะหมดอายุใน',
        secondText: 'วินาที',
        copyBtn: '📋 คัดลอกรหัส',
        refreshBtn: '🔄 สร้างใหม่',
        
        // SEO Content
        seoTitle1: 'วิธีใช้งาน 2FA Code Generator ฟรี',
        seoText1: 'OTPGen.online เป็นเครื่องมือสร้างรหัส 2FA TOTP ฟรี ออนไลน์ ที่ปลอดภัยที่สุด ไม่ต้องติดตั้งแอปพลิเคชัน Google Authenticator หรือ Microsoft Authenticator ใช้งานได้ทันทีผ่านเว็บเบราว์เซอร์',
        seoTitle2: 'รองรับทุกแพลตฟอร์ม Facebook Instagram Google',
        seoText2: 'รองรับการสร้างรหัสยืนยัน 2FA สำหรับ Facebook, Instagram, Google Account, Microsoft, Amazon, Twitter, GitHub, Dropbox และแพลตฟอร์มอื่นๆ ที่ใช้มาตรฐาน TOTP RFC 6238',
        seoTitle3: 'ปลอดภัย ไม่เก็บข้อมูล',
        seoText3: 'ระบบทำงานแบบ Client-side เท่านั้น ไม่มีการส่งข้อมูล Secret Key ไปยังเซิร์ฟเวอร์ ข้อมูลของคุณปลอดภัย 100% ไม่มีการเก็บบันทึกใดๆ',
        
        // Footer
        footerTitle: 'OTPGen.online - เครื่องมือสร้างรหัส 2FA ที่ดีที่สุด',
        footerText1: 'ฟรี • ปลอดภัย • ใช้งานง่าย • รองรับทุกอุปกรณ์',
        footerText2: 'สร้างรหัส TOTP, Google Authenticator Code, Facebook 2FA ได้ทันที',
        footerText3: '© 2024 OTPGen.online - Free 2FA Code Generator',
        
        // Language
        langToggle: '🇺🇸 EN',
        
        // Messages
        msgKeyRequired: 'กรุณาใส่ Secret Key',
        msgCodeGenerated: 'สร้าง 2FA Code สำเร็จ!',
        msgInvalidKey: 'Secret Key ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
        msgKeyRequiredFirst: 'กรุณาใส่ Secret Key ก่อน',
        msgCodeRefreshed: 'รีเฟรช Code แล้ว!',
        msgRefreshError: 'เกิดข้อผิดพลาดในการรีเฟรช Code',
        msgNoCode: 'ยังไม่มี Code ให้ Copy',
        msgCodeCopied: 'คัดลอก Code สำเร็จ!',
        
        // Placeholder
        placeholder: 'ใส่ Secret Key ที่ได้จาก Facebook, Instagram, Google เช่น: S2WO ZCCB WI3B F47G WCAD IBRW DXUH RWOO'
    },
    
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-blog': 'Blog',
        'nav-guide': 'How to Use',
        'nav-privacy': 'Privacy',
        'nav-terms': 'Terms',
        
        // Header
        mainTitle: '🔐 OTPGen.online',
        tagline: 'Free! 2FA TOTP Code Generator Online',
        keywords: 'Facebook • Instagram • Google Authenticator • 2FA • Secure',
        
        // Main Content
        introTitle: 'Free & Secure 2FA Code Generator',
        introText: 'No app installation required. Works instantly on all platforms',
        
        // Features
        feature1: '100% Secure',
        feature2: 'Instant Use',
        feature3: 'Forever Free',
        feature4: 'All Devices',
        
        // Form
        secretLabel: '2FA Secret Key (from Facebook/Google)',
        generateBtn: '🚀 Generate 2FA Code Now',
        codeLabel: 'Your 2FA Code (6 digits)',
        timerText: 'Code expires in',
        secondText: 'seconds',
        copyBtn: '📋 Copy Code',
        refreshBtn: '🔄 Refresh',
        
        // SEO Content
        seoTitle1: 'How to Use Free 2FA Code Generator',
        seoText1: 'OTPGen.online is the safest free online 2FA TOTP code generator. No need to install Google Authenticator or Microsoft Authenticator apps. Works instantly through web browser.',
        seoTitle2: 'Supports All Platforms Facebook Instagram Google',
        seoText2: 'Supports generating 2FA verification codes for Facebook, Instagram, Google Account, Microsoft, Amazon, Twitter, GitHub, Dropbox and other platforms using TOTP RFC 6238 standard.',
        seoTitle3: 'Secure & No Data Storage',
        seoText3: 'System works client-side only. No Secret Key data is sent to servers. Your data is 100% secure with no logging whatsoever.',
        
        // Footer
        footerTitle: 'OTPGen.online - The Best 2FA Code Generator Tool',
        footerText1: 'Free • Secure • Easy to Use • All Devices Supported',
        footerText2: 'Generate TOTP, Google Authenticator Code, Facebook 2FA instantly',
        footerText3: '© 2024 OTPGen.online - Free 2FA Code Generator',
        
        // Language
        langToggle: '🇹🇭 TH',
        
        // Messages
        msgKeyRequired: 'Please enter Secret Key',
        msgCodeGenerated: '2FA Code generated successfully!',
        msgInvalidKey: 'Invalid Secret Key. Please check again.',
        msgKeyRequiredFirst: 'Please enter Secret Key first',
        msgCodeRefreshed: 'Code refreshed!',
        msgRefreshError: 'Error refreshing code',
        msgNoCode: 'No code to copy',
        msgCodeCopied: 'Code copied successfully!',
        
        // Placeholder
        placeholder: 'Enter Secret Key from Facebook, Instagram, Google e.g: S2WO ZCCB WI3B F47G WCAD IBRW DXUH RWOO'
    }
};

// Toggle language function
function toggleLanguage() {
    currentLanguage = currentLanguage === 'th' ? 'en' : 'th';
    updateLanguage();
    
    // Update URL without reload
    const url = new URL(window.location);
    if (currentLanguage === 'en') {
        url.searchParams.set('lang', 'en');
    } else {
        url.searchParams.delete('lang');
    }
    window.history.replaceState({}, '', url);
}

// Update all text elements
function updateLanguage() {
    const lang = translations[currentLanguage];
    
    // Update all elements with IDs
    Object.keys(lang).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = lang[key];
        }
    });
    
    // Update placeholder
    const secretKeyInput = document.getElementById('secretKey');
    if (secretKeyInput) {
        secretKeyInput.placeholder = lang.placeholder;
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        const newDesc = currentLanguage === 'th' 
            ? 'สร้างรหัส 2FA TOTP Code ฟรี ออนไลน์ ปลอดภัย รองรับ Facebook Instagram Google Authenticator ไม่ต้องติดตั้งแอป ใช้งานง่าย'
            : 'Generate 2FA TOTP codes free online. Secure, supports Facebook Instagram Google Authenticator. No app installation required. Easy to use.';
        metaDesc.content = newDesc;
    }
    
    // Update page title
    const newTitle = currentLanguage === 'th'
        ? 'OTPGen.online - ฟรี! สร้างรหัส 2FA Code Generator TOTP ออนไลน์'
        : 'OTPGen.online - Free! 2FA TOTP Code Generator Online';
    document.title = newTitle;
}

// Get message in current language
function getMessage(key) {
    return translations[currentLanguage][key] || key;
}

// Initialize language from URL or default
function initializeLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam === 'en') {
        currentLanguage = 'en';
    } else {
        currentLanguage = 'th';
    }
    
    updateLanguage();
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLanguage);