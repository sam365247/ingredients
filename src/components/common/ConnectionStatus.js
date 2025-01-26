import { useCollaboration } from '../../context/CollaborationContext';

export const ConnectionStatus = () => {
  const { isConnected } = useCollaboration();

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
    </div>
  );
}; 