// Enums matching Prisma schema
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum AccountStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  WARMING_UP = 'WARMING_UP',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  ERROR = 'ERROR',
}

export enum VideoStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
  DELETED = 'DELETED',
}

export enum JobStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RETRY = 'RETRY',
}

export enum ProxyType {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  SOCKS5 = 'SOCKS5',
}

// Core Models
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  status: AccountStatus;
  proxyId?: string;
  cookies?: any;
  userDataDir?: string;
  lastLoginAt?: string;
  accountAge?: string;
  followerCount: number;
  isWarmedUp: boolean;
  postsToday: number;
  lastPostAt?: string;
  dailyPostLimit: number;
  failedAttempts: number;
  lastFailedAt?: string;
  isBanned: boolean;
  bannedAt?: string;
  bannedReason?: string;
  createdAt: string;
  updatedAt: string;
  proxy?: Proxy;
}

export interface Video {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  duration?: number;
  localPath: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  tags: string[];
  status: VideoStatus;
  uploadedAt: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  accountId: string;
  videoId: string;
  priority: number;
  scheduledFor?: string;
  attemptCount: number;
  maxAttempts: number;
  status: JobStatus;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  error?: string;
  errorStack?: string;
  captchaSolved: boolean;
  captchaAttempts: number;
  logs: any[];
  screenshots: string[];
  bullJobId?: string;
  createdAt: string;
  updatedAt: string;
  account?: Account;
  video?: Video;
}

export interface Proxy {
  id: string;
  host: string;
  port: number;
  username?: string;
  protocol: ProxyType;
  country?: string;
  isActive: boolean;
  lastChecked?: string;
  failCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostHistory {
  id: string;
  accountId: string;
  videoTitle?: string;
  postedAt: string;
  success: boolean;
  error?: string;
  duration?: number;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface CreateAccountRequest {
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  proxyId?: string;
  dailyPostLimit?: number;
}

export interface BulkUploadResponse {
  success: number;
  failed: number;
  errors?: string[];
}

export interface CreateJobRequest {
  accountIds: string[];
  videoId: string;
  scheduledFor?: string;
  priority?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
