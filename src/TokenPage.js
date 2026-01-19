import React, { useState, useEffect } from "react";
import "./TokenPage.css";

function TokenPage() {
  const [token, setToken] = useState("");
  const [widgetError, setWidgetError] = useState("");

  useEffect(() => {
    // Get token from sessionStorage
    const storedToken = sessionStorage.getItem("firebaseIdToken");
    if (storedToken) {
      setToken(storedToken);
    }

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

    // Listen for errors from the widget
    const handleError = (event) => {
      // Check if it's a Retell widget error
      if (event.detail && event.detail.message) {
        const errorMessage = event.detail.message;
        if (errorMessage.includes("Public key is not allowed for this domain")) {
          const currentDomain = window.location.hostname;
          setWidgetError(
            `Retell AI Widget Error: The public key is not configured for this domain (${currentDomain}). ` +
            `Please add "${currentDomain}" to the allowed domains list in your Retell AI dashboard settings.`
          );
        } else {
          setWidgetError(`Retell AI Widget Error: ${errorMessage}`);
        }
      }
    };

    // Listen for custom error events from Retell widget
    window.addEventListener("retell-widget-error", handleError);

    // Also listen for console errors (as fallback)
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorString = args.join(" ");
      if (errorString.includes("Public key is not allowed for this domain") || 
          errorString.includes("public key is not allowed")) {
        const currentDomain = window.location.hostname;
        setWidgetError(
          `Retell AI Widget Error: The public key is not configured for this domain (${currentDomain}). ` +
          `Please add "${currentDomain}" to the allowed domains list in your Retell AI dashboard settings.`
        );
      }
      originalConsoleError.apply(console, args);
    };

    // Listen for unhandled errors
    const handleWindowError = (event) => {
      const errorMessage = event.message || event.error?.message || "";
      if (errorMessage.includes("Public key is not allowed for this domain") ||
          errorMessage.includes("public key is not allowed")) {
        const currentDomain = window.location.hostname;
        setWidgetError(
          `Retell AI Widget Error: The public key is not configured for this domain (${currentDomain}). ` +
          `Please add "${currentDomain}" to the allowed domains list in your Retell AI dashboard settings.`
        );
      }
    };
    window.addEventListener("error", handleWindowError);

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

    // Handle script load errors
    script.onerror = () => {
      setWidgetError("Failed to load Retell AI widget script. Please check your network connection.");
    };

    document.head.appendChild(script);

    // Cleanup function to remove widget when component unmounts
    return () => {
      const widgetScript = document.getElementById("retell-widget");
      if (widgetScript) {
        widgetScript.remove();
      }
      window.removeEventListener("retell-widget-error", handleError);
      window.removeEventListener("error", handleWindowError);
      console.error = originalConsoleError;
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
        {widgetError && (
          <div className="widget-error-message">
            <strong>⚠️ Widget Error:</strong>
            <p>{widgetError}</p>
            <p className="error-help">
              To fix this, go to your{" "}
              <a 
                href="https://dashboard.retellai.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Retell AI Dashboard
              </a>{" "}
              and add <code>{window.location.hostname}</code> to the allowed domains for your public key.
            </p>
          </div>
        )}
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
