// Deno 类型声明（仅用于本地 IDE 类型检查）
// Supabase Edge Functions 运行在 Deno 运行时中
// 此文件声明 Deno 全局命名空间，避免本地 TypeScript 报错

declare const Deno: {
  env: {
    get(key: string): string | undefined
  }
  serve(handler: (req: Request) => Response | Promise<Response>): void
}

declare module 'https://deno.land/std@0.168.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void
}
