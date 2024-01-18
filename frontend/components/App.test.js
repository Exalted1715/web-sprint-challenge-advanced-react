import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AppFunctional from './AppFunctional';


test('1. renders without errors', () => {
  render(<AppFunctional />);
});

test('placeholder "type email" is visible on the screen', () => {
  render(<AppFunctional />);

  // Use getByPlaceholderText to find the input field by its placeholder
  const emailInput = screen.getByPlaceholderText('type email');

  // Assert that the email input field with the specified placeholder is visible
  expect(emailInput).toBeVisible();
});


test('clicking the reset button resets the state', () => {
  const { getByText } = render(<AppFunctional />);
  const resetButton = getByText('reset');

  fireEvent.click(resetButton);

  
});


test('typing in the email input updates the email state', () => {
  const { getByLabelText } = render(<AppFunctional />);
  const emailInput = getByLabelText('type email');

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

  
});

test('"Welcome to the GRID" is visible on the screen', () => {
  render(<AppFunctional />);

  // Use getByText to find the element containing the specified text
  const welcomeText = screen.getByText('Welcome to the GRID');

  // Assert that the element with the specified text is visible
  expect(welcomeText).toBeVisible();
});