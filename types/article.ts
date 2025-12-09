import { IUser } from "./user";

export interface IArticle {
  id: number;
  title: string;
  slug: string;
  content?: string; // HTML
  featuredImage?: string;
  category?: string; // slug of category
  isPublished?: boolean;
  userId?: string; // UUID
  user?: IUser;
  publishedAt?: string;
}
