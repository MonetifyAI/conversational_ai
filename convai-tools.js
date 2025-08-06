// ============================================================================
// ELEVENLABS CONVAI WIDGET SETUP (TARGETED FIX)
// ============================================================================

// REQUIRED: Replace with your ElevenLabs agent ID
const AGENT_ID = ‘agent_6401k0yatsegeg6t8ck9mkhpgazv’;

// OPTIONAL SETTINGS
const OPEN_IN_NEW_TAB = true;
const WIDGET_POSITION = ‘bottom-right’;
const BASE_URL = ‘https://Midwifems.com’;

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
document.head.appendChild(script);

// Wait for the script to load and ElevenLabs to be available
script.onload = function() {
// Give ElevenLabs time to initialize
setTimeout(createWidget, 100);
};
}

function createWidget() {
const ID = ‘elevenlabs-convai-widget’;

const wrapper = document.createElement(‘div’);
wrapper.className = `convai-widget ${WIDGET_POSITION}`;

const widget = document.createElement(‘elevenlabs-convai’);
widget.id = ID;
widget.setAttribute(‘agent-id’, AGENT_ID);
widget.setAttribute(‘variant’, ‘full’);

wrapper.appendChild(widget);
document.body.appendChild(wrapper);

// CRITICAL FIX: Use document-level listener instead of widget-level
// This avoids the RTCPeerConnection conflict
document.addEventListener(‘elevenlabs-convai:call’, (event) => {
if (event.detail && event.detail.config) {
event.detail.config.clientTools = {
redirectToExternalURL: ({ url }) => redirect(url),
redirectToExternalURLHealth: ({ url }) => redirect(url)
// Add more tools here as needed
};
}
});

// Also try the global approach as backup
setTimeout(() => {
if (window.ElevenLabs && window.ElevenLabs.convai) {
try {
window.ElevenLabs.convai.clientTools = {
redirectToExternalURL: ({ url }) => redirect(url),
redirectToExternalURLHealth: ({ url }) => redirect(url)
};
} catch (e) {
console.log(‘Global approach not available, document listener should work’);
}
}
}, 500);
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

// Fallback for manual tool_call tests (outside widget)
window.addEventListener(‘message’, function (e) {
const data = e.data;
if (data?.type === ‘tool_call’) {
const base = BASE_URL || window.location.origin;
const targetUrl = `${base}${data.parameters?.url || '/'}`;
console.log(’[Fallback] Redirecting to:’, targetUrl);
window.location.href = targetUrl;
}
});

if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, injectElevenLabsWidget);
} else {
injectElevenLabsWidget();
}
