// src/components/HelloWorld.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import HelloWorld from '../src/components/HelloWorld';
import '@testing-library/jest-dom';


test('renders HelloWorld component', () => {
  render(<HelloWorld />);
  const headingElement = screen.getByText(/Hello, World!/i);
  expect(headingElement).toBeInTheDocument();
});
