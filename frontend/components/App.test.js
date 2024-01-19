import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AppFunctional from './AppFunctional';




test('1. renders without errors', () => {
  render(<AppFunctional />);
});

test('2. clicking the reset button resets the state', () => {
  const { getByText } = render(<AppFunctional />);
  const resetButton = getByText('reset');
  fireEvent.click(resetButton);
});

