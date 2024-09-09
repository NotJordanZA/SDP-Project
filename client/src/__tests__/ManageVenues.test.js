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
    expect(screen.getByText('WSS03')).toBeInTheDocument();
    expect(screen.getByText('RSEH')).toBeInTheDocument();
    expect(screen.getByText('CLM103')).toBeInTheDocument();
    expect(screen.getByText('FNB35')).toBeInTheDocument();
  });

  test('filters venues based on search term', () => {
    render(<ManageVenues />);
    const searchInput = screen.getByPlaceholderText('Search venues...');
    fireEvent.change(searchInput, { target: { value: 'FNB' } });
    expect(screen.queryByText('WSS001')).not.toBeInTheDocument();
    expect(screen.queryByText('Great Hall')).not.toBeInTheDocument();
    expect(screen.queryByText('CLM102')).not.toBeInTheDocument();
    expect(screen.getByText('FNB35')).toBeInTheDocument();
  });
});

test('adds a new venue', () => {
  render(<ManageVenues />);
  fireEvent.click(screen.getByText('Add Venue'));
  fireEvent.change(screen.getByPlaceholderText('Building Name'), { target: { value: 'New Building' } });
  fireEvent.change(screen.getByPlaceholderText('Venue Name'), { target: { value: 'New Venue' } });
  fireEvent.change(screen.getByPlaceholderText('Capacity'), { target: { value: '100' } });
  fireEvent.change(screen.getByPlaceholderText('Venue Type'), { target: { value: 'Lecture Venue' } });
  fireEvent.click(screen.getByText('Save'));
  expect(screen.getByText('New Venue')).toBeInTheDocument();
});

test('edits an existing venue', () => {
  render(<ManageVenues />);
  fireEvent.click(screen.getByText('Edit', { selector: 'button' }));
  fireEvent.change(screen.getByPlaceholderText('Venue Name'), { target: { value: 'Updated Venue' } });
  fireEvent.click(screen.getByText('Save'));
  expect(screen.getByText('Updated Venue')).toBeInTheDocument();
});

test('deletes a venue', () => {
  render(<ManageVenues />);
  fireEvent.click(screen.getByText('Delete', { selector: 'button' }));
  expect(screen.queryByText('WSS001')).not.toBeInTheDocument();
});

test('toggles venue status', () => {
  render(<ManageVenues />);
  fireEvent.click(screen.getByText('Close Venue', { selector: 'button' }));
  expect(screen.getByText('Open Venue')).toBeInTheDocument();
});