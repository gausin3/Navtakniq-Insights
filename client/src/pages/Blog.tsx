import { usePosts } from "@/hooks/use-posts";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Blog() {
  const { data: posts, isLoading } = usePosts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-20 md:py-32 bg-secondary/10 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
          >
            Insights
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep dives into data strategy, governance frameworks, and the future of AI automation.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full flex flex-col">
                  <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-6 bg-secondary relative">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4 text-sm text-primary">
                      <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        Article
                      </span>
                      <span className="text-muted-foreground">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                      {post.summary}
                    </p>
                  </div>
                  
                  <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors flex items-center gap-2 mt-auto">
                    Read Article <span className="text-lg">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>No articles published yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
