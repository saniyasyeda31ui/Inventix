import React from 'react';
import { renderToString } from 'react-dom/server';
import DashboardPage from './src/pages/DashboardPage';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext';

// Mock import.meta.env for Node.js
(global as any).import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: "https://test.supabase.co",
      VITE_SUPABASE_ANON_KEY: "test-key"
    }
  }
};

try {
  const html = renderToString(
    React.createElement(MemoryRouter, null, 
      React.createElement(AuthProvider, null, 
        React.createElement(DashboardPage, null)
      )
    )
  );
  console.log("Render successful! Length:", html.length);
} catch (error) {
  console.error("Render failed with exact error:");
  console.error(error);
}
