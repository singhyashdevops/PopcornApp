import axios from 'axios';
import { MovieCardProps } from '../types/props';

const API_KEY = '8f430df9f2e1aaf909aef77cc434b4d6';
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

const mapMovieData = (movie: any): MovieCardProps => ({
  id: movie.id,
  title: movie.title || movie.name, 
  overview: movie.overview || '',
  poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '',
  release_date: movie.release_date || movie.first_air_date || '',
  backdrop_path: movie.backdrop_path
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : '',
  vote_average: movie.vote_average || 0,
  popularity: movie.popularity || 0,
  vote_count: movie.vote_count || 0,
  original_language: movie.original_language || '',
  genre_ids: movie.genre_ids || [],
  adult: movie.adult || false,
  video: movie.video || false,
});

const fetchFromTMDB = async (
  url: string,
  params = {},
): Promise<MovieCardProps[]> => {
  try {
    const response = await tmdb.get(url, { params });
    return response.data.results.map(mapMovieData);
  } catch (error) {
    console.error(`TMDB Error at ${url}:`, error);
    return [];
  }
};


export interface AdvancedFilterParams {
  query?: string;
  with_genres?: string;
  with_original_language?: string;
  sort_by?: string;
  primary_release_year?: number;
  'vote_average.gte'?: number;
  page?: number;
}

export const searchAndFilterMovies = async (params: AdvancedFilterParams) => {

  const endpoint = params.query ? '/search/movie' : '/discover/movie';
  return fetchFromTMDB(endpoint, {
    ...params,
    include_adult: false,
  });
};

export const fetchMovieDetails = async (movieId: number) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}`, {
      params: { append_to_response: 'credits,release_dates,recommendations' },
    });

    const data = response.data;
    const usRelease = data.release_dates?.results?.find(
      (r: any) => r.iso_3166_1 === 'US',
    );
    const certification = usRelease?.release_dates?.find(
      (d: any) => d.certification !== '',
    )?.certification;

    return {
      ...mapMovieData(data),
      genres: data.genres,
      runtime: data.runtime,
      tagline: data.tagline,
      budget: data.budget,
      revenue: data.revenue,
      cast: data.credits?.cast?.slice(0, 15),
      director: data.credits?.crew?.find((c: any) => c.job === 'Director')
        ?.name,
      recommendations: data.recommendations?.results?.map(mapMovieData),
      certification: certification || 'NR',
    };
  } catch (error) {
    console.error('Detail Fetch Error:', error);
    return null;
  }
};

export const fetchPopularMovies = () => fetchFromTMDB('/movie/popular');
export const fetchTopRatedMovies = () => fetchFromTMDB('/movie/top_rated');
export const fetchUpcomingMovies = () => fetchFromTMDB('/movie/upcoming');
export const fetchTrendingNow = () => fetchFromTMDB('/trending/movie/day');

export const fetchQuickWatches = () =>
  fetchFromTMDB('/discover/movie', {
    'with_runtime.lte': 90,
    sort_by: 'primary_release_date.desc',
  });
export const fetchHindiMovies = () =>
  fetchFromTMDB('/discover/movie', {
    with_original_language: 'hi',
    sort_by: 'primary_release_date.desc',
    'primary_release_date.lte': new Date().toISOString().slice(0, 10),
    'vote_count.gte': 10,
    include_video: false,
  });
export const fetchKoreanMovies = () =>
  fetchFromTMDB('/discover/movie', {
    with_original_language: 'ko',
    sort_by: 'primary_release_date.desc',
    'primary_release_date.lte': new Date().toISOString().slice(0, 10),
    'vote_count.gte': 10,
    include_video: false,
  });
export const fetchEnglishMovies = () =>
  fetchFromTMDB('/discover/movie', {
    with_original_language: 'en',
    sort_by: 'primary_release_date.desc',
    'primary_release_date.lte': new Date().toISOString().slice(0, 10),
    'vote_count.gte': 10,
    include_video: false,
  });
export const fetchMarvelUniverse = () =>
  fetchFromTMDB('/discover/movie', {
    with_companies: 420,
    sort_by: 'primary_release_date.desc',
    'primary_release_date.lte': new Date().toISOString().slice(0, 10),
  });

export const fetchDCUniverse = () =>
  fetchFromTMDB('/discover/movie', {
    with_companies: 9993,
    sort_by: 'primary_release_date.desc',
    'primary_release_date.lte': new Date().toISOString().slice(0, 10),
  });

export const fetchDisneyUniverse = () =>
  fetchFromTMDB('/discover/movie', {
    with_companies: 2,
    sort_by: 'primary_release_date.desc',
    'primary_release_date.lte': new Date().toISOString().slice(0, 10),
  });

export const fetchPixarUniverse = () =>
  fetchFromTMDB('/discover/movie', {
    with_companies: 3,
    sort_by: 'primary_release_date.desc',
    'primary_release_date.lte': new Date().toISOString().slice(0, 10),
  });

export const fetchWBUniverse = () =>
  fetchFromTMDB('/discover/movie', {
    with_companies: 174,
    sort_by: 'primary_release_date.desc',
    'primary_release_date.lte': new Date().toISOString().slice(0, 10),
  });
