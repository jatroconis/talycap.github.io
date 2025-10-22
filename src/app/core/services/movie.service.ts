import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  Movie,
  TmdbMovieDTO,
  TmdbPaginatedResponse,
  mapTmdbPageToDomain
} from '../models';

type MoviesPage = {
  page: number;
  totalPages: number;
  total: number;
  items: Movie[];
};

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.tmdbBaseUrl;
  private readonly imageBase = environment.tmdbImageBase;

  private cache = new Map<string, Observable<MoviesPage>>();

  getMovies(page: number, query?: string): Observable<MoviesPage> {
    const key = JSON.stringify({ page, query: (query ?? '').trim() });
    const cached = this.cache.get(key);
    if (cached) return cached;

    const hasQuery = !!(query && query.trim());
    const endpoint = hasQuery ? 'search/movie' : 'discover/movie';
    const params: Record<string, any> = hasQuery
      ? { query: query!.trim(), include_adult: false, language: 'es-ES', page }
      : { sort_by: 'popularity.desc', language: 'es-ES', page };

    const req$ = this.http
      .get<TmdbPaginatedResponse<TmdbMovieDTO>>(`${this.base}/${endpoint}`, { params })
      .pipe(
        map(res => mapTmdbPageToDomain(res, { imageBase: this.imageBase, size: 'w185' })),
        shareReplay({ bufferSize: 1, refCount: true })
      );

    this.cache.set(key, req$);
    return req$;
  }
}
