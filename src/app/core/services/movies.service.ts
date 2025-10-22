import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
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

  private listCache = new Map<string, Observable<Movie[]>>();

  getMovies(page1Based: number, pageSize: number, query?: string): Observable<MoviesPage> {
    const q = (query ?? '').trim();
    const key = q ? `search:${q.toLowerCase()}` : `shows:p0`;

    let items$: Observable<Movie[]> | undefined = this.listCache.get(key);
    if (!items$) {
      items$ = q
        ? this.http.get<TvMazeSearchItemDTO[]>(`${this.base}/search/shows`, { params: { q } })
            .pipe(
              map(list => list.map(x => mapTvMazeShowToMovie(x.show))),
              shareReplay({ bufferSize: 1, refCount: true })
            )
        : this.http.get<TvMazeShowDTO[]>(`${this.base}/shows`, { params: { page: 0 } })
            .pipe(
              map(arr => arr.map(mapTvMazeShowToMovie)),
              shareReplay({ bufferSize: 1, refCount: true })
            );

      this.listCache.set(key, items$);
    }

    return items$.pipe(
      map(itemsAll => {
        const size = Math.max(1, pageSize || 20);
        const total = itemsAll.length;
        const totalPages = Math.max(1, Math.ceil(total / size));
        const page = Math.min(Math.max(1, page1Based || 1), totalPages);
        const start = (page - 1) * size;
        const slice = itemsAll.slice(start, start + size);
        return { page, totalPages, total, items: slice } as MoviesPage;
      })
    );
  }
}
