import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AppFunctional from './AppFunctional';
import axios from 'axios'



test('1. renders without errors', () => {
  render(<AppFunctional />);
});

test('renders email input with "type email" placeholder', () => {
  const { getByPlaceholderText } = render(<AppFunctional />);
  const emailInput = getByPlaceholderText('type email');

  expect(emailInput).toBeInTheDocument();
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


test('moves "B" character to the left', () => {
  const { getByText, getByTextContent } = render(<AppFunctional />);
  const moveLeftButton = getByText('LEFT');
  
  fireEvent.click(moveLeftButton);

  expect(getByTextContent('Coordinates (3, 2)')).toBeInTheDocument();
  expect(getByTextContent('You moved 1 time')).toBeInTheDocument();
});


test('resets state to initial values', () => {
  const { getByText, getByTextContent } = render(<AppFunctional />);
  const moveLeftButton = getByText('LEFT');
  fireEvent.click(moveLeftButton);

  const resetButton = getByText('reset');
  fireEvent.click(resetButton);

  expect(getByTextContent('Coordinates (2, 2)')).toBeInTheDocument();
  expect(getByTextContent('You moved 0 times')).toBeInTheDocument();
});


test('displays error message for invalid email', () => {
  const { getByLabelText, getByText, getByTextContent } = render(<AppFunctional />);
  const emailInput = getByLabelText('Email:');
  
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

  const submitButton = getByText('submit');
  fireEvent.click(submitButton);

  expect(getByTextContent('Ouch: email must be a valid email.')).toBeInTheDocument();
});


jest.mock('axios');

test('submits form and handles response', async () => {
  const { getByLabelText, getByText, getByTextContent } = render(<AppFunctional />);
  const emailInput = getByLabelText('Email:');
  
  fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });

  const submitButton = getByText('submit');
  fireEvent.click(submitButton);

  // Mocking Axios response
  axios.post.mockResolvedValueOnce({ data: { message: 'Success' } });

  // Wait for the asynchronous operation to complete
  await waitFor(() => expect(axios.post).toHaveBeenCalled());

  expect(getByTextContent('Success')).toBeInTheDocument();
});