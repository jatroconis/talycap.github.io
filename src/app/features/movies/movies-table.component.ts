import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../../core/services/movies.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Movie } from '../../core/models';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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
    MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './movies-table.component.html',
  styleUrls: ['./movies-table.component.scss']
})
export class MoviesTableComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movies = inject(MoviesService);
  private readonly announcer = inject(LiveAnnouncer);

  displayedColumns = ['poster', 'title', 'releaseDate', 'voteAverage'];

  private parseSize = (v: any) => {
    const n = Number(v ?? 20);
    return [10, 20, 50].includes(n) ? n : 20;
  };

  private initialQ = (this.route.snapshot.queryParamMap.get('q') ?? '').trim();
  private initialPage = Math.max(1, Number(this.route.snapshot.queryParamMap.get('page') ?? 1));
  private initialSize = this.parseSize(this.route.snapshot.queryParamMap.get('size'));

  readonly page = signal<number>(this.initialPage);
  readonly pageSize = signal<number>(this.initialSize);
  readonly currentQ = signal<string>(this.initialQ);
  readonly loading = signal(true);

  readonly searchCtrl = new FormControl<string>(this.initialQ, { nonNullable: true });

  @ViewChild('resultsHeading') resultsHeading?: ElementRef<HTMLHeadingElement>;

  readonly vm$ = this.route.queryParams.pipe(
    tap(qp => {
      const q = (qp['q'] ?? '').trim();
      const p = Math.max(1, Number(qp['page'] ?? this.page()));
      const s = this.parseSize(qp['size']);
      if (q !== this.currentQ()) this.currentQ.set(q);
      if (this.searchCtrl.value !== q) this.searchCtrl.setValue(q, { emitEvent: false });
      if (p !== this.page()) this.page.set(p);
      if (s !== this.pageSize()) this.pageSize.set(s);
    }),
    switchMap(() => {
      this.loading.set(true);
      return this.movies.getMovies(this.page(), this.pageSize(), this.currentQ()).pipe(
        map(res => ({ items: res.items, page: res.page, totalPages: res.totalPages, total: res.total }) as Vm),
        catchError(() => of({ items: [], page: 1, totalPages: 0, total: 0 } as Vm)),
        tap(vm => {
          this.loading.set(false);
          this.announcer.announce(`Se cargaron ${vm.total} resultados de películas.`);
          setTimeout(() => this.resultsHeading?.nativeElement.focus(), 0);
        })
      );
    })
  );

  onPage(event: PageEvent) {
    const newPage = event.pageIndex + 1;
    const newSize = event.pageSize;
    this.page.set(newPage);
    this.pageSize.set(newSize);
    this.updateQuery({ page: newPage, size: newSize });
  }

    onSearch() {
    const q = this.searchCtrl.value.trim();
    this.currentQ.set(q);
    this.page.set(1);
    this.updateQuery({ q, page: 1 });
    }


  onClear() {
    this.searchCtrl.setValue('');
    this.onSearch();
  }

  imgUrl(u: string | null) { return u ?? ''; }
  posterAlt(t: string) { return `Póster de ${t}`; }
  trackById = (_: number, m: Movie) => m.id;

  private updateQuery(params: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
