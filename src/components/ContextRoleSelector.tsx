import React, { useState, useEffect } from 'react';

interface ContextRoleSelectorProps {
  context: string;
  setContext: (context: string) => void;
  role: string;
  setRole: (role: string) => void;
  userId: string;
}

const ContextRoleSelector: React.FC<ContextRoleSelectorProps> = ({
  context,
  setContext,
  role,
  setRole,
  userId,
}) => {
  const [customRole, setCustomRole] = useState('');
  const [savedRoles, setSavedRoles] = useState<string[]>([]);
  const [savedContexts, setSavedContexts] = useState<string[]>([]);

  useEffect(() => {
    const roles = localStorage.getItem(`savedRoles_${userId}`);
    const contexts = localStorage.getItem(`savedContexts_${userId}`);
    if (roles) setSavedRoles(JSON.parse(roles));
    if (contexts) setSavedContexts(JSON.parse(contexts));
  }, [userId]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    if (selectedRole !== 'custom') {
      setCustomRole('');
    }
  };

  const handleCustomRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomRole(e.target.value);
    setRole(e.target.value);
  };

  const handleSaveCustomRole = () => {
    if (customRole && !savedRoles.includes(customRole)) {
      const updatedRoles = [...savedRoles, customRole];
      setSavedRoles(updatedRoles);
      localStorage.setItem(`savedRoles_${userId}`, JSON.stringify(updatedRoles));
    }
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedContext = e.target.value;
    setContext(selectedContext);
  };

  const handleSaveContext = () => {
    if (context && !savedContexts.includes(context)) {
      const updatedContexts = [...savedContexts, context];
      setSavedContexts(updatedContexts);
      localStorage.setItem(`savedContexts_${userId}`, JSON.stringify(updatedContexts));
    }
  };

  return (
    <div className="mb-4 space-y-4">
      <div>
        <label htmlFor="context" className="block text-sm font-medium text-gray-700">
          Context
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <select
            id="context"
            value={context}
            onChange={handleContextChange}
            className="flex-1 rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select a context</option>
            {savedContexts.map((savedContext) => (
              <option key={savedContext} value={savedContext}>{savedContext}</option>
            ))}
          </select>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="flex-1 rounded-r-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Set conversation context"
          />
        </div>
        <button
          onClick={handleSaveContext}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Context
        </button>
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={handleRoleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a role</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
          {savedRoles.map((savedRole) => (
            <option key={savedRole} value={savedRole}>{savedRole}</option>
          ))}
          <option value="custom">Custom</option>
        </select>
        {role === 'custom' && (
          <div className="mt-2">
            <input
              type="text"
              value={customRole}
              onChange={handleCustomRoleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter custom role"
            />
            <button
              onClick={handleSaveCustomRole}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Custom Role
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextRoleSelector;