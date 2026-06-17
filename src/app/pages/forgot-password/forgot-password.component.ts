import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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
          @if (step === 1) {
            <h2 class="auth-title">Forgot Password 🔐</h2>
            <p class="auth-subtitle">Enter your email to verify your identity</p>
            <form (ngSubmit)="onSubmitEmail()" class="auth-form">
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required />
              </div>
              @if (errorMsg) { <div class="error-banner">{{ errorMsg }}</div> }
              <button type="submit" class="btn btn-primary auth-submit" [disabled]="isLoading">
                @if (isLoading) { <span class="spinner"></span> }
                Continue
              </button>
            </form>
          }

          @if (step === 2) {
            <h2 class="auth-title">Security Question 🔒</h2>
            <p class="auth-subtitle">{{ securityQuestion }}</p>
            <form (ngSubmit)="onSubmitAnswer()" class="auth-form">
              <div class="form-group">
                <label>Your Answer</label>
                <input type="text" [(ngModel)]="securityAnswer" name="answer" placeholder="Enter your answer" required />
              </div>
              <div class="form-group">
                <label>New Password</label>
                <input type="password" [(ngModel)]="newPassword" name="newPassword" placeholder="At least 6 characters" required minlength="6" />
              </div>
              <div class="form-group">
                <label>Confirm New Password</label>
                <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Repeat new password" required />
              </div>
              @if (errorMsg) { <div class="error-banner">{{ errorMsg }}</div> }
              <button type="submit" class="btn btn-primary auth-submit" [disabled]="isLoading">
                @if (isLoading) { <span class="spinner"></span> }
                Reset Password
              </button>
              <button type="button" class="btn btn-secondary" style="width:100%" (click)="step = 1; errorMsg = ''">
                ← Back
              </button>
            </form>
          }

          @if (step === 3) {
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
    .success-box p { color:var(--text-secondary); font-size:var(--font-size-sm); }
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

  step = 1; // 1=email, 2=answer+new password, 3=success
  email = '';
  securityQuestion = '';
  securityAnswer = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  errorMsg = '';

  async onSubmitEmail(): Promise<void> {
    if (!this.email.trim()) { this.errorMsg = 'Email is required'; return; }
    this.errorMsg = '';
    this.isLoading = true;
    try {
      this.securityQuestion = await this.authService.getSecurityQuestion(this.email);
      this.step = 2;
    } catch (err: any) {
      this.errorMsg = typeof err === 'string' ? err : 'No account found with this email';
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmitAnswer(): Promise<void> {
    this.errorMsg = '';
    if (!this.securityAnswer.trim()) { this.errorMsg = 'Answer is required'; return; }
    if (this.newPassword.length < 6) { this.errorMsg = 'Password must be at least 6 characters'; return; }
    if (this.newPassword !== this.confirmPassword) { this.errorMsg = 'Passwords do not match'; return; }

    this.isLoading = true;
    try {
      await this.authService.resetPassword(this.email, this.securityAnswer, this.newPassword);
      this.step = 3;
      this.toast.success('Password reset successfully! 🎉');
    } catch (err: any) {
      this.errorMsg = typeof err === 'string' ? err : 'Security answer is incorrect';
    } finally {
      this.isLoading = false;
    }
  }
}
