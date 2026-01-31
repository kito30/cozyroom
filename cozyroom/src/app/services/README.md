# Services Directory

All server actions and API services organized by feature category.

## 📁 Structure

```
services/
├── index.ts              # Main barrel export
├── auth/                 # 🔐 Authentication services
│   ├── login.action.ts
│   ├── register.action.ts
│   ├── logout.action.ts
│   └── index.ts
├── profile/              # 👤 Profile services
│   ├── get-profile.action.ts
│   ├── update-profile-info.action.ts
│   ├── upload-avatar.action.ts
│   └── index.ts
└── api/                  # 🌐 Backend API calls
    ├── user.api.server.ts
    ├── user.api.client.ts
    └── index.ts
```

---

## 🎯 Categories

### 🔐 Auth Services (`auth/`)

**Purpose:** Handle user authentication and authorization

**Files:**
- `login.action.ts` - Login with email/password, set auth cookies
- `register.action.ts` - Register new user, set auth cookies
- `logout.action.ts` - Logout user, clear auth cookies

**Used by:**
- Login form (`/components/login/login-form.tsx`)
- Register form (`/components/register/register-form.tsx`)
- User menu (`/components/UserMenu.tsx`)

**Example:**
```typescript
import { loginAction, registerAction, logoutAction } from '@/src/app/services/auth';
```

---

### 👤 Profile Services (`profile/`)

**Purpose:** Manage user profile data

**Files:**
- `get-profile.action.ts` - Fetch user profile data
- `update-profile-info.action.ts` - Update profile (name, bio, phone, avatar)
- `upload-avatar.action.ts` - Upload profile avatar image

**Used by:**
- Profile page (`/app/profile/page.tsx`)
- Profile components (`/components/profile/`)

**Example:**
```typescript
import { getProfileAction, updateProfileInfoAction } from '@/src/app/services/profile';
```

---

### 🌐 API Services (`api/`)

**Purpose:** Low-level HTTP calls to backend API

**Files:**
- `user.api.server.ts` - Server-side API calls (with cookies)
- `user.api.client.ts` - Client-side API calls (with credentials)

**Server API Functions:**
- `checkAuthServer()` - Verify auth status
- `getProfileServer()` - Get profile data
- `updateProfileServer()` - Update profile
- `loginServer()` - Login API call
- `registerServer()` - Register API call
- `logoutServer()` - Logout API call
- `uploadAvatarServer()` - Upload avatar file

**Client API Functions:**
- `checkAuthClient()` - Client-side auth check

**Used by:**
- Server Actions (`auth/`, `profile/`)
- Auth Provider (`/providers/AuthProvider.tsx`)

**Example:**
```typescript
import { loginServer, checkAuthClient } from '@/src/app/services/api';
```

---

## 📊 Import Hierarchy

```
Components/Pages
     ↓
Server Actions (auth/, profile/)
     ↓
API Services (api/)
     ↓
Backend API
```

**Example Flow:**

```typescript
// 1. Component calls server action
LoginForm → loginAction()

// 2. Action calls API service
loginAction() → loginServer()

// 3. API service makes HTTP request
loginServer() → fetch('http://backend/api/login')
```

---

## 🔄 Before vs After

### **Before (Actions scattered across routes)**

```
app/
├── login/actions/login.action.ts
├── register/actions/register.action.ts
├── auth/actions/logout.action.ts
├── profile/actions/
│   ├── get-profile.action.ts
│   ├── update-profile-info.action.ts
│   └── upload-avatar.action.ts
└── services/
    ├── user.service.server.ts
    └── user.service.client.ts
```

**Problems:**
- ❌ Actions scattered across different routes
- ❌ Hard to find related functionality
- ❌ Inconsistent import paths
- ❌ No clear organization

---

### **After (Centralized by category)**

```
app/services/
├── auth/                 # All auth actions
│   ├── login.action.ts
│   ├── register.action.ts
│   └── logout.action.ts
├── profile/              # All profile actions
│   ├── get-profile.action.ts
│   ├── update-profile-info.action.ts
│   └── upload-avatar.action.ts
└── api/                  # All API calls
    ├── user.api.server.ts
    └── user.api.client.ts
```

**Benefits:**
- ✅ All related services in one place
- ✅ Easy to find and maintain
- ✅ Consistent import paths
- ✅ Clear organization by feature

