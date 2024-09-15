import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManageBookings from '../pages/ManageBookings';
import { BrowserRouter as Router } from 'react-router-dom';

describe('ManageBookings Component', () => {
  test.skip('renders ManageBookings component', () => {
    render(
      <Router>
        <ManageBookings />
      </Router>
    );
    expect(screen.getByText('Manage (Cancel/Edit) a booking')).toBeInTheDocument();
  });

  test.skip('handles tab click', () => {
    render(
      <Router>
        <ManageBookings />
      </Router>
    );
    const manageTabButton = screen.getByText('Manage (Cancel/Edit) a booking');
    fireEvent.click(manageTabButton);
    expect(manageTabButton).toHaveClass('active');
  });

  test.skip('displays bookings', () => {
    render(
      <Router>
        <ManageBookings />
      </Router>
    );
    expect(screen.getByText('Bob Jhonson')).toBeInTheDocument();
    expect(screen.getByText('Jhon Jhonson')).toBeInTheDocument();
    expect(screen.getByText('James Jhonsonn')).toBeInTheDocument();
    expect(screen.getByText('Fred Jhonson')).toBeInTheDocument();
    expect(screen.getByText('Emily Jhonson')).toBeInTheDocument();
    expect(screen.getByText('Pam Jhonson')).toBeInTheDocument();
  });
});