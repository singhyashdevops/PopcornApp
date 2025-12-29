/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Dimensions, ImageBackground, TouchableOpacity, FlatList, Image,
  StatusBar
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetails, IMAGE_BASE_URL } from '../api/tmdbService';
import MovieCard from './MovieCard';
import Error from './Error';
import LinearGradient from 'react-native-linear-gradient';
import Loading from './Loading';

const { width, height } = Dimensions.get('window');
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

function formatMoney(val: number | undefined | null) {
  if (typeof val !== 'number' || val <= 0) return 'N/A';
  return `$${(val / 1000000).toFixed(0)}M`;
}

export default function DetailsScreen({ route, navigation }: any) {
  const { movieId } = route.params;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId),
    refetchOnReconnect: true,
    refetchOnWindowFocus:false
  });

  if (isLoading) return <Loading />;
  if (isError || !data) return <Error />;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="rgb(0,0,0,0.8)" barStyle="light-content" />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
     
        <View style={{ width, height: height * 0.52 }}>
          <ImageBackground
            source={
              data.backdrop_path
                ? { uri: `${BACKDROP_URL}${data.backdrop_path}` }
                : require('../assets/no_backdrop.png')
            }
            style={styles.heroBackdrop}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0,0,0,0.32)', 'rgb(0, 0, 0)']}
              locations={[0.22, 0.46, 1]}
              style={StyleSheet.absoluteFill}
            />
  
            <TouchableOpacity style={styles.closeButton} onPressIn={() => navigation.goBack()}>
              <Text style={styles.closeText}>Back</Text>
            </TouchableOpacity>
       
            <View style={styles.heroContent}>
              <Text style={styles.title} numberOfLines={2}>{data.title}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.matchText}>{data.vote_average?.toFixed(1) || "-"}/10</Text>
                <Text style={styles.metaText}>{data.release_date?.split('-')[0]}</Text>
                <View style={styles.ageBadge}>
                  <Text style={styles.ageText}>{data.certification || '13+'}</Text>
                </View>
                {data.runtime ? (
                  <Text style={styles.metaText}>
                    {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                  </Text>
                ) : null}
                <View style={styles.qualityBadge}>
                  <Text style={styles.qualityText}>Ultra HD 4K</Text>
                </View>
              </View>
              <View style={styles.heroButtons}>
                <TouchableOpacity activeOpacity={0.7} style={styles.playButton}>
                  <Text style={styles.playBtnText}>PLAY</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={styles.downloadBtn}>
                  <Text style={styles.downloadBtnText}>DOWNLOAD</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.contentBody}>
          <Text style={styles.overview}>{data.overview}</Text>

          {data.cast?.length > 0 && (
            <View style={styles.sectionMargin}>
              <Text style={styles.sectionTitle}>CAST</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
                {data.cast.slice(0, 10).map((person: any) => (
                  <View key={person.id} style={styles.castCard}>
                    <Image
                      source={{
                        uri: person.profile_path
                          ? `${IMAGE_BASE_URL}${person.profile_path}`
                          : 'https://via.placeholder.com/100'
                      }}
                      style={styles.castImage}
                    />
                    <Text style={styles.castName} numberOfLines={2}>{person.name}</Text>
                    <Text style={styles.characterName} numberOfLines={1}>{person.character}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>DIRECTOR</Text>
              <Text style={styles.specValue}>{data.director || 'N/A'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>GENRES</Text>
              <Text style={styles.specValue}>
                {data.genres && data.genres.length > 0
                  ? data.genres.map((g: any) => g.name).join(', ')
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>LANGUAGE</Text>
              <Text style={styles.specValue}>{data.original_language?.toUpperCase() || "N/A"}</Text>
            </View>

            <View style={styles.specItem}>
              <Text style={styles.specLabel}>RUNTIME</Text>
              <Text style={styles.specValue}>
                {typeof data.runtime === 'number' && data.runtime > 0
                  ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>TAGLINE</Text>
              <Text style={styles.specValue}>{data.tagline || 'N/A'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>BUDGET</Text>
              <Text style={styles.specValue}>{formatMoney(data.budget)}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>REVENUE</Text>
              <Text style={styles.specValue}>{formatMoney(data.revenue)}</Text>
            </View>
          </View>

          {data.recommendations?.length  && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.sectionTitle}>MORE LIKE THIS</Text>
              <FlatList
                data={data.recommendations}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <MovieCard {...item} onPress={() => navigation.push('Details', { movieId: item.id })} />
                )}
              />
            </View>
          )}

          <View style={{ height: 70 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  closeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1
  },
  heroBackdrop: {
    width: width,
    height: height * 0.55,
    justifyContent: 'flex-end'
  },
  heroContent: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    width: width,
    paddingHorizontal: 18,
    alignItems: 'flex-start'
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 15,
    letterSpacing: -1.2,
    maxWidth: width * 0.92
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12
  },
  matchText: {
    color: '#46d369',
    fontWeight: '900',
    fontSize: 13
  },
  metaText: {
    color: '#a3a3a3',
    fontSize: 13,
    fontWeight: '700'
  },
  ageBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 5,
    borderRadius: 2
  },
  ageText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900'
  },
  qualityBadge: {
    borderColor: '#444',
    borderWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 3
  },
  qualityText: {
    color: '#a3a3a3',
    fontSize: 10,
    fontWeight: '900'
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginTop: 8
  },
  playButton: {
    backgroundColor: '#FFF',
    width: 130,
    height: 38,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900'
  },
  downloadBtn: {
    backgroundColor: '#262626',
    width: 130,
    height: 38,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  downloadBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900'
  },
  contentBody: {
    paddingHorizontal: 16,
    marginTop: 16
  },
  overview: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 30
  },
  sectionMargin: {
    marginBottom: 30
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 15
  },
  // Cast Styling
  castCard: {
    width: 80,
    alignItems: 'center'
  },
  castImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#222',
    marginBottom: 8
  },
  castName: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center'
  },
  characterName: {
    color: '#777',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2
  },
  // Specs Grid
  specsGrid: {
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 20,
    gap: 15,
    marginBottom: 40
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  specLabel: {
    color: '#555',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1
  },
  specValue: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '500',
    maxWidth: '70%'
  },
  recommendationsContainer: {
    marginTop: 10
  },
});