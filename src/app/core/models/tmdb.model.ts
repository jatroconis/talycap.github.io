
export interface TmdbMovieDTO {
  id: number;
  title: string;
  release_date: string;   
  vote_average: number;
  poster_path: string | null;
}

export interface TmdbPaginatedResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

export type TmdbPosterSize =
  | 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

export interface Movie {
  id: number;
  title: string;
  releaseDate: string;        
  voteAverage: number;
  posterUrl: string | null;  
}

// ====== Helpers / Mappers ======
export function buildTmdbImageUrl(
  base: string, // https://image.tmdb.org/t/p
  size: TmdbPosterSize,
  path: string | null
): string | null {
  return path ? `${base}/${size}${path}` : null;
}

export function mapTmdbMovieToDomain(
  dto: TmdbMovieDTO,
  opts: { imageBase: string; size?: TmdbPosterSize } 
): Movie {
  const size = opts.size ?? 'w185';
  return {
    id: dto.id,
    title: dto.title,
    releaseDate: dto.release_date,
    voteAverage: dto.vote_average,
    posterUrl: buildTmdbImageUrl(opts.imageBase, size, dto.poster_path),
  };
}

export function mapTmdbPageToDomain(
  response: TmdbPaginatedResponse<TmdbMovieDTO>,
  opts: { imageBase: string; size?: TmdbPosterSize }
) {
  return {
    page: response.page,
    totalPages: response.total_pages,
    total: response.total_results,
    items: response.results.map((m) => mapTmdbMovieToDomain(m, opts)),
  };
}
