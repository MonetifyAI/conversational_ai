// ============================================================================
// ELEVENLABS CONVAI WIDGET SETUP (MODULAR VERSION) - FIXED
// ============================================================================

// REQUIRED: Replace with your ElevenLabs agent ID
const AGENT_ID = ‘agent_6401k0yatsegeg6t8ck9mkhpgazv’;

// OPTIONAL SETTINGS
const OPEN_IN_NEW_TAB = true;
const WIDGET_POSITION = ‘bottom-right’;
const BASE_URL = ‘https://midwifems.com’;

// ============================================================================
// DON’T CHANGE BELOW THIS LINE
// ============================================================================

function injectElevenLabsWidget() {
const ID = ‘elevenlabs-convai-widget’;
if (document.getElementById(ID)) return;

const script = document.createElement(‘script’);
script.src = ‘https://unpkg.com/@elevenlabs/convai-widget-embed’;
script.async = true;
script.type = ‘text/javascript’;

// Wait for script to load before setting up the widget
script.onload = function() {
setupWidget();
};

document.head.appendChild(script);
}

function setupWidget() {
const ID = ‘elevenlabs-convai-widget’;

const wrapper = document.createElement(‘div’);
wrapper.className = convai-widget ${WIDGET_POSITION};

const widget = document.createElement(‘elevenlabs-convai’);
widget.id = ID;
widget.setAttribute(‘agent-id’, AGENT_ID);
widget.setAttribute(‘variant’, ‘full’);

// Use a more robust event listener setup
function attachEventListener() {
try {
if (widget && typeof widget.addEventListener === ‘function’) {
widget.addEventListener(‘elevenlabs-convai:call’, (event) => {
try {
event.detail.config.clientTools = {
redirectToExternalURL: ({ url }) => redirect(url),
redirectToExternalURLHealth: ({ url }) => redirect(url)
// Add more tools here as needed
};
} catch (error) {
console.warn(‘Error setting up client tools:’, error);
}
});
} else {
// Retry after a short delay if widget isn’t ready
setTimeout(attachEventListener, 100);
}
} catch (error) {
console.warn(‘Error attaching event listener:’, error);
// Try alternative approach using custom event
setTimeout(() => {
try {
document.addEventListener(‘elevenlabs-convai:call’, (event) => {
if (event.detail && event.detail.config) {
event.detail.config.clientTools = {
redirectToExternalURL: ({ url }) => redirect(url),
redirectToExternalURLHealth: ({ url }) => redirect(url)
};
}
});
} catch (fallbackError) {
console.warn(‘Fallback event listener also failed:’, fallbackError);
}
}, 200);
}
}

wrapper.appendChild(widget);
document.body.appendChild(wrapper);

// Wait a bit for the widget to initialize before attaching listener
setTimeout(attachEventListener, 50);
}

function redirect(url) {
let fullUrl = url;
if (!url.startsWith(‘http’)) {
const baseUrl = BASE_URL || window.location.origin;
fullUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

console.log(‘Navigating to:’, fullUrl);
if (OPEN_IN_NEW_TAB) {
window.open(fullUrl, ‘_blank’, ‘noopener,noreferrer’);
} else {
window.location.href = fullUrl;
}
}

// Enhanced fallback for manual tool_call tests (outside widget)
window.addEventListener(‘message’, function (e) {
try {
const data = e.data;
if (data?.type === ‘tool_call’) {
const base = BASE_URL || window.location.origin;
const targetUrl = `${base}${data.parameters?.url || '/'}`;
console.log(’[Fallback] Redirecting to:’, targetUrl);
window.location.href = targetUrl;
}
} catch (error) {
console.warn(‘Error in message handler:’, error);
}
});

// Initialize when DOM is ready
if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, injectElevenLabsWidget);
} else {
injectElevenLabsWidget();
}
