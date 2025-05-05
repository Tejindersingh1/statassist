'use client';

import { useEffect } from 'react';

export default function A11yDevCheck() {
  // Only run in dev build on the client
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // Dynamically import so it never leaks into prod bundles
      import('@axe-core/react').then(({ default: axe }) => {
        // React & ReactDOM are already global in a Next.js app
        const React = require('react');
        const ReactDOM = require('react-dom');
        axe(React, ReactDOM, 1000);
      });
    }
  }, []);

  return null; // renders nothing
}

