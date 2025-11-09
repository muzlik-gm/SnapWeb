// Core type definitions for SnapWeb

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  password_hash?: string;
  plan: 'free' | 'pro' | 'team';
  credits: number;
  total_screenshots: number;
  api_key?: string;
  stripe_customer_id?: string;
  subscription_id?: string;
  subscription_status?: string;
  subscription_end_date?: Date;
  preferences: {
    defaultFormat: 'png' | 'jpeg' | 'webp';
    defaultResolution: string;
    emailNotifications: boolean;
    secretPhrase?: string;
    customErrorImageUrl?: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface Screenshot {
  id: string;
  user_id?: string;
  url: string;
  filename: string;
  original_url: string;
  metadata: {
    width: number;
    height: number;
    fileSize: number;
    format: string;
    captureTime: number;
    deviceType: string;
  };
  settings: {
    format: string;
    quality?: number;
    fullPage: boolean;
    device: string;
  };
  status: 'pending' | 'completed' | 'failed';
  error_message?: string;
  downloads: number;
  is_public: boolean;
  expires_at: Date;
  created_at: Date;
}

export interface Payment {
  id: string;
  user_id: string;
  type: 'subscription' | 'credits';
  provider: 'stripe';
  provider_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  processed_at?: Date;
  created_at: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ApiUsage {
  id: string;
  user_id?: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time?: number;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// API Request/Response types
export interface ScreenshotRequest {
  url: string;
  device?: 'desktop' | 'tablet' | 'mobile';
  format?: 'png' | 'jpeg' | 'webp';
  fullPage?: boolean;
  quality?: number;
  delay?: number; // Delay in milliseconds to wait after page load (default: 2000)
}

export interface ScreenshotResponse {
  success: boolean;
  imageUrl?: string;
  metadata?: {
    width: number;
    height: number;
    fileSize: number;
    format: string;
    captureTime: number;
  };
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pricing and subscription types
export interface PricingTier {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
  stripePriceId?: string;
}

// Dashboard and analytics types
export interface UserStats {
  totalScreenshots: number;
  creditsRemaining: number;
  thisMonthScreenshots: number;
  popularScreenshots: Screenshot[];
}

// Blog and content types
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  tags: string[];
  featured?: boolean;
}

// Device configurations for screenshots
export interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
  userAgent: string;
}

// Rate limiting types
export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}