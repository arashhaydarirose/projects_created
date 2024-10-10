import React, { useState, useEffect } from 'react';
import ContextRoleSelector from '../ContextRoleSelector';
import MessageArea from './MessageArea';
import ErrorDisplay from './ErrorDisplay';
import { User } from '../../types/auth';

interface MainContentProps {
  user: User | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const MainContent: React.FC<MainContentProps> = ({ user, error, setError }) => {
  const [context, setContext] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (user) {
      const savedContext = localStorage.getItem(`lastContext_${user.id}`);
      const savedRole = localStorage.getItem(`lastRole_${user.id}`);
      if (savedContext) setContext(savedContext);
      if (savedRole) setRole(savedRole);
    }
  }, [user]);

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
      <ContextRoleSelector
        context={context}
        setContext={setContext}
        role={role}
        setRole={setRole}
        userId={user?.id || ''}
      />
      <ErrorDisplay error={error} />
      <MessageArea
        context={context}
        role={role}
        user={user}
        setError={setError}
      />
    </main>
  );
};

export default MainContent;