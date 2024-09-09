import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import ManageRequests from '../pages/ManageRequests';

describe('ManageRequests Component', () => {
  test('renders ManageRequests component', () => {
    render(
      <Router>
        <ManageRequests />
      </Router>
    );
    expect(screen.getByText('richard.klein@wits.ac.za')).toBeInTheDocument();
    expect(screen.getByText('I would like to make a recurring booking for NCB103 for every Tuesday for my COMS2013A lecture.')).toBeInTheDocument();
  });

  test('handles edit button click', () => {
    const { container } = render(
      <Router>
        <ManageRequests />
      </Router>
    );
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    expect(container.innerHTML).toContain('book-venue');
  });

  test('handles delete button click', () => {
    render(
      <Router>
        <ManageRequests />
      </Router>
    );
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    // Add your assertion here based on what should happen when delete is clicked
    // For example, you might check if the request card is removed from the DOM
  });
});