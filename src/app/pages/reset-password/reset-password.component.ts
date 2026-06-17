import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand">
          <span class="brand-icon">🥗</span>
          <h1 class="brand-name">FitLife</h1>
          <p class="brand-tagline">Set a new password</p>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-card">
          @if (!success) {
            <h2 class="auth-title">Reset Password 🔑</h2>
            <p class="auth-subtitle">Verify your identity and choose a new password</p>
            <form (ngSubmit)="onSubmit()" class="auth-form">
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="email" name="email"
                       placeholder="Your registered email" required />
              </div>
              <div class="form-group">
                <label>Security Answer</label>
                <input type="text" [(ngModel)]="securityAnswer" name="securityAnswer"
                       placeholder="Answer to your security question" required />
              </div>
              <div class="form-group">
                <label>New Password</label>
                <input type="password" [(ngModel)]="newPassword" name="password"
                       placeholder="At least 6 characters" required minlength="6" />
              </div>
              <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" [(ngModel)]="confirmPassword" name="confirm"
                       placeholder="Repeat new password" required />
              </div>
              @if (errorMsg) { <div class="error-banner">{{ errorMsg }}</div> }
              <button type="submit" class="btn btn-primary auth-submit" [disabled]="isLoading">
                @if (isLoading) { <span class="spinner"></span> }
                Reset Password
              </button>
            </form>
          } @else {
            <div class="success-box">
              <span class="success-icon">🎉</span>
              <h3>Password reset successfully!</h3>
              <p>You can now sign in with your new password.</p>
              <a routerLink="/login" class="btn btn-primary" style="display:block;text-align:center;margin-top:1rem">
                Go to Login →
              </a>
            </div>
          }
          <p class="auth-switch">
            <a routerLink="/forgot-password" class="switch-link">← Back to Forgot Password</a>
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
    .success-box p { color:var(--text-secondary); font-size:var(--font-size-sm); }
    .spinner { width:18px; height:18px; border:2px solid transparent; border-top-color:#000;
      border-radius:50%; animation:spin 0.6s linear infinite; }
    .auth-switch { text-align:center; margin-top:1.5rem; font-size:var(--font-size-sm); }
    .switch-link { color:var(--green-primary); font-weight:600; }
    @media (max-width:768px) { .auth-left { display:none; } }
  `]
})
export class ResetPasswordComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  email = '';
  securityAnswer = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  errorMsg = '';
  success = false;

  async onSubmit(): Promise<void> {
    this.errorMsg = '';
    if (!this.email.trim()) { this.errorMsg = 'Email is required'; return; }
    if (!this.securityAnswer.trim()) { this.errorMsg = 'Security answer is required'; return; }
    if (this.newPassword.length < 6) { this.errorMsg = 'Password must be at least 6 characters'; return; }
    if (this.newPassword !== this.confirmPassword) { this.errorMsg = 'Passwords do not match'; return; }

    this.isLoading = true;
    try {
      await this.authService.resetPassword(this.email.trim(), this.securityAnswer.trim(), this.newPassword);
      this.success = true;
      this.toast.success('Password reset successfully! 🎉');
    } catch (err: any) {
      this.errorMsg = typeof err === 'string' ? err : 'Failed to reset password. Please check your details.';
    } finally {
      this.isLoading = false;
    }
  }
}
