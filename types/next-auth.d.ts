import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string;
      credits?: number;
    };
  }

  interface JWT {
    userId?: string;
    plan?: string;
    credits?: number;
  }
}