import { usePost } from "@/hooks/use-posts";
import { useRoute } from "wouter";
import ReactMarkdown from "react-markdown";
import { Loader2, ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

/**
 * Individual Blog Post Page.
 * Renders the markdown content of a specific blog post based on the slug.
 */
export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const { data: post, isLoading, isError } = usePost(params?.slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Post not found</h1>
        <Link href="/blog">
          <button className="text-primary hover:underline">Back to Insights</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <article className="container max-w-4xl mx-auto px-4">
        <Link href="/blog">
          <button className="flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
          </button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Navtakniq Team
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-12 bg-secondary border border-white/5">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-primary prose-img:rounded-xl">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
            <div className="text-white font-semibold">Share this article</div>
            <button className="p-3 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
