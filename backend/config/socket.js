import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        socket.user = decoded;
      } catch (err) {
        // Allow unauthenticated connections for public updates
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinAdmin', () => {
      socket.join('admin');
    });

    socket.on('joinRoom', (orderId) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const emitOrderUpdate = (order, oldStatus) => {
  if (io) {
    io.to('admin').emit('orderUpdate', {
      orderId: order._id,
      status: order.orderStatus,
      oldStatus,
      timestamp: new Date()
    });
    
    io.to(`order:${order._id}`).emit('orderStatusChange', {
      status: order.orderStatus,
      timestamp: new Date()
    });
  }
};

export const emitNewOrder = (order) => {
  if (io) {
    io.to('admin').emit('newOrder', {
      orderId: order._id,
      totalPrice: order.totalPrice,
      timestamp: new Date()
    });
  }
};

export const emitStockAlert = (product) => {
  if (io) {
    io.to('admin').emit('stockAlert', {
      productId: product._id,
      name: product.name,
      stock: product.stock,
      timestamp: new Date()
    });
  }
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export const joinUserRoom = (socket, userId) => {
  socket.join(`user:${userId}`);
};