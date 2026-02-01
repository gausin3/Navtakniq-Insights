import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

/**
 * Custom hook to fetch blog posts from the API.
 * Uses React Query for caching and state management.
 * @returns Query object containing the list of blog posts.
 */
export function usePosts(publishedOnly?: boolean) {
  return useQuery({
    queryKey: [api.posts.list.path, publishedOnly],
    queryFn: async () => {
      const url = new URL(api.posts.list.path, window.location.origin);
      if (publishedOnly) {
        url.searchParams.append("published", "true");
      }
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return api.posts.list.responses[200].parse(await res.json());
    },
  });
}

/**
 * Custom hook to fetch a single blog post by slug.
 * @param slug - The unique slug of the blog post.
 * @returns Query object containing the blog post details.
 */
export function usePost(slug: string) {
  return useQuery({
    queryKey: [api.posts.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.posts.get.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch post");
      return api.posts.get.responses[200].parse(await res.json());
    },
  });
}

/**
 * Custom hook to create a new blog post.
 * @returns Mutation object to create a post.
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: any) => {
      const res = await fetch(api.posts.list.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
    },
  });
}

/**
 * Custom hook to update an existing blog post.
 * @returns Mutation object to update a post.
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<any>) => {
      const res = await fetch(`${api.posts.list.path}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
    },
  });
}

/**
 * Custom hook to delete a blog post.
 * @returns Mutation object to delete a post.
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${api.posts.list.path}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
    },
  });
}

/**
 * Custom hook to fetch uploaded images from the API.
 * @returns Query object containing the list of images.
 */
export function useImages() {
  return useQuery({
    queryKey: ["/api/images"],
    queryFn: async () => {
      const res = await fetch("/api/images");
      if (!res.ok) throw new Error("Failed to fetch images");
      return res.json();
    },
  });
}

/**
 * Custom hook to upload an image.
 * @returns Mutation object to upload an image.
 */
export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
    },
  });
}
