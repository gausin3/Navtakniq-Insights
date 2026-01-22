import { Link } from "wouter";
import { Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-primary to-cyan-400" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Navtakniq
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering enterprises with intelligent data solutions and AI automation.
              A new perspective on digital transformation.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary transition-colors">Master Data Management</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Data Quality</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Data Governance</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">AI Automation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Insights</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Connect</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              info@navtakniq.com<br />
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Navtakniq. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
