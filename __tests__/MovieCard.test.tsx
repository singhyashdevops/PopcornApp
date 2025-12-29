import React from 'react';
import { render, fireEvent} from '@testing-library/react-native';
import MovieCard from '../src/components/MovieCard';

describe('MovieCard Logic', () => {
  const mockOnPress = jest.fn();
  const defaultProps = {
    title: 'Inception',
    poster_path: '/inception.jpg',
    vote_average: 8.8,
    onPress: mockOnPress,
  };

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('calls onPress when the card is tapped', () => {
    const { getByTestId } = render(<MovieCard {...defaultProps} />);
    const card = getByTestId('movie-card'); 
    fireEvent.press(card);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('constructs the correct TMDB image URL', () => {
    const { getByTestId } = render(<MovieCard {...defaultProps} />);
    const image = getByTestId('movie-poster');
    
    expect(image.props.source.uri).toBe('https://image.tmdb.org/t/p/w342/inception.jpg');
  });

  it('uses the placeholder image if poster_path is missing', () => {
    const { getByTestId } = render(
      <MovieCard {...defaultProps} poster_path="" />
    );
    
    const image = getByTestId('movie-poster');
    expect(image.props.source.uri).toContain('placeholder.com');
  });

  it('calculates and displays the correct match badge value', () => {
    const { getByText } = render(<MovieCard {...defaultProps} />);

    expect(getByText('8.8')).toBeTruthy();
  });
});