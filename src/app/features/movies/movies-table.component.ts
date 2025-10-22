// src/app/features/movies/movies-table.component.ts
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap, tap } from 'rxjs';
import { Movie } from '../../core/models';
import { MoviesService } from '../../core/services/movies.service';

type Vm = {
  items: Movie[];
  page: number;
  totalPages: number;
  total: number;
};

@Component({
  selector: 'app-movies-table',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './movies-table.component.html',
  styleUrls: ['./movies-table.component.scss']
})
export class MoviesTableComponent {
  displayedColumns = ['poster', 'title', 'releaseDate', 'voteAverage'];

  // Estado
  readonly page = signal(1); // 1-based para TMDB
  readonly loading = signal(true);

  // Búsqueda (FormControl -> stream)
  readonly searchCtrl = new FormControl<string>('', { nonNullable: true });
  readonly search$ = this.searchCtrl.valueChanges.pipe(
    startWith(this.searchCtrl.value),
    debounceTime(400),
    distinctUntilChanged(),
    map(v => v.trim())
  );

  // Reaccionar a cambios de página o búsqueda
  readonly page$ = toObservable(this.page);

  readonly vm$ = this.page$.pipe(
    tap(() => this.loading.set(true)),
    switchMap((p) =>
      this.search$.pipe(
        switchMap(q =>
          this.movies.getMovies(p, q).pipe(
            map(res => ({
              items: res.items,
              page: res.page,
              totalPages: res.totalPages,
              total: res.total
            }) as Vm),
            catchError(() => {
              // En error devolvemos página vacía para no romper la UI
              return of({ items: [], page: 1, totalPages: 0, total: 0 } as Vm);
            }),
            tap(() => this.loading.set(false))
          )
        )
      )
    )
  );

  constructor(private readonly movies: MoviesService) {}

  onPage(event: PageEvent) {
    // Angular Material expone pageIndex 0-based -> TMDB 1-based
    this.page.set(event.pageIndex + 1);
  }

  imgUrl(posterUrl: string | null) {
    // Ya viene absoluta desde el mapper, pero dejamos helper por claridad
    return posterUrl ?? '';
  }

  // Por accesibilidad: texto alternativo
  posterAlt(title: string) {
    return `Póster de ${title}`;
  }
}
