import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManageVenues from '../pages/ManageVenues';

describe('ManageVenues Component', () => {
  test('renders ManageVenues component', () => {
    render(<ManageVenues />);
    expect(screen.getByText('List of Venues')).toBeInTheDocument();
  });

  test('displays all venues initially', () => {
    render(<ManageVenues />);
    expect(screen.getByText('WSS001')).toBeInTheDocument();
    expect(screen.getByText('Great Hall')).toBeInTheDocument();
    expect(screen.getByText('CLM102')).toBeInTheDocument();
    expect(screen.getByText('FNB37')).toBeInTheDocument();
    expect(screen.getByText('FNB110')).toBeInTheDocument();
  });

  test('filters venues based on search term', () => {
    render(<ManageVenues />);
    const searchInput = screen.getByPlaceholderText('Search venues...');
    fireEvent.change(searchInput, { target: { value: 'FNB' } });
    expect(screen.queryByText('WSS001')).not.toBeInTheDocument();
    expect(screen.queryByText('Great Hall')).not.toBeInTheDocument();
    expect(screen.queryByText('CLM102')).not.toBeInTheDocument();
    expect(screen.getByText('FNB37')).toBeInTheDocument();
    expect(screen.getByText('FNB110')).toBeInTheDocument();
  });
});