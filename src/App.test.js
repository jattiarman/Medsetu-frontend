import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main header with the Code Translator link', () => {
  render(<App />);
  
  // Look for the "Code Translator" link in the document
  const linkElement = screen.getByText(/Code Translator/i);
  
  // Assert that this link is actually present
  expect(linkElement).toBeInTheDocument();
});