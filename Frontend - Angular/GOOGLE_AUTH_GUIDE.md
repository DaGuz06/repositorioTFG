# How to Implement Google Authentication in Angular

This guide explains how to enable "Continue with Google" functionality using **AngularFire** and **Firebase**.

## Prerequisites

1.  **Node.js** and **npm** installed.
2.  **Angular CLI** installed.

## Step 1: Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **Add project** and follow the setup steps (name your project `ChefPro` or similar).

## Step 2: Enable Google Authentication

1.  In your Firebase project dashboard, go to **Build** > **Authentication**.
2.  Click **Get Started**.
3.  Select the **Sign-in method** tab.
4.  Click **Google**.
5.  Toggle **Enable**.
6.  Select a project support email.
7.  Click **Save**.

## Step 3: Add AngularFire to your Project

Run the following command in your terminal:

```bash
ng add @angular/fire
```

- Select your Firebase project when prompted.
- This will install dependencies and create `firebase.json` and `.firebaserc`.

## Step 4: Configure Auth in `app.config.ts`

Modify `src/app/app.config.ts` to include Firebase providers:

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment'; // Make sure you have your firebase config here

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
};
```

_(Note: You'll need to add your Firebase config object to `src/environments/environment.ts`)_

## Step 5: Implement Login Logic

Update `src/app/components/login/login.component.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';

export class LoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        console.log('User signed in:', result.user);
        this.router.navigate(['/']); // Redirect to home
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  }
}
```

## Step 6: Connect the Button

In `login.component.html`, link the button to the function:

```html
<button class="google-btn" (click)="loginWithGoogle()">Continuar con Google</button>
```

---

**Security Note:** Always keep your Firebase API keys restricted in the Google Cloud Console.
