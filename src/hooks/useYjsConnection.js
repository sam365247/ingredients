import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export const useYjsConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const doc = useRef(null);
  const wsProvider = useRef(null);
  const ingredientsArrayRef = useRef(null);
  const recipeArrayRef = useRef(null);

  useEffect(() => {
    doc.current = new Y.Doc();
    
    // Use relative path for WebSocket in production
    const WS_URL = process.env.NODE_ENV === 'production'
      ? `wss://${window.location.host}`
      : 'ws://localhost:1234';
    
    wsProvider.current = new WebsocketProvider(WS_URL, 'recipe-app', doc.current);
    ingredientsArrayRef.current = doc.current.getArray('ingredients');
    recipeArrayRef.current = doc.current.getArray('recipeSteps');

    wsProvider.current.on('status', ({ status }) => {
      setIsConnected(status === 'connected');
    });

    return () => {
      if (wsProvider.current) {
        wsProvider.current.destroy();
      }
      if (doc.current) {
        doc.current.destroy();
      }
    };
  }, []);

  return {
    isConnected,
    ingredientsArrayRef,
    recipeArrayRef
  };
}; 