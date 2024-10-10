import axios from 'axios';
import { responseCache } from './cache';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
  console.error('OpenAI API key is not set. Please set the VITE_OPENAI_API_KEY environment variable.');
}

export async function* sendMessage(message: string, file: { url: string, type: string } | null, context?: string, role?: string): AsyncGenerator<string, void, unknown> {
  // ... (keep the existing sendMessage function)
}

export async function uploadFile(file: File): Promise<string> {
  // ... (keep the existing uploadFile function)
}

// Mock user data
let mockUsers = [
  { id: '1', username: 'Arash', isActive: true },
];

export async function fetchUsers(): Promise<any[]> {
  // In a real application, you would make an API call to fetch users
  // For now, we'll return the mock users
  return Promise.resolve(mockUsers);
}

export async function createUser(username: string, hashedPassword: string): Promise<any> {
  // In a real application, you would make an API call to create a user
  // For now, we'll add the user to our mock data
  const newUser = {
    id: (mockUsers.length + 1).toString(),
    username,
    isActive: true
  };
  mockUsers.push(newUser);
  console.log(`Creating user: ${username} with hashed password: ${hashedPassword}`);
  return Promise.resolve(newUser);
}

export async function toggleUserStatus(userId: string): Promise<void> {
  // In a real application, you would make an API call to toggle user status
  mockUsers = mockUsers.map(user => 
    user.id === userId ? { ...user, isActive: !user.isActive } : user
  );
  console.log(`Toggling status for user: ${userId}`);
  return Promise.resolve();
}

export async function resetUserPassword(userId: string, hashedPassword: string): Promise<void> {
  // In a real application, you would make an API call to reset the user's password
  console.log(`Resetting password for user: ${userId} with new hashed password: ${hashedPassword}`);
  return Promise.resolve();
}