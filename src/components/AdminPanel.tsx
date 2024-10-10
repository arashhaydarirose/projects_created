import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createUser, toggleUserStatus, resetUserPassword, fetchUsers } from '../utils/api';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  username: string;
  isActive: boolean;
}

const AdminPanel: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const newUser = await createUser(newUsername, hashedPassword);
      setUsers(prevUsers => [...prevUsers, newUser]);
      setNewUsername('');
      setNewPassword('');
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      ));
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const newPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      await resetUserPassword(userId, hashedPassword);
      alert(`Password reset successful. The new password is: ${newPassword}`);
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  if (currentUser?.username !== 'Arash') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Current User</h3>
        <p>Username: {currentUser.username}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Create User</h3>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Enter username"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter password"
          className="mr-2 p-2 border rounded"
        />
        <button
          onClick={handleCreateUser}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create User
        </button>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">User Management</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Username</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    onClick={() => handleToggleUserStatus(user.id)}
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleResetPassword(user.id)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;