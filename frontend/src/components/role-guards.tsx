import { useAppSelector } from 'redux/hooks';
import { selectIsAdmin, selectIsEditor } from 'redux/slices/auth-slice';
import type { PropsWithChildren } from 'react';
import type React from 'react';

export const RequiresEditRole: React.FC<PropsWithChildren> = ({ children }) => {
  if (import.meta.env.VITE_SKIP_AUTH === 'true' && import.meta.env.DEV) {
    return <>{children}</>;
  }
  const isEditor = useAppSelector(selectIsEditor);
  return isEditor ? <>{children}</> : null;
};

export const RequiresAdminRole: React.FC<PropsWithChildren> = ({ children }) => {
  if (import.meta.env.VITE_SKIP_AUTH === 'true' && import.meta.env.DEV) {
    return <>{children}</>;
  }
  const isAdmin = useAppSelector(selectIsAdmin);
  return isAdmin ? <>{children}</> : null;
};
