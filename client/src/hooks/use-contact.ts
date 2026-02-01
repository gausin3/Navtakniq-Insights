import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertContactMessage } from "@shared/schema";

/**
 * Hook to submit contact form data.
 * Handles API request and error parsing.
 * @returns Mutation object for submitting the form.
 */
export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const validated = api.contact.submit.input.parse(data);
      const res = await fetch(api.contact.submit.path, {
        method: api.contact.submit.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.contact.submit.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to submit message');
      }
      return api.contact.submit.responses[200].parse(await res.json());
    },
  });
}

/**
 * Hook to fetch contact messages.
 * @returns Query object for fetching messages.
 */
export function useContactMessages() {
  return useQuery({
    queryKey: ['/api/contact'],
    queryFn: async () => {
      const res = await fetch(api.contact.list.path);
      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }
      return api.contact.list.responses[200].parse(await res.json());
    },
  });
}
