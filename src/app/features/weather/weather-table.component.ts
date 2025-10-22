// src/app/features/weather/weather-table.component.ts
import { AfterViewInit, Component, ViewChild } from '@angular/core';
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

  constructor(private readonly weather: WeatherService) {
    this.dataSource.filterPredicate = (cw, f) =>
      cw.city.name.toLowerCase().includes((f ?? '').toLowerCase());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    // Cargar clima de ciudades por defecto
    // se agregaa (cacheado en el servicio)
    this.weather.getMany(DEFAULT_CITIES).subscribe({
      next: res => {
        this.dataSource.data = res.items;
        this.loading = false;
      },
      error: () => {
        this.dataSource.data = [];
        this.loading = false;
      }
    });

    // Filtro
    this.filterCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(v => {
      this.dataSource.filter = (v ?? '').trim().toLowerCase();
      // Reset de página al filtrar
      if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    });
  }

  alt(cw: CityWeather) {
    return `Clima en ${cw.city.name}: ${cw.description}`;
  }
}
