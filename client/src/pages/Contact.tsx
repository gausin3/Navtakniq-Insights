import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { useSubmitContact } from "@/hooks/use-contact";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const submitMutation = useSubmitContact();
  
  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: ""
    }
  });

  const onSubmit = (data: InsertContactMessage) => {
    submitMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "Thank you for reaching out. We will get back to you soon.",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-20 bg-secondary/10 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
          >
            Get in Touch
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your data transformation journey? 
            Contact us for a consultation or to learn more about our services.
          </p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-display font-bold text-white mb-8">Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Headquarters</h3>
                  <p className="text-muted-foreground">
                    123 Tech Boulevard, Suite 500<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                  <p className="text-muted-foreground">
                    Consulting: hello@navtakniq.com<br />
                    Support: support@navtakniq.com<br />
                    Careers: careers@navtakniq.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                  <p className="text-muted-foreground">
                    +1 (555) 123-4567<br />
                    Mon-Fri from 9am to 6pm PST
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
              <h3 className="text-xl font-bold text-white mb-2">Looking for support?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is available 24/7 for existing enterprise clients.
              </p>
              <button className="text-primary font-semibold hover:text-white transition-colors">
                Visit Support Portal →
              </button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary/30 p-8 md:p-12 rounded-3xl border border-white/5"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-8">Send a Message</h2>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Full Name</label>
                  <input
                    {...form.register("name")}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/20"
                    placeholder="John Doe"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email Address</label>
                  <input
                    {...form.register("email")}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/20"
                    placeholder="john@company.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Company</label>
                <input
                  {...form.register("company")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/20"
                  placeholder="Company Name Ltd."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Message</label>
                <textarea
                  {...form.register("message")}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/20 resize-none"
                  placeholder="How can we help you?"
                />
                {form.formState.errors.message && (
                  <p className="text-xs text-red-400">{form.formState.errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
