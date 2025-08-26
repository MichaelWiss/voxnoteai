"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * DASHBOARD CONTEXT - Updated 2025-08-26
 * 
 * KEY CHANGES MADE:
 * 1. Exported DashboardContext directly for Header component access
 * 2. Maintains search query state across dashboard pages
 * 3. Manages create modal visibility state
 * 
 * FIXES APPLIED:
 * - Added export to DashboardContext constant (was private)
 * - This allows Header to safely access context with useContext
 * - Prevents "must be used within provider" errors on non-dashboard pages
 */

interface DashboardContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const value: DashboardContextType = {
    searchQuery,
    setSearchQuery,
    showCreateModal,
    setShowCreateModal,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}