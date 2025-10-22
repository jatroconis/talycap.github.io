import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  Movie,
  TvMazeShowDTO,
  TvMazeSearchItemDTO,
  mapTvMazeShowToMovie
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
  private readonly base = environment.tvMazeBaseUrl;

  private cache = new Map<string, Observable<MoviesPage>>();

  /**
   * TVMaze:
   */
  getMovies(page1Based: number, query?: string): Observable<MoviesPage> {
    const q = (query ?? '').trim();
    const key = JSON.stringify({ q, page1Based });
    const cached = this.cache.get(key);
    if (cached) return cached;

    if (!q) {
      const page0 = Math.max(0, (page1Based || 1) - 1);
      const req$ = this.http
        .get<TvMazeShowDTO[]>(`${this.base}/shows`, { params: { page: page0 } })
        .pipe(
          map(arr => ({
            page: page1Based,
            totalPages: page1Based + 1, 
            total: arr.length,       
            items: arr.map(mapTvMazeShowToMovie),
          })),
          shareReplay({ bufferSize: 1, refCount: true })
        );
      this.cache.set(key, req$);
      return req$;
    }

    const PAGE_SIZE = 20;
    const req$ = this.http
      .get<TvMazeSearchItemDTO[]>(`${this.base}/search/shows`, { params: { q } })
      .pipe(
        map(list => list.map(x => mapTvMazeShowToMovie(x.show))),
        map(itemsAll => {
          const total = itemsAll.length;
          const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
          const p = Math.min(Math.max(page1Based, 1), totalPages);
          const slice = itemsAll.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
          return { page: p, totalPages, total, items: slice } as MoviesPage;
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    this.cache.set(key, req$);
    return req$;
  }
}
