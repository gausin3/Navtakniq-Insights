import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

/**
 * Custom hook to fetch blog posts from the API.
 * Uses React Query for caching and state management.
 * @returns Query object containing the list of blog posts.
 */
export function usePosts() {
  return useQuery({
    queryKey: [api.posts.list.path],
    queryFn: async () => {
      const res = await fetch(api.posts.list.path, { credentials: "include" });
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
