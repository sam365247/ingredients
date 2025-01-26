import React, { useEffect, useRef } from 'react';
import { WebsocketProvider } from 'y-websocket';

export const useYjsConnection = () => {
  const providerRef = useRef(null);
  const ydocRef = useRef(null);

  useEffect(() => {
    // Use relative WebSocket URL that works in both dev and prod
    const wsUrl = window.location.origin.replace(/^http/, 'ws');
    
    providerRef.current = new WebsocketProvider(
      wsUrl,
      'ingredients-list',
      ydocRef.current
    );
    // ... rest of the code
  }, []);
}; 