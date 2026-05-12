import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand">
          <span class="brand-icon">🥗</span>
          <h1 class="brand-name">FitLife</h1>
          <p class="brand-tagline">Reset your password</p>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-card">
          @if (!resetToken) {
            <h2 class="auth-title">Forgot Password 🔐</h2>
            <p class="auth-subtitle">Enter your email to receive a reset token</p>
            <form (ngSubmit)="onSubmit()" class="auth-form">
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required />
              </div>
              @if (errorMsg) { <div class="error-banner">{{ errorMsg }}</div> }
              <button type="submit" class="btn btn-primary auth-submit" [disabled]="isLoading">
                @if (isLoading) { <span class="spinner"></span> }
                Send Reset Token
              </button>
            </form>
          } @else {
            <div class="success-box">
              <span class="success-icon">✅</span>
              <h3>Reset token generated!</h3>
              <p>Copy this token and use it on the reset password page:</p>
              <div class="token-box">{{ resetToken }}</div>
              <button class="btn btn-secondary copy-btn" (click)="copyToken()">Copy Token</button>
            </div>
            <a routerLink="/reset-password" class="btn btn-primary" style="width:100%;text-align:center;margin-top:1rem;display:block">
              Go to Reset Password →
            </a>
          }
          <p class="auth-switch">
            Remembered it? <a routerLink="/login" class="switch-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display:flex; min-height:100vh; background:var(--bg-primary); }
    .auth-left { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
      background:linear-gradient(135deg,#0a1a0a 0%,#0d2818 50%,#0a0a0f 100%); padding:3rem; }
    .auth-brand { text-align:center; }
    .brand-icon { font-size:4rem; display:block; margin-bottom:1rem; }
    .brand-name { font-size:3rem; font-weight:800; color:var(--green-primary); }
    .brand-tagline { color:var(--text-secondary); margin-top:0.5rem; }
    .auth-right { flex:1; display:flex; align-items:center; justify-content:center; padding:2rem; }
    .auth-card { width:100%; max-width:420px; background:var(--bg-card); border:1px solid var(--border-color);
      border-radius:var(--radius-xl); padding:2.5rem; }
    .auth-title { font-size:var(--font-size-2xl); font-weight:700; margin-bottom:0.3rem; }
    .auth-subtitle { color:var(--text-secondary); margin-bottom:2rem; }
    .auth-form { display:flex; flex-direction:column; gap:1.2rem; }
    .auth-submit { width:100%; justify-content:center; padding:0.8rem; margin-top:0.5rem; }
    .error-banner { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3);
      color:#ef4444; padding:0.75rem 1rem; border-radius:var(--radius-md); font-size:var(--font-size-sm); }
    .success-box { text-align:center; padding:1rem 0; }
    .success-icon { font-size:3rem; display:block; margin-bottom:0.75rem; }
    .success-box h3 { font-weight:700; margin-bottom:0.5rem; }
    .success-box p { color:var(--text-secondary); font-size:var(--font-size-sm); margin-bottom:1rem; }
    .token-box { background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-md);
      padding:0.75rem 1rem; font-family:monospace; font-size:0.75rem; word-break:break-all;
      color:var(--green-primary); margin-bottom:0.75rem; }
    .copy-btn { width:100%; justify-content:center; }
    .spinner { width:18px; height:18px; border:2px solid transparent; border-top-color:#000;
      border-radius:50%; animation:spin 0.6s linear infinite; }
    .auth-switch { text-align:center; margin-top:1.5rem; font-size:var(--font-size-sm); color:var(--text-secondary); }
    .switch-link { color:var(--green-primary); font-weight:600; margin-left:0.3rem; }
    @media (max-width:768px) { .auth-left { display:none; } }
  `]
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  email = '';
  isLoading = false;
  errorMsg = '';
  resetToken = '';

  async onSubmit(): Promise<void> {
    if (!this.email.trim()) { this.errorMsg = 'Email is required'; return; }
    this.errorMsg = '';
    this.isLoading = true;
    try {
      this.resetToken = await this.authService.forgotPassword(this.email);
      this.toast.success('Reset token generated. Copy and use it below.');
    } catch (err: any) {
      this.errorMsg = typeof err === 'string' ? err : 'No account found with this email';
    } finally {
      this.isLoading = false;
    }
  }

  copyToken(): void {
    navigator.clipboard.writeText(this.resetToken).then(() => {
      this.toast.success('Token copied to clipboard');
    });
  }
}

