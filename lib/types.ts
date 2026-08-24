export type ContentType = "article" | "note" | "film" | "place";
export type PublicationStatus = "draft" | "published";
export type Category = { id: number; name: string; slug: string; description: string; color: string };
export type Tag = { id: number; name: string; slug: string };
export type MediaItem = { id: number; objectKey: string; fileName: string; mimeType: string; size: number; altText: string; caption: string; createdAt: string; url: string; usageCount?: number };
export type ContentItem = {
  id: number; type: ContentType; title: string; slug: string; subtitle: string; excerpt: string; bodyHtml: string; status: PublicationStatus;
  categoryId: number | null; categoryName: string | null; categorySlug: string | null; categoryColor: string | null; authorId: string | null; authorName: string | null;
  featuredImageId: number | null; featuredImageUrl: string | null; featuredImageAlt: string | null; featuredImageMime: string | null; galleryJson: string; fieldsJson: string; seoTitle: string; seoDescription: string;
  socialImageId: number | null; featured: number | boolean; publishedAt: string | null; createdAt: string; updatedAt: string; tags?: Tag[];
};
export type ContentInput = Pick<ContentItem, "type" | "title" | "slug" | "subtitle" | "excerpt" | "bodyHtml" | "status" | "categoryId" | "galleryJson" | "fieldsJson" | "seoTitle" | "seoDescription"> & { featuredImageId: number | null; socialImageId: number | null; featured: boolean; tagIds: number[] };
