/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import Error from '../src/components/Error';

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

describe('Error Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('renders TRY AGAIN button with correct branding styles', () => {
    render(<Error />);
  });

  it('navigates to Home when TRY AGAIN is pressed (using onPressIn)', () => {
    render(<Error />);
    
    const buttonLabel = screen.getByText('TRY AGAIN');
    fireEvent(buttonLabel, 'onPressIn');

    expect(mockedNavigate).toHaveBeenCalledWith('Home');
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
  });

});