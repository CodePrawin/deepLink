class DeepLinkRedirector {
  constructor() {
    this.config = window.APP_CONFIG;
    this.platforms = window.PLATFORMS;
    this.currentPlatform = this.detectPlatform();
    this.attempts = 0;
    this.maxAttempts = this.config.maxRetries;
    this.redirected = false;
    
    this.init();
  }

  init() {
    this.extractParams();
    this.setupEventListeners();
    this.startRedirection();
  }

  extractParams() {
    const urlParams = new URLSearchParams(window.location.search);
    this.params = {
      type: urlParams.get('type') || 'post',
      id: urlParams.get('id') || 'unknown'
    };
    
    // Validate params
    if (!this.isValidParam(this.params.id)) {
      this.showError('Invalid link parameters');
      return;
    }
    
    this.deepLinkPath = `${this.params.type}/${this.params.id}`;
    this.updateUI();
  }

  isValidParam(param) {
    return /^[a-zA-Z0-9_-]+$/.test(param);
  }

  detectPlatform() {
    const userAgent = navigator.userAgent;
    
    if (this.platforms.android.userAgent.test(userAgent)) {
      return 'android';
    } else if (this.platforms.ios.userAgent.test(userAgent)) {
      return 'ios';
    } else {
      return 'desktop';
    }
  }

  updateUI() {
    const elements = {
      type: document.getElementById('content-type'),
      id: document.getElementById('content-id'),
      platform: document.getElementById('platform')
    };

    if (elements.type) elements.type.textContent = this.params.type;
    if (elements.id) elements.id.textContent = this.params.id;
    if (elements.platform) elements.platform.textContent = this.currentPlatform;
  }

  setupEventListeners() {
    // Detect if user leaves page (app opened)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.redirected = true;
      }
    });

    window.addEventListener('blur', () => {
      this.redirected = true;
    });

    // Prevent multiple redirections
    window.addEventListener('focus', () => {
      if (this.redirected) {
        this.showFallback();
      }
    });
  }

  async startRedirection() {
    if (this.currentPlatform === 'desktop') {
      this.showFallback();
      return;
    }

    this.showStatus('Opening app...');
    
    try {
      await this.attemptRedirection();
    } catch (error) {
      console.error('Redirection failed:', error);
      this.showFallback();
    }
  }

  async attemptRedirection() {
    const platform = this.platforms[this.currentPlatform];
    
    if (this.currentPlatform === 'android') {
      // Try intent URL first (better fallback handling)
      window.location.href = platform.intent(this.deepLinkPath);
    } else {
      // iOS: Try custom scheme
      window.location.href = platform.scheme(this.deepLinkPath);
    }

    // Wait for redirect attempt
    setTimeout(() => {
      if (!this.redirected) {
        this.handleRedirectFailure();
      }
    }, this.config.redirectTimeout);
  }

  handleRedirectFailure() {
    this.attempts++;
    
    if (this.attempts < this.maxAttempts && this.currentPlatform === 'ios') {
      // iOS: Try alternative approach
      this.showStatus('Trying alternative method...');
      setTimeout(() => this.attemptRedirection(), 500);
    } else {
      this.showFallback();
    }
  }

  showStatus(message) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  showFallback() {
    const spinner = document.getElementById('spinner');
    const fallback = document.getElementById('fallback');
    
    if (spinner) spinner.classList.add('hidden');
    if (fallback) {
      fallback.classList.remove('hidden');
      fallback.classList.add('fade-in');
    }
    
    this.showStatus('Choose your platform:');
    this.setupStoreButtons();
  }

  setupStoreButtons() {
    const platform = this.platforms[this.currentPlatform];
    const primaryBtn = document.getElementById('primary-store-btn');
    const secondaryBtn = document.getElementById('secondary-store-btn');
    
    if (primaryBtn) {
      primaryBtn.href = platform.storeUrl;
      primaryBtn.textContent = this.currentPlatform === 'android' ? 
        '📱 Get on Google Play' : '📱 Download on App Store';
    }
    
    if (secondaryBtn && this.currentPlatform !== 'desktop') {
      const otherPlatform = this.currentPlatform === 'android' ? 'ios' : 'android';
      secondaryBtn.href = this.platforms[otherPlatform].storeUrl;
      secondaryBtn.textContent = otherPlatform === 'android' ? 
        'Also on Google Play' : 'Also on App Store';
      secondaryBtn.classList.remove('hidden');
    }
  }

  showError(message) {
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div class="header">
          <h1>⚠️ Error</h1>
        </div>
        <div class="content">
          <p>${message}</p>
          <a href="/" class="btn btn-primary">Go Home</a>
        </div>
      `;
    }
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DeepLinkRedirector();
  });
} else {
  new DeepLinkRedirector();
}