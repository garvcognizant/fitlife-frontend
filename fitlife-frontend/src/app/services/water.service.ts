import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { FitnessCalculatorService } from './fitness-calculator.service';

export interface WaterLog {
  id: number;
  amountMl: number;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class WaterService {
  logs = signal<WaterLog[]>([]);
  private apiUrl = `${environment.apiUrl}/water`;
  private authService = inject(AuthService);
  private calc = inject(FitnessCalculatorService);

  constructor(private http: HttpClient, private toast: ToastService) {}

  get dailyGoalMl(): number {
    const user = this.authService.currentUser();
    return user ? this.calc.calcWaterGoalMl(user) : 2000;
  }

  get todayTotalMl(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.logs()
      .filter(l => l.date === today)
      .reduce((s, l) => s + l.amountMl, 0);
  }

  get todayLogs(): WaterLog[] {
    const today = new Date().toISOString().split('T')[0];
    return this.logs().filter(l => l.date === today);
  }

  get progressPct(): number {
    const goal = this.dailyGoalMl;
    if (goal === 0) return 0;
    return Math.min(100, Math.round((this.todayTotalMl / goal) * 100));
  }

  loadTodayLogs(): void {
    this.http.get<WaterLog[]>(this.apiUrl).subscribe({
      next: (data) => this.logs.set(data),
      error: (err) => this.toast.error(err.error?.error || 'Failed to load water logs')
    });
  }

  addLog(amountMl: number): Promise<WaterLog> {
    return new Promise((resolve, reject) => {
      this.http.post<WaterLog>(this.apiUrl, { amountMl }).subscribe({
        next: (log) => {
          this.logs.update(list => [log, ...list]);
          resolve(log);
        },
        error: (err) => {
          this.toast.error(err.error?.error || 'Failed to log water');
          reject(err);
        }
      });
    });
  }

  deleteLog(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.logs.update(list => list.filter(l => l.id !== id)),
      error: (err) => this.toast.error(err.error?.error || 'Failed to delete log')
    });
  }
}

