import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  ViewStyle 
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false, 
  variant = 'primary',
  style 
}) => {
  return (
    <TouchableOpacity
      testID="button"
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style, 
      ]}
    >
      {loading ? (
        <ActivityIndicator 
          testID="loading-indicator" 
          color={variant === 'primary' ? '#FFFFFF' : '#E50914'} 
        />
      ) : (
        <Text 
          testID="button-text" 
          style={[
            styles.text,
            variant === 'primary' ? styles.primaryText : styles.secondaryText
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // Layout & Spacing
    height: 50,
    paddingHorizontal: 20,
    marginVertical: 10,
    
    // Alignment
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    
    // Border Styling
    borderRadius: 12,
  },
  primary: {
    backgroundColor: '#E50914', // Brand Red
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E50914',
  },
  disabled: {
    backgroundColor: '#2B2B2B',
    borderColor: '#2B2B2B',
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#E50914',
  },
});

export default Button;