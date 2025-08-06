// ============================================================================
// ELEVENLABS CONVAI WIDGET SETUP (MODULAR VERSION)
// ============================================================================

// PATCH: Prevent browser crash due to read-only error on RTCPeerConnection
try {
  Object.defineProperty(RTCPeerConnection.prototype, 'addEventListener', {
    writable: false,
    configurable: false
  });
} catch (e) {
  console.warn('RTCPeerConnection.addEventListener is already locked.');
}

// REQUIRED: Replace with your ElevenLabs agent ID
const AGENT_ID = 'agent_6401k0yatsegeg6t8ck9mkhpgazv';

// OPTIONAL SETTINGS
const OPEN_IN_NEW_TAB = true;
const WIDGET_POSITION = 'bottom-right';
const BASE_URL = 'https://midwifems.com';

// ============================================================================
// DON'T CHANGE BELOW THIS LINE
// ============================================================================

function injectElevenLabsWidget() {
  const ID = 'elevenlabs-convai-widget';
  if (document.getElementById(ID)) return;

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
  script.async = true;
  script.type = 'text/javascript';
  document.head.appendChild(script);

  const wrapper = document.createElement('div');
  wrapper.className = `convai-widget ${WIDGET_POSITION}`;

  const widget = document.createElement('elevenlabs-convai');
  widget.id = ID;
  widget.setAttribute('agent-id', AGENT_ID);
  widget.setAttribute('variant', 'full');

  widget.addEventListener('elevenlabs-convai:call', (event) => {
    event.detail.config.clientTools = {
      redirectToExternalURL: ({ url }) => redirect(url),
      redirectToExternalURLHealth: ({ url }) => redirect(url)
      // Add more tools here as needed
    };
  });

  wrapper.appendChild(widget);
  document.body.appendChild(wrapper);
}

function redirect(url) {
  let fullUrl = url;
  if (!url.startsWith('http')) {
    const baseUrl = BASE_URL || window.location.origin;
    fullUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  console.log('Navigating to:', fullUrl);
  if (OPEN_IN_NEW_TAB) {
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = fullUrl;
  }
}

// Fallback for manual tool_call tests (outside widget)
window.addEventListener('message', function (e) {
  const data = e.data;
  if (data?.type === 'tool_call') {
    const base = BASE_URL || window.location.origin;
    const targetUrl = `${base}${data.parameters?.url || '/'}`;
    console.log('[Fallback] Redirecting to:', targetUrl);
    window.location.href = targetUrl;
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectElevenLabsWidget);
} else {
  injectElevenLabsWidget();
}
