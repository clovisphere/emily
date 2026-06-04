# AGENTS.md

## Purpose

This document defines the engineering standards and expectations for contributors and AI agents working in this codebase.

The primary goals are:

1. Simplicity (KISS)
2. Maintainability
3. Readability
4. Type Safety
5. Consistency
6. DRY (Don't Repeat Yourself)

When making changes, prefer code that is easy to understand over code that is clever.

---

# Core Principles

## Keep It Simple (KISS)

Always choose the simplest solution that correctly solves the problem.

### Preferred

```ts
if (!user) {
  return null;
}
```

### Avoid

```ts
return user ? user : null;
```

or

```ts
return user ?? null;
```

when a simple conditional is clearer.

Code is read far more often than it is written.

---

## DRY (Don't Repeat Yourself)

Avoid duplicating logic.

If the same logic appears more than once, consider extracting it into:

* Utility functions
* Services
* Shared types
* Reusable middleware

Do not create abstractions prematurely.

Rule of thumb:

* First occurrence: write it.
* Second occurrence: notice it.
* Third occurrence: extract it.

---

## Readability Over Cleverness

Write code that a new team member can understand quickly.

### Preferred

```ts
const isAdmin = user.role === "admin";
```

### Avoid

```ts
const isAdmin = !!~roles.indexOf("admin");
```

Avoid tricks, hacks, and compressed expressions.

---

# TypeScript Standards

## Avoid `any`

Do not introduce `any` unless absolutely necessary.

### Preferred

```ts
type CreateUserInput = {
  username: string;
  email: string;
};
```

### Avoid

```ts
const createUser = (data: any) => {};
```

Use:

* interfaces
* type aliases
* generics
* inferred types

before considering `any`.

---

## Prefer Explicit Types for Public APIs

Public functions should clearly communicate intent.

```ts
export const getUserById = async (
  id: string
): Promise<User | null> => {};
```

---

## Use Type Inference Internally

Avoid unnecessary type noise.

### Preferred

```ts
const users = await getUsers();
```

### Avoid

```ts
const users: User[] = await getUsers();
```

when TypeScript can infer the type.

---

## Prefer Union Types Over Enums

### Preferred

```ts
type UserRole = "admin" | "user";
```

### Avoid

```ts
enum UserRole {
  Admin,
  User,
}
```

unless enum behavior is specifically required.

---

# Architecture

## Single Responsibility

Each module should have one reason to change.

Examples:

* Controllers handle HTTP requests.
* Services contain business logic.
* Repositories handle persistence.
* Middleware handles cross-cutting concerns.

Do not mix responsibilities.

---

## Thin Controllers

Controllers should coordinate.

They should not contain business logic.

### Preferred

```ts
export const getUser = async (
  req: Request,
  res: Response
) => {
  const user = await userService.getById(req.params.id);

  return res.json(user);
};
```

### Avoid

Large controllers containing validation, business logic, and database operations.

---

## Keep Functions Small

Aim for functions that fit on one screen.

If a function requires scrolling to understand, consider extracting smaller units.

---

# Database Access

## Centralize Queries

Database access should live in dedicated repositories/models/services.

Avoid scattering queries throughout the application.

### Preferred

```ts
await userRepository.findByEmail(email);
```

### Avoid

```ts
await UserModel.findOne({ email });
```

inside controllers.

---

## Select Only Required Data

Do not fetch fields that are not needed.

Use projections and field selection where appropriate.

---

# Error Handling

## Fail Clearly

Errors should explain what happened.

### Preferred

```ts
throw new Error("User not found");
```

### Avoid

```ts
throw new Error("Something went wrong");
```

---

## Do Not Swallow Errors

### Avoid

```ts
try {
  await save();
} catch {}
```

Always handle, log, or rethrow.

---

# Naming

## Use Descriptive Names

### Preferred

```ts
getUserByEmail
createSessionToken
deleteUserById
```

### Avoid

```ts
get
create
handleStuff
doWork
```

Names should explain intent.

---

## Boolean Variables

Boolean variables should read naturally.

### Preferred

```ts
isAuthenticated
hasPermission
canDelete
```

### Avoid

```ts
auth
permission
deleteFlag
```

---

# Imports

Prefer named exports.

### Preferred

```ts
export const getUser = () => {};
```

```ts
import { getUser } from "./users";
```

Avoid default exports unless there is a strong reason.

---

# Comments

Code should be obvious. If it needs a comment to be understood, consider renaming or restructuring first.

Only comment what cannot be made clear through code alone — hidden constraints, non-obvious behavior, or deliberate decisions that would otherwise look like mistakes.

### Avoid

```ts
// Increment count
count++;
```

```ts
// Find user by email
const user = await getUserByEmail(email);
```

These comments restate what the code already says.

### Prefer

```ts
// select: false prevents these fields from being returned in queries by default
password: { type: String, required: true, select: false },
```

```ts
// bcrypt produces its own salt — storing separately for legacy compatibility
const salt = await bcrypt.genSalt();
```

Before writing a comment, ask: *can I make the code say this instead?*

---

# Dependencies

Before adding a dependency, ask:

1. Can the platform do this already?
2. Can existing code do this already?
3. Is the dependency worth its maintenance cost?

Prefer fewer dependencies.

---

# Testing Mindset

New code should be written to be testable.

Prefer:

* Pure functions
* Dependency injection
* Small units of behavior

Avoid tightly coupled code.

---

# Refactoring Rule

When touching existing code:

1. Leave it cleaner than you found it.
2. Reduce complexity when practical.
3. Remove dead code.
4. Improve naming where beneficial.
5. Do not perform unrelated refactors in the same change.

---

# Decision Framework

When multiple solutions exist, prefer the one that is:

1. Easier to understand
2. Easier to maintain
3. Easier to test
4. More type-safe
5. Less code

Simple code wins.
