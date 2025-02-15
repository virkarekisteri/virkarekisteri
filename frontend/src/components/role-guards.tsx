import { useAppSelector } from 'redux/hooks';
import { selectIsAdmin, selectIsEditor } from 'redux/slices/auth-slice';
import type { PropsWithChildren } from 'react';
import type React from 'react';

export const RequiresEditRole: React.FC<PropsWithChildren> = ({ children }) => {
  const skipAuth = import.meta.env.VITE_SKIP_AUTH === 'true' && import.meta.env.DEV;
  const isEditor = useAppSelector(selectIsEditor);

  if (skipAuth || isEditor) {
    return <>{children}</>;
  }

  return null;
};

export const RequiresAdminRole: React.FC<PropsWithChildren> = ({ children }) => {
  const skipAuth = import.meta.env.VITE_SKIP_AUTH === 'true' && import.meta.env.DEV;
  const isAdmin = useAppSelector(selectIsAdmin);

  if (skipAuth || isAdmin) {
    return <>{children}</>;
  }

  return null;
};
