"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { DashboardContext } from "../contexts/DashboardContext";
import { 
  Search, 
  Plus, 
  Mic, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

/**
 * HEADER COMPONENT - Updated 2025-08-26
 * 
 * KEY CHANGES MADE:
 * 1. Search functionality now shows when user is logged in (any page)
 * 2. New Note button now shows when user is logged in (any page)
 * 3. Smart navigation: 
 *    - On dashboard pages: directly opens modal/updates search
 *    - On other pages: navigates to dashboard with URL parameters
 * 4. Uses optional dashboard context access to prevent errors
 * 
 * FIXES APPLIED:
 * - Removed dashboardContext dependency for search bar visibility
 * - Removed dashboardContext dependency for New Note button visibility
 * - Added router.push with URL parameters for cross-page functionality
 * - Made all context access safe with optional chaining
 */

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Safely access dashboard context - may not be available on all pages
  const dashboardContext = useContext(DashboardContext);
  const searchQuery = dashboardContext?.searchQuery || '';
  const setSearchQuery = dashboardContext?.setSearchQuery || (() => {});
  const setShowCreateModal = dashboardContext?.setShowCreateModal || (() => {});
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (dashboardContext) {
      // If we're on a dashboard page, update the search query
      setSearchQuery(query);
    } else {
      // If not on dashboard, navigate to dashboard with search query
      if (query.trim()) {
        router.push(`/dashboard?search=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleCreateNote = () => {
    if (dashboardContext) {
      // If we're on a dashboard page, show the modal
      setShowCreateModal(true);
    } else {
      // If not on dashboard, navigate to dashboard with create parameter
      router.push('/dashboard?create=true');
    }
  };

  // Only show search and new note functionality when dashboard context is available
  // const isDashboardPage = !!dashboardContext; // Removed unused variable

  return (
    <header className="bg-white border-b shadow-sm" style={{ borderColor: '#acaca9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Mic className="w-8 h-8" style={{ color: '#fa6147' }} />
              <span className="text-xl font-bold" style={{ color: '#333328' }}>
                VoxNote AI
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          {session && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5" style={{ color: '#acaca9' }} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search notes, transcripts, tags..."
                  className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: '#acaca9',
                    color: '#333328'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fa6147';
                    e.target.style.boxShadow = '0 0 0 2px rgba(250, 97, 71, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#acaca9';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                {/* New Note Button - Show when user is logged in */}
                <button
                  onClick={handleCreateNote}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:transform hover:scale-105"
                style={{ 
                  backgroundColor: '#fa6147',
                  color: '#e5e5df'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e55541';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fa6147';
                }}
              >
                <Plus className="w-4 h-4" />
                <span>New Note</span>
              </button>

                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100"
                  style={{ color: '#545268' }}
                >
                  Dashboard
                </Link>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50">
                    <User className="w-4 h-4" style={{ color: '#545268' }} />
                    <span className="text-sm font-medium" style={{ color: '#333328' }}>
                      {session.user?.name || session.user?.email?.split('@')[0]}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg border font-medium transition-colors hover:bg-gray-50"
                    style={{ 
                      borderColor: '#acaca9',
                      color: '#545268'
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                className="px-6 py-2 rounded-lg font-medium transition-all hover:transform hover:scale-105"
                style={{ 
                  backgroundColor: '#fa6147',
                  color: '#e5e5df'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e55541';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fa6147';
                }}
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              style={{ color: '#545268' }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && session && (
          <div className="md:hidden border-t" style={{ borderColor: '#acaca9' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search - Only show when dashboard context is available */}
              {dashboardContext && (
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" style={{ color: '#acaca9' }} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search notes..."
                    className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: '#acaca9',
                      color: '#333328'
                    }}
                  />
                </div>
              )}

              {/* Mobile New Note Button - Show when user is logged in */}
              <button
                onClick={handleCreateNote}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium"
              style={{ 
                backgroundColor: '#fa6147',
                color: '#e5e5df'
              }}
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>

              {/* Mobile Navigation Links */}
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-lg font-medium"
                style={{ color: '#545268' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              {/* Mobile User Info & Sign Out */}
              <div className="pt-2 border-t" style={{ borderColor: '#acaca9' }}>
                <div className="flex items-center space-x-2 px-3 py-2">
                  <User className="w-4 h-4" style={{ color: '#545268' }} />
                  <span className="text-sm font-medium" style={{ color: '#333328' }}>
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-left"
                  style={{ color: '#545268' }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu for Non-authenticated Users */}
        {isMobileMenuOpen && !session && (
          <div className="md:hidden border-t" style={{ borderColor: '#acaca9' }}>
            <div className="px-2 pt-2 pb-3">
              <Link
                href="/auth/sign-in"
                className="block w-full text-center px-6 py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: '#fa6147',
                  color: '#e5e5df'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}