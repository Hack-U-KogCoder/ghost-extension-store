import { KVNamespace, DurableObjectNamespace, D1Database } from "@cloudflare/workers-types";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: import("$lib/server/auth").SessionValidationResult["user"];
      session: import("$lib/server/auth").SessionValidationResult["session"];
    };
    interface Platform {
      env?: {
        YOUR_KV_NAMESPACE: KVNamespace;
        YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
        DB: D1Database,
      };
    }
  }
}

export {};
