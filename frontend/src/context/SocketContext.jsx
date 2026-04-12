import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000', {
      auth: {
        token: localStorage.getItem('token')
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('newOrder', (data) => {
      setNotifications(prev => [...prev, {
        type: 'order',
        message: `New order received: ₹${data.totalPrice}`,
        timestamp: data.timestamp
      }]);
    });

    newSocket.on('orderUpdate', (data) => {
      setNotifications(prev => [...prev, {
        type: 'order',
        message: `Order ${data.orderId.slice(-6)} status: ${data.status}`,
        timestamp: data.timestamp
      }]);
    });

    newSocket.on('stockAlert', (data) => {
      setNotifications(prev => [...prev, {
        type: 'stock',
        message: `Low stock alert: ${data.name} (${data.stock} left)`,
        timestamp: data.timestamp
      }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinAdmin = () => {
    if (socket) {
      socket.emit('joinAdmin');
    }
  };

  const joinOrderRoom = (orderId) => {
    if (socket) {
      socket.emit('joinRoom', orderId);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      notifications, 
      joinAdmin, 
      joinOrderRoom,
      clearNotifications 
    }}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);