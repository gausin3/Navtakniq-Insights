import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

export function ServiceCard({ title, description, icon: Icon, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-8 rounded-2xl bg-secondary/30 border border-white/5 hover:border-primary/50 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 group-hover:to-primary/10 transition-colors duration-500" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        
        <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>
        
        <div className="flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
          Learn more <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </motion.div>
  );
}
