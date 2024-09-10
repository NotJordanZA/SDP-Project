import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManageReports from '../pages/ManageReports';

describe('ManageReports Component', () => {
  test('renders ManageReports component', () => {
    render(<ManageReports />);
    expect(screen.getByText('Manage Reports')).toBeInTheDocument();
  });

  test('displays reports message', () => {
    render(<ManageReports />);
    expect(screen.getByText('Here are your reports...')).toBeInTheDocument();
  });
});