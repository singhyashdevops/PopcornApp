/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, ScrollView, Text, FlatList, ImageBackground, TouchableOpacity, Dimensions, StatusBar, StyleSheet, Pressable } from 'react-native';
import {
    fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies, fetchHindiMovies,
    BACKDROP_BASE_URL, fetchEnglishMovies, fetchDisneyUniverse, fetchMarvelUniverse,
    fetchWBUniverse
} from '../api/tmdbService';
import { useQuery } from '@tanstack/react-query';
import MovieCard from './MovieCard';
import LinearGradient from 'react-native-linear-gradient';
import Loading from './Loading';

const { width } = Dimensions.get('window');

export default function MainScreen({ navigation }: any) {
    const { data: popular = [], isLoading: loadingPopular } = useQuery({ queryKey: ['popular'], queryFn: fetchPopularMovies, refetchOnReconnect: true, refetchOnWindowFocus: false, staleTime: 86400 });
    const { data: topRated = [], isLoading: loadingTopRated } = useQuery({ queryKey: ['topRated'], queryFn: fetchTopRatedMovies, refetchOnReconnect: true, refetchOnWindowFocus: false, staleTime: 86400 });
    const { data: upcoming = [], isLoading: loadingUpcoming } = useQuery({ queryKey: ['upcoming'], queryFn: fetchUpcomingMovies, refetchOnReconnect: true, refetchOnWindowFocus: false, staleTime: 86400 });
    const { data: hindi = [], isLoading: loadingHindi } = useQuery({ queryKey: ['hindi'], queryFn: fetchHindiMovies, refetchOnReconnect: true, refetchOnWindowFocus: false, staleTime: 86400 });
    const { data: english = [], isLoading: loadingEnglish } = useQuery({ queryKey: ['english'], queryFn: fetchEnglishMovies, refetchOnReconnect: true, refetchOnWindowFocus: false, staleTime: 86400 });
    const { data: marvel = [], isLoading: loadingMarvel } = useQuery({ queryKey: ['marvel'], queryFn: fetchMarvelUniverse, refetchOnReconnect: true, refetchOnWindowFocus: false, staleTime: 86400 });
    const { data: disney = [], isLoading: loadingDisney } = useQuery({ queryKey: ['disney'], queryFn: fetchDisneyUniverse, refetchOnReconnect: true, refetchOnWindowFocus: false, staleTime: 86400 });
    const { data: wb = [], isLoading: loadingWB } = useQuery({ queryKey: ['wb'], queryFn: fetchWBUniverse, refetchOnReconnect: true, refetchOnWindowFocus: false, staleTime: 86400 });

    const isLoading = [
        loadingPopular, loadingTopRated, loadingUpcoming,
        loadingHindi, loadingEnglish, loadingMarvel, loadingDisney, loadingWB
    ].some(Boolean);

    const random = upcoming.length > 0 ? Math.floor(Math.random() * upcoming.length) : 0;
    const featuredMovie = upcoming.length > 0 ? upcoming[random] : null;

    if (isLoading) {
        return (
            <Loading />
        );
    }

    function renderSection(title: string, data: any[]) {
        if (!data || data.length === 0) return null;
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <FlatList
                    data={data}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item.id}-${title}`}
                    contentContainerStyle={styles.listContent}

                    initialNumToRender={4}
                    maxToRenderPerBatch={6}
                    windowSize={5}
                    removeClippedSubviews={true}

                    decelerationRate="fast"
                    renderItem={({ item }) => (
                        <MovieCard
                            {...item}
                            onPress={() => navigation.navigate('Details', { movieId: item.id })}
                        />
                    )}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="rgb(0,0,0,0.8)" barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "black", height: 60, paddingHorizontal: 15, marginTop: 28 }}>
                    <Text style={{ color: "white", fontWeight: "900", fontSize: 30 }}>Popcorn</Text>
                    <Pressable onPressIn={() => navigation.navigate('Search')}>
                        <Text style={{ color: "white", fontWeight: "900", fontSize: 22 }}>
                            🔍
                        </Text>
                    </Pressable>
                </View>
                {featuredMovie && (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.navigate('Details', { movieId: featuredMovie.id })}
                    >
                        <ImageBackground
                            source={{ uri: `${BACKDROP_BASE_URL}${featuredMovie.backdrop_path}` }}
                            style={styles.heroBanner}
                        >
                            <LinearGradient colors={["transparent", "rgb(0,0,0,0.5)", "black"]} locations={[0, 0.4, 0.7, 1]} style={styles.heroOverlay}>
                                <View style={styles.heroOverlay}>
                                    <Text style={styles.heroTitle} numberOfLines={1}>
                                        {featuredMovie.title}
                                    </Text>
                                    <Text style={styles.heroDes} numberOfLines={3}>
                                        {featuredMovie.overview}
                                    </Text>
                                    <View style={styles.heroButtons}>
                                        <TouchableOpacity style={styles.playButton}>
                                            <Text style={styles.playButtonText}>PLAY</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.infoButton}
                                            onPress={() => navigation.navigate('Details', { movieId: featuredMovie.id })}
                                        >
                                            <Text style={styles.infoButtonText}>INFO</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </TouchableOpacity>
                )}
                <View style={styles.contentWrapper}>
                    {renderSection("Coming Soon", upcoming)}
                    {renderSection("Hindi Cinema", hindi)}
                    {renderSection("Hollywood Movies & Shows", english)}
                    {renderSection("Warner Bros. Collection", wb)}
                    {renderSection("Marvel Cinematic Universe", marvel)}
                    {renderSection("Trending Now", popular.slice(1))}
                    {renderSection("Disney Movies & Shows", disney)}
                    {renderSection("Top Rated Globally", topRated)}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    loadingText: {
        color: '#E50914',
        marginTop: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        fontSize: 9
    },
    heroBanner: {
        width: width,
        marginTop: 0,
        height: 680,
    },
    heroOverlay: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingBottom: 50,
        paddingHorizontal: 5,
    },
    featuredTag: {
        color: '#E50914',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 3,
        marginBottom: 5,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 44,
        fontWeight: '900',
        textAlign: 'left',
        marginBottom: 20,
        lineHeight: 46,
        letterSpacing: -1.5,
    },
    heroDes: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '300',
        textAlign: 'left',
        marginBottom: 20,
        lineHeight: 20,
        letterSpacing: 1,
    },
    heroButtons: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    playButton: {
        backgroundColor: '#FFFFFF',
        width: 130,
        height: 38,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '900'
    },
    infoButton: {
        backgroundColor: 'rgba(120, 120, 120, 0.6)',
        width: 130,
        height: 38,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '900'
    },
    contentWrapper: {
        marginTop: -100,
        backgroundColor: 'transparent',
    },
    section: {
        marginBottom: 18,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '900',
        color: '#fff',
        marginLeft: 8,
        marginBottom: 8,
        letterSpacing: -0.5
    },
    listContent: {
        paddingLeft: 8,
        paddingRight: 0,
    },
});