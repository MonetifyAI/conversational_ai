<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Voice Agent Widget</title>
</head>
<body style="margin:0; padding:0;">
  <script>
    const AGENT_ID = 'agent_6401k0yatsegeg6t8ck9mkhpgazv';
    const BASE_URL = 'https://midwifems.com';
    const WIDGET_POSITION = 'bottom-right';
    const OPEN_IN_NEW_TAB = false;

    function injectElevenLabsWidget() {
      const ID = 'elevenlabs-convai-widget';
      if (document.getElementById(ID)) return;

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      document.head.appendChild(script);

      const wrapper = document.createElement('div');
      wrapper.className = convai-widget ${WIDGET_POSITION};

      const widget = document.createElement('elevenlabs-convai');
      widget.id = ID;
      widget.setAttribute('agent-id', AGENT_ID);
      widget.setAttribute('variant', 'full');

      widget.addEventListener('elevenlabs-convai:call', (event) => {
        event.detail.config.clientTools = {
          redirectToExternalURL: ({ url }) => {
            let fullUrl = url;
            if (!url.startsWith('http')) {
              const baseUrl = BASE_URL;
              fullUrl = ${baseUrl}${url.startsWith('/') ? '' : '/'}${url};
            }
            if (OPEN_IN_NEW_TAB) {
              window.open(fullUrl, '_blank', 'noopener,noreferrer');
            } else {
              window.location.href = fullUrl;
            }
          }
        };
      });

      wrapper.appendChild(widget);
      document.body.appendChild(wrapper);
    }

    // Manual fallback for tool call
    window.addEventListener('message', function (e) {
      const data = e.data;
      if (data?.type === 'tool_call' && data?.name === 'redirectToExternalURL') {
        const targetUrl = ${BASE_URL}${data.parameters?.url || '/'};
        console.log('[Global Listener] Redirecting to:', targetUrl);
        window.location.href = targetUrl;
      }
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectElevenLabsWidget);
    } else {
      injectElevenLabsWidget();
    }
  </script>
</body>
</html>
