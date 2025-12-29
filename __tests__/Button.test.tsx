import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Button from '../src/components/Button';

describe('Button Component', () => {
  
  it('renders the title correctly', () => {
    render(<Button title="Perfect Style" onPress={() => {}} />);

    expect(screen.getByText('Perfect Style')).toBeTruthy();
  });

  it('handles the press event', () => {
    const mockOnPress = jest.fn();
    render(<Button title="Press Me" onPress={mockOnPress} />);
    
    const button = screen.getByTestId('button');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

});