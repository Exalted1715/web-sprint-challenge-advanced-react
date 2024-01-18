import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AppFunctional from './AppFunctional';
import {getXY} from './AppFunctional'

test('1. renders without errors', () => {
  render(<AppFunctional />);
});

test('2. clicking the submit button triggers the onSubmit function', () => {
  const { getByText } = render(<AppFunctional />);
  const submitButton = getByText('Submit');
  fireEvent.click(submitButton);
});

test('3. renders functional component with specific text', () => {
  render(<AppFunctional />);
  const expectedText = 'Functional';
  const elementWithText = screen.getByText(expectedText);
  expect(elementWithText).toBeVisible();
});

test('4. getXY function returns correct coordinates', () => {
  const index = 4; 
  const { row, col } = getXY(index);

  expect(row).toBe(2);
  expect(col).toBe(2);
});

test('5. renders with visible up arrow button', () => {
  render(<AppFunctional />)
   const upArrowButton = screen.getByTestId("up")

  expect(upArrowButton).toBeVisible()
});