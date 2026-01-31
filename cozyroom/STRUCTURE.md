# 📁 CozyRoom Project Structure

Clean separation of concerns with organized components and actions.

## 🎯 Design Principles

1. **Components in `/components`** - Reusable UI components
2. **Actions in `/app/{route}/actions`** - Server actions per route
3. **Services in `/app/services`** - Shared backend API calls
4. **Barrel Exports** - Clean imports via index.ts files

---

## 📂 Directory Structure

```
src/
├── app/
│   ├── auth/
│   │   └── actions/
│   │       ├── index.ts
│   │       └── logout.action.ts
│   │
│   ├── login/
│   │   ├── actions/
│   │   │   ├── index.ts
│   │   │   └── login.action.ts
│   │   ├── error.tsx
│   │   └── page.tsx
│   │
│   ├── register/
│   │   ├── actions/
│   │   │   ├── index.ts
│   │   │   └── register.action.ts
│   │   └── page.tsx
│   │
│   ├── profile/
│   │   ├── actions/
│   │   │   ├── index.ts
│   │   │   ├── get-profile.action.ts
│   │   │   ├── update-profile-info.action.ts
│   │   │   └── upload-avatar.action.ts
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── services/
│   │   ├── user.service.client.ts
│   │   └── user.service.server.ts
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── login/
│   │   ├── index.ts
│   │   └── login-form.tsx
│   │
│   ├── register/
│   │   ├── index.ts
│   │   └── register-form.tsx
│   │
│   ├── profile/
│   │   ├── index.ts
│   │   ├── avatar-upload-suspense.tsx
│   │   ├── edit-profile-form.tsx
│   │   ├── profile-data.tsx
│   │   └── profile-skeleton.tsx
│   │
│   ├── landing/
│   │   ├── index.ts
│   │   ├── AnimatedBackground.tsx
│   │   ├── BrandBadge.tsx
│   │   ├── CTAButton.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   └── StatsSection.tsx
│   │
│   ├── AuthStatus.tsx
│   ├── nav.tsx
│   └── UserMenu.tsx
│
├── config/
│   └── api.ts
│
└── providers/
    └── AuthProvider.tsx
```

---

## 🔄 Component → Action Mapping

### **Login Route**
```tsx
Component: LoginForm
   ↓ uses
Action: loginAction (from @/src/app/login/actions)
   ↓ calls
Service: loginServer (from @/src/app/services/user.service.server)
```

### **Register Route**
```tsx
Component: RegisterForm
   ↓ uses
Action: registerAction (from @/src/app/register/actions)
   ↓ calls
Service: registerServer (from @/src/app/services/user.service.server)
```

### **Profile Route**
```tsx
Component: EditProfileForm
   ↓ uses
Action: updateProfileInfoAction (from @/src/app/profile/actions)
   ↓ calls
Service: updateProfileServer (from @/src/app/services/user.service.server)

Component: AvatarUpload
   ↓ uses
Action: uploadAvatarAction (from @/src/app/profile/actions)
   ↓ calls
Service: uploadAvatarServer (from @/src/app/services/user.service.server)

Component: ProfileData
   ↓ uses
Action: getProfileAction (from @/src/app/profile/actions)
   ↓ calls
Service: getProfileServer (from @/src/app/services/user.service.server)
```

### **Auth (Logout)**
```tsx
Component: UserMenu
   ↓ uses
Action: logoutAction (from @/src/app/auth/actions)
   ↓ calls
Service: logoutServer (from @/src/app/services/user.service.server)
```

---

## 📦 Import Patterns

### **Clean Imports via Barrel Exports**

```tsx
// Components
import { LoginForm } from '@/src/components/login';
import { RegisterForm } from '@/src/components/register';
import { EditProfileForm, AvatarUpload } from '@/src/components/profile';

// Actions
import { loginAction } from '@/src/app/login/actions';
import { registerAction } from '@/src/app/register/actions';
import { getProfileAction, updateProfileInfoAction } from '@/src/app/profile/actions';
import { logoutAction } from '@/src/app/auth/actions';
```

---

## ✅ Benefits

1. **Clear Separation**
   - Components are reusable UI
   - Actions are route-specific server logic
   - Services are shared backend calls

2. **Easy to Navigate**
   - All login-related code in `/app/login` and `/components/login`
   - All profile-related code in `/app/profile` and `/components/profile`
   - Clear folder structure

3. **Scalable**
   - Easy to add new routes
   - Each route has its own actions folder
   - Components are organized by feature

4. **Clean Imports**
   - Barrel exports via index.ts
   - No relative path hell
   - Consistent import patterns

5. **Type Safety**
   - Actions export their types
   - Easy to find and use
   - Better IDE autocomplete

---

## 🎨 Conventions

### **Naming**
- Components: `PascalCase.tsx` (e.g., `LoginForm.tsx`)
- Actions: `kebab-case.action.ts` (e.g., `login.action.ts`)
- Services: `kebab-case.service.ts` (e.g., `user.service.server.ts`)

### **File Organization**
- Route pages: `/app/{route}/page.tsx`
- Route actions: `/app/{route}/actions/*.action.ts`
- Route components: `/components/{route}/*.tsx`
- Shared components: `/components/*.tsx`

### **Barrel Exports**
Every folder with multiple exports should have an `index.ts`:
```ts
// components/login/index.ts
export { default as LoginForm } from './login-form';

// app/login/actions/index.ts
export { loginAction, type LoginState } from './login.action';
```

---

## 🚀 Adding a New Feature

### Example: Adding a Settings Route

1. **Create route structure:**
```bash
mkdir -p src/app/settings/actions
mkdir -p src/components/settings
```

2. **Create action:**
```ts
// src/app/settings/actions/update-settings.action.ts
'use server';
export async function updateSettingsAction(formData: FormData) {
  // ...
}

// src/app/settings/actions/index.ts
export { updateSettingsAction } from './update-settings.action';
```

3. **Create component:**
```tsx
// src/components/settings/settings-form.tsx
'use client';
import { updateSettingsAction } from '@/src/app/settings/actions';

export default function SettingsForm() {
  // ...
}

// src/components/settings/index.ts
export { default as SettingsForm } from './settings-form';
```

4. **Create page:**
```tsx
// src/app/settings/page.tsx
import { SettingsForm } from '@/src/components/settings';

export default function SettingsPage() {
  return <SettingsForm />;
}
```

Done! 🎉

---

## 📊 Summary

| Aspect | Location | Purpose |
|--------|----------|---------|
| **Routes** | `/app/{route}/page.tsx` | Next.js pages |
| **Actions** | `/app/{route}/actions/` | Server actions per route |
| **Components** | `/components/{route}/` | UI components per feature |
| **Services** | `/app/services/` | Shared backend API calls |
| **Config** | `/config/` | Configuration files |
| **Providers** | `/providers/` | React context providers |

**Clean, scalable, and easy to maintain!** 🚀