---

## 💡 Usage Guide

### **Importing Services**

#### **✅ Import from category (Recommended)**

```typescript
// Auth services
import { loginAction, registerAction } from '@/src/app/services/auth';

// Profile services
import { getProfileAction, updateProfileInfoAction } from '@/src/app/services/profile';

// API services
import { loginServer, checkAuthClient } from '@/src/app/services/api';
```

#### **✅ Import from main barrel (Also good)**

```typescript
import { 
  loginAction, 
  getProfileAction,
  checkAuthClient 
} from '@/src/app/services';
```

#### **❌ Don't import from individual files**

```typescript
// DON'T do this
import { loginAction } from '@/src/app/services/auth/login.action';
```

---

### **Adding a New Service**

#### **1. Choose the right category**

- **Auth?** → `services/auth/`
- **Profile?** → `services/profile/`
- **New feature?** → Create `services/{feature}/`
- **API call?** → `services/api/`

#### **2. Create the service file**

```typescript
// services/profile/delete-account.action.ts
'use server';

export async function deleteAccountAction() {
  // Implementation
}
```

#### **3. Export from category barrel**

```typescript
// services/profile/index.ts
export { getProfileAction } from './get-profile.action';
export { updateProfileInfoAction } from './update-profile-info.action';
export { deleteAccountAction } from './delete-account.action'; // Add this
```

#### **4. (Optional) Export from main barrel**

```typescript
// services/index.ts
export * from './auth';
export * from './profile';  // Already includes all profile exports
export * from './api';
```

---

### **Creating a New Category**

```bash
# 1. Create directory
mkdir src/app/services/messaging

# 2. Create action files
touch src/app/services/messaging/send-message.action.ts
touch src/app/services/messaging/get-messages.action.ts

# 3. Create barrel export
touch src/app/services/messaging/index.ts
```

```typescript
// services/messaging/index.ts
export { sendMessageAction } from './send-message.action';
export { getMessagesAction } from './get-messages.action';
```

```typescript
// services/index.ts
export * from './auth';
export * from './profile';
export * from './messaging';  // Add new category
export * from './api';
```

---

## 📝 Conventions

### **Naming**

| Type | Pattern | Example |
|------|---------|---------|
| **Server Actions** | `{verb}{noun}.action.ts` | `login.action.ts`, `get-profile.action.ts` |
| **API Services** | `{resource}.api.{side}.ts` | `user.api.server.ts`, `user.api.client.ts` |
| **Directories** | Lowercase, feature name | `auth/`, `profile/`, `messaging/` |

### **File Structure**

```typescript
// Action file template
'use server';

import { someAPI } from '@/src/app/services/api';
import type { SomeState } from '@/src/types';

/**
 * Brief description
 * Used by: Component name
 */
export async function someAction(
  prevState: SomeState,
  formData: FormData
): Promise<SomeState> {
  // Implementation
}
```

---

## ✅ Benefits

### **1. Organization**

```typescript
// Before: Where's the logout action?
// Could be: /app/auth/actions? /app/services? /app/logout?

// After: Clear location
services/auth/logout.action.ts
```

### **2. Discoverability**

```bash
# Need auth-related service?
ls src/app/services/auth/

# Need profile-related service?
ls src/app/services/profile/
```

### **3. Maintainability**

```typescript
// All related functionality in one place
services/auth/
  ├── login.action.ts
  ├── register.action.ts
  └── logout.action.ts

// Easy to understand: "These handle authentication"
```

### **4. Scalability**

```bash
# Adding new features is straightforward
services/
├── auth/           # Existing
├── profile/        # Existing
├── messaging/      # New feature
├── notifications/  # New feature
└── api/           # Existing
```

---

## 🎯 Summary

**All services are now:**

✅ **Centralized** - One place for all services  
✅ **Categorized** - Organized by feature  
✅ **Consistent** - Same import pattern everywhere  
✅ **Scalable** - Easy to add new categories  
✅ **Maintainable** - Clear structure and naming  

**Import from:**
```typescript
import { ... } from '@/src/app/services/auth';
import { ... } from '@/src/app/services/profile';
import { ... } from '@/src/app/services/api';
// Or
import { ... } from '@/src/app/services';
```
