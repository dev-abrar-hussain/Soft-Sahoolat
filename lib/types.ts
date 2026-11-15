export type PostStatus = 'draft' | 'published';

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  seo_title: string;
  meta_description: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminUser = {
  id: number;
  username: string;
  must_change_password: number;
  last_login_at: string | null;
};

export type PostInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  seo_title?: string;
  meta_description?: string;
  status?: PostStatus;
  published_at?: string;
};

