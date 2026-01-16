import React, { useState, useEffect } from "react";
import "./TokenPage.css";

function TokenPage() {
  const [token, setToken] = useState("");

  useEffect(() => {
    // Get token from sessionStorage
    const storedToken = sessionStorage.getItem("firebaseIdToken");
    if (storedToken) {
      setToken(storedToken);
    }

    // Load Retell Chat Widget only on TokenPage
    const loadRetellWidget = () => {
      // Check if script already exists
      if (document.getElementById("retell-widget")) {
        return;
      }

      // Add CSS variables for widget
      const style = document.createElement("style");
      style.textContent = `
        :root {
          --retell-chat-width: 420px;
          --retell-chat-height: 600px;
        }
      `;
      document.head.appendChild(style);

      // Create and add the Retell widget script
      const script = document.createElement("script");
      script.id = "retell-widget";
      script.src = "https://dashboard.retellai.com/retell-widget.js";
      script.type = "module";
      script.setAttribute("data-public-key", "public_key_c47e92eeb33d12413353a");
      script.setAttribute("data-agent-id", "agent_54ae9898d491a6d502b0818877");
      script.setAttribute("data-title", "Assistant");
      script.setAttribute("data-bot-name", "Web Assistant");
      script.setAttribute("data-popup-message", "Hi! How can I help?");
      script.setAttribute("data-color", "#2563eb");
      script.setAttribute("data-show-ai-popup", "true");
      script.setAttribute("data-show-ai-popup-time", "5");
      script.setAttribute("data-auto-open", "false");
      script.setAttribute("data-dynamic", JSON.stringify({
        page: "home",
        channel: "web"
      }));

      document.head.appendChild(script);
    };

    loadRetellWidget();

    // Cleanup function to remove widget when component unmounts
    return () => {
      const widgetScript = document.getElementById("retell-widget");
      if (widgetScript) {
        widgetScript.remove();
      }
      // Note: The widget might create additional DOM elements that we can't easily clean up
      // but removing the script should prevent it from functioning
    };
  }, []);

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    alert("Token copied to clipboard!");
  };

  return (
    <div className="token-page">
      <div className="token-container">
        <h2>ID Token</h2>
        <p className="token-label">Your Firebase ID Token:</p>
        <div className="token-display">
          <textarea 
            value={token} 
            readOnly 
            rows={8} 
            className="token-textarea"
          />
          <button onClick={copyToken} className="copy-button">
            Copy Token
          </button>
        </div>
      </div>
    </div>
  );
}

export default TokenPage;
