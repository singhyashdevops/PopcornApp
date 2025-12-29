import React from 'react';
import { render } from '@testing-library/react-native';
import Loading from '../src/components/Loading';

describe('Loading Component', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<Loading />);
        expect(toJSON()).not.toBeNull();
    });

    it('contains an ActivityIndicator', () => {
        const { UNSAFE_getByType } = render(<Loading />);

        const ActivityIndicator = require('react-native').ActivityIndicator;
        const indicator = UNSAFE_getByType(ActivityIndicator);

        expect(indicator).toBeTruthy();
    });
});