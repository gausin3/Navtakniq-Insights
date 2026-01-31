import { motion } from "framer-motion";
import { Database, ShieldCheck, FileCheck, Bot, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

/**
 * Services Listing Page.
 * Detials the core offerings of the company.
 */
export default function Services() {
  const features = [
    "Enterprise Architecture Design",
    "Solution Implementation",
    "24/7 Production Support",
    "Performance Optimization",
    "Migration & Upgrades",
    "Staff Augmentation"
  ];

  const services = [
    {
      id: "mdm",
      title: "Master Data Management",
      description: "Establish a single, trusted view of your critical business data across the enterprise.",
      icon: Database,
      details: "We implement robust MDM solutions using industry-leading platforms (Informatica, Tibco, Semarchy). Our approach ensures data consistency, removes duplicates, and creates a golden record for customers, products, and assets."
    },
    {
      id: "dq",
      title: "Data Quality",
      description: "Proactive data profiling, cleansing, and monitoring to ensure actionable insights.",
      icon: ShieldCheck,
      details: "Bad data costs businesses millions. Our automated data quality frameworks continuously monitor your data health, applying cleansing rules and validation logic to prevent errors before they impact downstream systems."
    },
    {
      id: "dg",
      title: "Data Governance",
      description: "Frameworks for data security, compliance, and democratization.",
      icon: FileCheck,
      details: "We help you define policies, roles, and responsibilities. Our governance solutions ensure you meet regulatory compliance (GDPR, CCPA) while enabling secure data access for analytics and business users."
    },
    {
      id: "ai",
      title: "AI Automation",
      description: "Next-generation process automation powered by machine learning.",
      icon: Bot,
      details: "Transform manual workflows with intelligent automation. We build custom AI agents that can classify documents, predict trends, and automate decision-making processes with human-in-the-loop validation."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-20 md:py-32 bg-secondary/10 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Comprehensive data solutions tailored to your enterprise needs.
            From strategy to implementation and ongoing support.
          </motion.p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center bg-secondary/20 p-8 md:p-12 rounded-3xl border border-white/5 hover:border-primary/30 transition-colors"
            >
              <div className="md:col-span-5 order-2 md:order-1">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-display font-bold text-white mb-4">{service.title}</h3>
                <p className="text-lg text-white/80 mb-6">{service.description}</p>
                <p className="text-muted-foreground leading-relaxed mb-8">{service.details}</p>

                <Link href="/contact">
                  <button className="text-primary font-semibold hover:text-cyan-400 flex items-center gap-2 transition-colors">
                    Consult on {service.title} <span className="text-xl">→</span>
                  </button>
                </Link>
              </div>

              <div className="md:col-span-7 order-1 md:order-2 h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden relative group">
                {/* Abstract visualization for each service */}
                <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 group-hover:scale-105 transition-transform duration-700`} />
                <div className="absolute inset-0 backdrop-blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-grid-white/[0.05]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Why Choose Navtakniq?</h2>
            <p className="text-muted-foreground">We deliver end-to-end value across the data lifecycle.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-background border border-white/5 hover:border-primary/50 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-white font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
