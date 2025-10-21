## Better Auth: Email/password sign-in, sign-up, and sign-out (Next.js App Router)

This project integrates [Better Auth](https://www.better-auth.com) with Next.js (App Router), Drizzle ORM (Postgres), and a simple UI for sign-in/sign-up and sign-out. It includes:

- Email/password auth powered by Better Auth
- Postgres schema and Drizzle adapter
- Next.js API route handler for Better Auth
- Client SDK usage (useSession, signIn, signUp, signOut)
- Forms with React Hook Form + Zod validation
- Toaster feedback with `sonner`

Follow the steps below to replicate this setup in a new project.

---

## Stack

- **Next.js** 15 (App Router)
- **React** 19
- **Better Auth** ^1.3.x
- **Drizzle ORM** ^0.44.x with Postgres
- **Tailwind CSS** v4
- **React Hook Form** + **Zod**
- **sonner** (toasts)

---

## 1) Install dependencies

```bash
pnpm add better-auth drizzle-orm pg sonner zod @hookform/resolvers react-hook-form lucide-react
pnpm add -D drizzle-kit @types/pg tailwindcss @tailwindcss/postcss
```

If you use npm or yarn, adapt the commands accordingly.

---

## 2) Configure environment

Set your Postgres connection string:

```bash
setx DATABASE_URL "postgres://user:password@localhost:5432/dbname"
```

On macOS/Linux, use `export DATABASE_URL=...`.

---

## 3) Drizzle setup (database + schema)

Create a Drizzle database instance that reads `DATABASE_URL`:

```ts
// src/drizzle/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
```

Provide the auth tables Better Auth expects (user, session, account, verification). Example structure:

```ts
// src/drizzle/schema/auth-schema.ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

Run migrations (scripts available in `package.json`):

```bash
pnpm db:generate
pnpm db:migrate
# Optional tools:
pnpm db:studio
pnpm db:push
```

---

## 4) Better Auth server configuration

Configure Better Auth with the Drizzle adapter and Next.js cookies plugin:

```ts
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/drizzle/db";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  sessions: {
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  plugins: [nextCookies()],
  database: drizzleAdapter(db, { provider: "pg" }),
});
```

Expose handlers in the App Router:

```ts
// src/app/api/auth/[...all]/route.ts
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);
```

---

## 5) Client SDK

Create the client to use hooks and actions in your components:

```ts
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

---

## 6) Validation schemas

Forms use Zod for validation:

```ts
// src/utils/form-schemas.ts
import z from "zod";

export const signInFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }).min(1),
  password: z.string().min(6),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email({ message: "Email inválido" }).min(1),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
```

---

## 7) UI: Sign In and Sign Up

Both forms use React Hook Form + Zod, `sonner` for toasts, and call Better Auth via the client.

Sign In:

```tsx
// src/components/sign-in-form.tsx (excerpt)
await authClient.signIn.email(
  { ...data, callbackURL: "/" },
  {
    onError: (error) => {
      // Better Auth error shape: error.error?.message
    },
    onSuccess: () => router.push("/"),
  }
);
```

Sign Up:

```tsx
// src/components/sign-up-form.tsx (excerpt)
await authClient.signUp
  .email(
    { ...data },
    {
      onError: (error) => {
        // Better Auth error shape: error.error?.message
      },
    }
  )
  .then(() => {
    // show success toast
  });
```

Note: Avoid casting errors to `Error`. Prefer `error?.error?.message ?? "Erro desconhecido"`.

---

## 8) Auth UI pages

Login page with tabs for both forms:

```tsx
// src/app/auth/login/page.tsx (excerpt)
<Tabs defaultValue="signIn">
  <TabsList>
    <TabsTrigger value="signIn">Entrar</TabsTrigger>
    <TabsTrigger value="signUp">Criar conta</TabsTrigger>
  </TabsList>
  <TabsContent value="signIn">{/* <SignInForm /> */}</TabsContent>
  <TabsContent value="signUp">{/* <SignUpForm /> */}</TabsContent>
  {/* Cards and content omitted for brevity */}
</Tabs>
```

Global layout registers the toaster once:

```tsx
// src/app/layout.tsx (excerpt)
<html lang="pt-BR" className="dark">
  <body className="antialiased">
    <Toaster />
    {children}
  </body>
</html>
```

---

## 9) Using the session in the app and sign-out

Home page reads the session and offers sign-out:

```tsx
// src/app/page.tsx (excerpt)
const { data: session, isPending: loading } = authClient.useSession();

return (
  <div>
    {session === null ? (
      <SignInSignOutButton />
    ) : (
      <>
        <span>Bem-vindo, {session.user?.name}</span>
        <Button onClick={() => authClient.signOut()}>Sair</Button>
      </>
    )}
  </div>
);
```

The sign-in/sign-up entry point is a simple link button:

```tsx
// src/components/sign-in-sign-out-button.tsx (excerpt)
<Button asChild>
  <Link href="/auth/login">Entrar / Criar conta</Link>
</Button>
```

---

## 10) Run the app

```bash
pnpm dev
```

Open `http://localhost:3000`. Use the button to go to `/auth/login`, create an account, sign in, view the session on the home page, and sign out.

---

## 11) Troubleshooting

- TypeScript: If you see an error like “Conversion of type ... to type 'Error' may be a mistake…”, do not cast Better Auth errors to `Error`. Use optional chaining on Better Auth’s error shape: `error?.error?.message ?? "Erro desconhecido"`.
- Ensure `DATABASE_URL` is set and Postgres is reachable.
- Confirm the API route exists at `src/app/api/auth/[...all]/route.ts`.

---

## 12) Useful scripts

```bash
pnpm dev            # start dev server (Next.js)
pnpm build          # build
pnpm start          # start production server
pnpm db:generate    # generate migrations
pnpm db:migrate     # run migrations
pnpm db:studio      # open Drizzle studio
pnpm db:push        # push schema (optional)
```

---

That’s it—you now have sign-in, sign-up, and sign-out working end-to-end with Better Auth, Drizzle, and Next.js.
