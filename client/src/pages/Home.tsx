import { motion } from "framer-motion";
import { Database, ShieldCheck, FileCheck, Bot, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { ServiceCard } from "@/components/ServiceCard";
import { usePosts } from "@/hooks/use-posts";

/**
 * Home Page Component.
 * Landing page featuring Hero section, Services preview, and latest insights.
 */
export default function Home() {
  const { data: posts } = usePosts();
  const featuredPosts = posts?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/90 z-10" />
          {/* Using a tech-abstract pattern as placeholder for video */}
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-30 animate-pulse"
            style={{ animationDuration: '10s' }}
          />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] z-10" />
        </div>

        <div className="container mx-auto px-4 z-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground">Future of Data Intelligence</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8">
              A New <br />
              <span className="text-gradient-primary">Perspective</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
              We transform complex data landscapes into clear strategic advantages.
              Specializing in Master Data Management, Governance, and AI-driven Automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:bg-cyan-400 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(45,212,191,0.3)]">
                  Book a Consultation
                </button>
              </Link>
              <Link href="/services">
                <button className="px-8 py-4 rounded-full bg-white/5 text-white font-semibold text-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm flex items-center gap-2">
                  Explore Services <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-32 relative bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Our Core Pillars
            </h2>
            <p className="text-muted-foreground text-lg">
              We provide comprehensive development and support services across the entire data lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              title="Master Data Management"
              description="Create a single source of truth. We architect robust MDM solutions that unify your critical business data."
              icon={Database}
              delay={0.1}
            />
            <ServiceCard
              title="Data Quality"
              description="Ensure accuracy and consistency. Our automated frameworks detect and resolve anomalies in real-time."
              icon={ShieldCheck}
              delay={0.2}
            />
            <ServiceCard
              title="Data Governance"
              description="Secure and compliant data policies. We establish frameworks that protect assets while enabling access."
              icon={FileCheck}
              delay={0.3}
            />
            <ServiceCard
              title="AI Automation"
              description="Intelligent workflows. Leverage machine learning to automate complex data processes and decision making."
              icon={Bot}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Featured Insights */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Latest Insights
              </h2>
              <p className="text-muted-foreground">Thinking and trends from our experts.</p>
            </div>
            <Link href="/blog">
              <button className="hidden md:flex items-center text-primary font-semibold hover:text-cyan-400 transition-colors">
                View all articles <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.length > 0 ? (
              featuredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group cursor-pointer">
                  <div className="aspect-[16/10] overflow-hidden rounded-xl mb-6 bg-secondary/50">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-3 text-sm text-primary">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span>Insights</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.summary}
                  </p>
                </Link>
              ))
            ) : (
              // Empty state skeletons
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/10] rounded-xl bg-secondary mb-6" />
                  <div className="h-4 w-24 bg-secondary rounded mb-4" />
                  <div className="h-8 w-full bg-secondary rounded mb-4" />
                  <div className="h-4 w-full bg-secondary/50 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-secondary/50 rounded" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
            Ready to transform your data?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Let's discuss how our expertise in MDM and AI can drive your business forward.
          </p>
          <Link href="/contact">
            <button className="px-10 py-5 rounded-full bg-white text-background font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl">
              Get in Touch
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
