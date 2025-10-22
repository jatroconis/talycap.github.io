import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../core/services/weather.service';
import { DEFAULT_CITIES } from '../../core/constants/cities';
import { CityWeather } from '../../core/models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-weather-table',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './weather-table.component.html',
  styleUrls: ['./weather-table.component.scss']
})
export class WeatherTableComponent implements AfterViewInit {
  displayedColumns = ['icon', 'city', 'tempC', 'description'];
  dataSource = new MatTableDataSource<CityWeather>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterCtrl = new FormControl<string>('', { nonNullable: true });

  private readonly announcer = inject(LiveAnnouncer);
  constructor(private readonly weather: WeatherService) {
    this.dataSource.filterPredicate = (cw, f) =>
      cw.city.name.toLowerCase().includes((f ?? '').toLowerCase());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    this.weather.getMany(DEFAULT_CITIES).subscribe({
      next: res => {
        this.dataSource.data = res.items;
        this.loading = false;
        this.announcer.announce(`Se cargaron ${res.items.length} ciudades con clima actual.`);
      },
      error: () => {
        this.dataSource.data = [];
        this.loading = false;
        this.announcer.announce('No se pudo cargar el clima. Intenta más tarde.');
      }
    });

    this.filterCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(v => {
      this.dataSource.filter = (v ?? '').trim().toLowerCase();
      if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    });
  }

  alt(cw: CityWeather) { return `Clima en ${cw.city.name}: ${cw.description}`; }
}
