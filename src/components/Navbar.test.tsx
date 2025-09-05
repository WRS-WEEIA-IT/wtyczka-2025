import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Navbar from './Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock the required hooks
jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: null,
    authLogout: jest.fn(),
  }),
}));

jest.mock('@/contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }) => children,
  useLanguage: () => ({
    language: 'pl',
    setLanguage: jest.fn(),
    t: {
      nav: {
        home: 'Strona główna',
        news: 'Aktualności',
        partners: 'Partnerzy',
        participantInfo: 'Informacje',
        regulations: 'Regulamin',
        essentials: 'Niezbędnik',
        faq: 'FAQ',
        contacts: 'Kontakty',
        status: 'Status',
        login: 'Zaloguj',
        register: 'Rejestracja',
        logout: 'Wyloguj'
      }
    }
  }),
}));

// Mock window.location
const mockNavigate = jest.fn();
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});

// Mock Audio API and Window resizing
window.HTMLMediaElement.prototype.play = jest.fn();
window.AudioContext = jest.fn(() => ({
  resume: jest.fn().mockResolvedValue(undefined),
  createOscillator: jest.fn(() => ({
    type: '',
    frequency: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  })),
  createGain: jest.fn(() => ({
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
    connect: jest.fn(),
  })),
  currentTime: 0,
  destination: {},
}));

describe('Navbar Component', () => {
  // Mock window resize
  const resizeWindow = (width) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
  };
  
  beforeEach(() => {
    jest.useFakeTimers();
    // Initialize as desktop view
    window.innerWidth = 1024;
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  
  test('renders desktop navbar on large screens', () => {
    render(<Navbar />);
    expect(screen.getByText('Strona główna')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
  });
  
  test('renders mobile navbar with hamburger on small screens', () => {
    // Set to mobile view
    window.innerWidth = 640;
    
    render(<Navbar />);
    act(() => {
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // Hamburger menu should be present
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });
  
  test('mobile menu toggles when hamburger is clicked', () => {
    // Set to mobile view
    window.innerWidth = 640;
    
    render(<Navbar />);
    act(() => {
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // Hamburger menu should be present
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Mobile menu should now be visible
    expect(screen.getByText('Strona główna')).toBeInTheDocument();
    
    // Close menu
    fireEvent.click(menuButton);
    // Menu should be hidden
    expect(screen.queryByText('Strona główna')).not.toBeInTheDocument();
  });
  
  test('mobile menu disappears when screen size increases', () => {
    // Start with mobile view and open menu
    window.innerWidth = 640;
    
    render(<Navbar />);
    act(() => {
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Menu should be visible
    expect(screen.getByText('Strona główna')).toBeInTheDocument();
    
    // Resize to desktop
    act(() => {
      resizeWindow(1024);
    });
    
    // Hamburger should not be visible anymore
    expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
  });
  
  test('navigation uses animation and delay before redirect', () => {
    render(<Navbar />);
    
    // Click home link
    const homeLink = screen.getByText('Strona główna');
    fireEvent.click(homeLink);
    
    // Check that href wasn't set immediately
    expect(window.location.href).toBe('');
    
    // Fast-forward timer
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Now href should be set
    expect(window.location.href).toBe('/');
  });
});
