
export interface TvMazeImage {
  medium?: string | null;
  original?: string | null;
}
export interface TvMazeRating {
  average?: number | null;
}
export interface TvMazeShowDTO {
  id: number;
  name: string;      
  premiered?: string | null; 
  rating?: TvMazeRating;
  image?: TvMazeImage | null;
}
export interface TvMazeSearchItemDTO {
  score: number;
  show: TvMazeShowDTO;
}

export interface Movie {
  id: number;
  title: string;
  releaseDate: string;  
  voteAverage: number;      
  posterUrl: string | null;
}

export function mapTvMazeShowToMovie(dto: TvMazeShowDTO): Movie {
  const img = dto.image?.medium ?? dto.image?.original ?? null;
  return {
    id: dto.id,
    title: dto.name,
    releaseDate: dto.premiered ?? '',
    voteAverage: dto.rating?.average ?? 0,
    posterUrl: img,
  };
}

export function mapTvMazeArrayToPage(
  items: TvMazeShowDTO[],
  page1Based: number,
  totalKnown?: number
) {
  return {
    page: page1Based,
    totalPages: totalKnown ?? items.length ? page1Based : 1,
    total: totalKnown ?? items.length,
    items: items.map(mapTvMazeShowToMovie),
  };
}
