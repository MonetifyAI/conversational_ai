// ============================================================================
// ELEVENLABS CONVAI WIDGET SETUP
// ============================================================================
// 
// CHANGE THESE VALUES FOR YOUR SITE:
// ============================================================================

// REQUIRED: Replace with your ElevenLabs agent ID
const AGENT_ID = 'agent_6401k0yatsegeg6t8ck9mkhpgazv';

// OPTIONAL: Change navigation behavior
const OPEN_IN_NEW_TAB = true; // true = new tab, false = same tab

// OPTIONAL: Change widget position
const WIDGET_POSITION = 'bottom-right'; // 'bottom-right', 'bottom-left', 'top-right', 'top-left'

// OPTIONAL: Base URL for navigation (leave empty for auto-detection)
const BASE_URL = 'https://midwifems.com'; // e.g., 'https://mysite.framer.app' or 'https://mysite.wixsite.com/mysite'

// ============================================================================
// DON'T CHANGE ANYTHING BELOW THIS LINE
// ============================================================================

// Create and inject the widget with client tools
function injectElevenLabsWidget() {
  const ID = 'elevenlabs-convai-widget';
  if (document.getElementById(ID)) return;

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
  script.async = true;
  script.type = 'text/javascript';

  script.onload = () => {
    // Create wrapper and widget after script loads
    const wrapper = document.createElement('div');
    wrapper.className = `convai-widget ${WIDGET_POSITION}`;

    const widget = document.createElement('elevenlabs-convai');
    widget.id = ID;
    widget.setAttribute('agent-id', AGENT_ID);
    widget.setAttribute('variant', 'full');

    widget.addEventListener('elevenlabs-convai:call', (event) => {
      event.detail.config.clientTools = {
        redirectToExternalURL: ({ url }) => {
          console.log('redirectToExternalURL called with url:', url);
          let fullUrl = url;

          if (!url.startsWith('http')) {
            const baseUrl = BASE_URL || window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
            fullUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
          }

          console.log('Navigating to:', fullUrl);

          const link = document.createElement('a');
          link.href = fullUrl;
          link.target = OPEN_IN_NEW_TAB ? '_blank' : '_self';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
      };
    });

    wrapper.appendChild(widget);
    document.body.appendChild(wrapper);
  };

  document.head.appendChild(script);
}
