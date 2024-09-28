// This file serves as a central hub for re-exporting pre-typed Redux hooks.

// The below hook-imports are restricted elsewhere to ensure consistent
// usage of typed hooks throughout the application.
/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
