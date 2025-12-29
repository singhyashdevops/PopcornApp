import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface MovieCardProps {
    title: string;
    poster_path: string;
    vote_average?: number;
    onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.29;

export default function MovieCard({ poster_path, vote_average, onPress }: MovieCardProps) {
    const matchPercentage = vote_average ? Math.round(vote_average * 10) : 0;

    return (
        <TouchableOpacity 
            activeOpacity={0.9} 
            style={styles.card} 
            onPress={onPress}
            testID='movie-card'
        >
            <View style={styles.imageContainer}>
                <Image 
                    source={{ 
                        uri: poster_path 
                            ? (poster_path.startsWith('http') ? poster_path : `https://image.tmdb.org/t/p/w342${poster_path}`)
                            : 'https://via.placeholder.com/342x513?text=No+Poster' 
                    }} 
                    style={styles.image} 
                    resizeMode="cover" 
                    testID='movie-poster'
                />
                {matchPercentage && (
                    <View style={styles.matchBadge}>
                        <Text style={styles.matchText}>{matchPercentage/10}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        marginRight: 8,
        marginVertical: 4,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 2 / 3,
        borderRadius: 4,
        backgroundColor: '#1a1a1a',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    matchBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgb(0,0,0,0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomRightRadius: 12,
    },
    matchText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: -0.2,
    },
});