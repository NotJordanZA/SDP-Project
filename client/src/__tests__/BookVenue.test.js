import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BookVenue from '../pages/BookVenue';

describe('BookVenue Component', () => {
  test.skip('renders BookVenue component', () => {
    render(<BookVenue />);
    expect(screen.getByText('Book Venue')).toBeInTheDocument();
  });

  test.skip('handles time click', () => {
    render(<BookVenue />);
    const timeButton = screen.getByText('Select Time');
    fireEvent.click(timeButton);
    expect(screen.getByText('Booking confirmed for:')).toBeInTheDocument();
  });

  test.skip('handles form submission', () => {
    render(<BookVenue />);
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    expect(console.log).toHaveBeenCalledWith('Booking confirmed for:', expect.anything(), '', '');
  });
});