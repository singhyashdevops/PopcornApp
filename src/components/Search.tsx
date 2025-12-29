import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, StatusBar, TouchableOpacity, Keyboard } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { searchAndFilterMovies } from '../api/tmdbService';
import MovieCard from './MovieCard';
import Loading from './Loading';


export default function Search({ navigation }: any) {
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [shouldSearch, setShouldSearch] = useState(false);

    useEffect(() => {
        if (inputText.trim() === '') {
            setSearchTerm('');
            setShouldSearch(false);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            setSearchTerm(inputText);
            setShouldSearch(true);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [inputText]);

    const {
        data: searchResults = [],
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ['search', searchTerm],
        queryFn: () => searchAndFilterMovies({ query: searchTerm }),
        enabled: shouldSearch && searchTerm.length > 0,
    });

    function handleManualSearch() {
        if (inputText.trim().length > 0) {
            setSearchTerm(inputText);
            setShouldSearch(true);
            Keyboard.dismiss();
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.searchBarWrapper}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search movies or shows..."
                    placeholderTextColor="#aaa"
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleManualSearch}
                    returnKeyType="search"
                    autoCorrect={false}
                    autoCapitalize="none"
                />
      
                <TouchableOpacity
                    style={styles.searchBtn}
                    onPress={handleManualSearch}
                    activeOpacity={0.7}
                >
                    <Text style={styles.searchBtnText}>🔍</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.resultsContainer}>
                {(isLoading || isFetching) ? (
                    <Loading />
                ) : (shouldSearch && searchTerm.length > 0) ? (
                    searchResults && searchResults.length > 0 ? (
                        <FlatList
                            data={searchResults}
                            numColumns={3}
                            keyExtractor={item => `${item.id}`}
                            ListHeaderComponent={<Text style={styles.sectionTitle}>Results for "{searchTerm}"</Text>}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={styles.cardWrapper}>
                                    <MovieCard
                                        {...item}
                                        onPress={() => navigation.navigate('Details', { movieId: item.id })}
                                    />
                                </View>
                            )}
                        />
                    ) : (
                        <View style={styles.noResultWrapper}>
                            <Text style={styles.noResultText}>No results found for "{searchTerm}"</Text>
                        </View>
                    )
                ) : (
                    <View style={styles.suggestionWrap}>
    
                        <Text style={styles.suggestionEmoji}>🍿</Text>
                        <Text style={styles.suggestionText}>Search for any movie, show, or franchise…</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: StatusBar.currentHeight || 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        paddingHorizontal: 15,
    },
    title: {
        color: "#fff",
        fontWeight: "900",
        fontSize: 24,
        letterSpacing: 1,
    },
    backBtn: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 28,
        width: 30,
    },
    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: '#181818',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: '#333',
    },
    searchBar: {
        flex: 1,
        height: '100%',
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    searchBtn: {
        paddingLeft: 10,
        borderLeftWidth: 1,
        borderLeftColor: '#333',
        height: '60%',
        justifyContent: 'center',
    },
    searchBtnText: {
        fontSize: 18,
    },
    resultsContainer: {
        flex: 1,
        marginTop: 15,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '400',
        textTransform: 'uppercase',
        marginBottom: 15,
        marginLeft: 10,
        opacity: 0.6,
    },
    listContent: {
        paddingHorizontal: 6,
        paddingBottom: 30,
    },
    cardWrapper: {
        flex: 1 / 3,
        padding: 4,
    },
    noResultWrapper: {
        alignItems: 'center',
        marginTop: 100,
    },
    noResultText: {
        color: '#888',
        fontSize: 16,
    },
    suggestionWrap: {
        alignItems: 'center',
        marginTop: 120,
        paddingHorizontal: 40,
    },
    suggestionEmoji: {
        fontSize: 50,
        marginBottom: 20,
        opacity: 0.8,
    },
    suggestionText: {
        color: '#555',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
});