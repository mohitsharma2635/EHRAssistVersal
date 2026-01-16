import React, { useState, useEffect } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import TokenPage from "./TokenPage";

const firebaseConfig = {
  apiKey: "AIzaSyAXlm95hHdbyXo4VJbOWhvY3D_arreyVjo",
  authDomain: "ehrassist-2118c.firebaseapp.com",
  projectId: "ehrassist-2118c",
  storageBucket: "ehrassist-2118c.firebasestorage.app",
  messagingSenderId: "1076018771241",
  appId: "1:1076018771241:web:1c93febef3926e1ca67338",
  measurementId: "G-1BL61EPWJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if we're on the token page
  const isTokenPage = window.location.hash === "#token";

  useEffect(() => {
    // If on token page, ensure we have a token
    if (isTokenPage && !sessionStorage.getItem("firebaseIdToken")) {
      // Redirect to login if no token
      window.location.hash = "";
    }
  }, [isTokenPage]);

  const login = async () => {
    setError("");
    setLoading(true);
    
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await userCredential.user.getIdToken();
      
      // Store token in sessionStorage
      sessionStorage.setItem("firebaseIdToken", idToken);
      
      // Open token page in new tab
      const currentUrl = window.location.origin + window.location.pathname;
      window.open(currentUrl + "#token", "_blank");
      
      // Clear form
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  // Show token page if hash is #token
  if (isTokenPage) {
    return <TokenPage />;
  }

  // Show login form
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>EHR Assist Application</h1>
          <p>Sign in to your account</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className={error ? "error" : ""}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className={error ? "error" : ""}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            onClick={login} 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
