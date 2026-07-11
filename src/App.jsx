import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  Building2,
  CheckCircle2,
  Copy,
  Cpu,
  FileX2,
  GraduationCap,
  KeyRound,
  Menu,
  Network,
  Printer,
  ShieldCheck,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Security", href: "#security" },
  { label: "About Us", href: "#about-us" },
];

const clientTypes = [
  { label: "Colleges", icon: GraduationCap },
  { label: "Workspaces", icon: Building2 },
  { label: "Businesses", icon: Users },
];

const problemPoints = [
  "Broken printers interrupt daily workflows",
  "Long queues build up during peak hours",
  "Public networks expose sensitive documents",
  "Maintenance costs keep climbing",
];

const serviceModels = [
  {
    title: "Direct Kiosk Purchase.",
    subtitle: "Own your print infrastructure",
    body: "Buy the VaultPrint machine outright for complete ownership of your printing infrastructure. Ideal for high-volume environments that want long-term ROI.",
    icon: Banknote,
    highlights: ["Capex-friendly", "Full ownership", "Best for heavy usage"],
  },
  {
    title: "Subscription Model (Hardware-as-a-Service).",
    subtitle: "Deploy without upfront hardware cost",
    body: "Zero upfront hardware costs. Pay a predictable monthly subscription that covers the kiosk, software updates, and maintenance.",
    icon: Wrench,
    highlights: ["Zero upfront hardware", "Software updates included", "Maintenance covered"],
  },
];

const securityPoints = [
  {
    title: "Bank-Level Security",
    body: "AES-256 end-to-end encryption for every document.",
    icon: ShieldCheck,
  },
  {
    title: "Zero-Trace Printing",
    body: "Files are strictly treated as private by default and are permanently wiped from the queue immediately after printing.",
    icon: FileX2,
  },
  {
    title: "Verified Fulfillment",
    body: "Secure pickup token flow ensures documents only end up in the right hands.",
    icon: KeyRound,
  },
];

const founders = [
  {
    name: "Atharva Shrivastava",
    role: "Co-Founder & Operations Lead",
    image: "/founder-operations-lead.png",
    bio: "Engineering student at BIT Mesra and operational powerhouse. Specializing in hardware-to-web-app integration and workflow automation, Atharva leads the development and deployment of VaultPrint kiosks. He recently led the team to secure the prestigious Launchpad Grant.",
  },
  {
    name: "Satyam Pandey",
    role: "Co-Founder & Strategy Lead",
    image: "/founder-strategy-lead.png",
    bio: "Chemical Engineering student at BIT Mesra with a strong background in corporate strategy and non-profit leadership. Satyam brings expertise in data analytics, problem-solving frameworks, and scaling operations to ensure VaultPrint's sustainable growth.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SectionHeader({ eyebrow, title, body, align = "center" }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn("mx-auto max-w-3xl", align === "center" ? "text-center" : "text-left")}
    >
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#22E3B9]">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
      {body ? <p className="mt-5 text-base leading-relaxed text-slate-300 md:text-lg">{body}</p> : null}
    </motion.div>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 py-3 sm:px-5">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-white/15 bg-white/[0.07] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl backdrop-saturate-150 sm:px-5 lg:px-6">
        <a
          href="#top"
          aria-current="page"
          className="flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22E3B9]"
        >
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white p-0.5 ring-1 ring-white/20">
            <img src="/vaultprint-logo-mark.png" alt="" className="h-full w-full rounded-lg object-cover" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-white">VaultPrint</span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border-b border-transparent py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22E3B9]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden rounded-lg bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#2563EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22E3B9] lg:inline-flex"
        >
          Contact Sales
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white transition hover:border-white/25 hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22E3B9] lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/15 bg-[#07111f]/90 px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl backdrop-saturate-150 lg:hidden">
          <div className="grid gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-lg bg-[#3B82F6] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Contact Sales
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function KioskVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-lg"
    >
      <div className="absolute -inset-5 rounded-[2rem] bg-[radial-gradient(circle_at_50%_35%,rgba(34,227,185,0.18),transparent_62%)]" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]/82 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.36),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-sm font-semibold text-white">VaultPrint Kiosk</p>
            <p className="mt-1 text-xs text-slate-400">Self-service print and photocopy station</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22E3B9]/20 bg-[#22E3B9]/10 px-2.5 py-1 text-xs font-semibold text-[#22E3B9]">
            <CheckCircle2 className="h-3 w-3" />
            Online
          </span>
        </div>

        <div className="grid gap-5 pt-5 sm:grid-cols-[0.82fr_1.18fr]">
          <div className="relative mx-auto flex h-[360px] w-44 flex-col items-center">
            <div className="z-10 w-36 rounded-t-2xl border border-white/10 bg-slate-950 p-3 shadow-xl">
              <div className="rounded-xl border border-[#22E3B9]/20 bg-[#071827] p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="h-2 w-2 rounded-full bg-[#22E3B9]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Ready</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-[#22E3B9]/45" />
                  <div className="h-2 w-2/3 rounded-full bg-white/20" />
                  <div className="h-2 w-4/5 rounded-full bg-white/15" />
                </div>
              </div>
            </div>

            <div className="z-10 mt-2 flex w-40 flex-1 flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-slate-800 to-slate-950 p-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <Printer className="h-7 w-7 text-[#22E3B9]" />
                <p className="mt-3 text-xs font-semibold text-white">Print and Copy</p>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/10" />
              <div className="mt-2 h-2 w-2/3 rounded-full bg-white/10" />
              <div className="mt-auto rounded-lg border border-white/10 bg-black/30 p-2">
                <div className="h-1.5 rounded-full bg-slate-500" />
              </div>
            </div>
            <div className="h-4 w-48 rounded-b-[2rem] bg-black/50 blur-sm" />
          </div>

          <div className="grid content-center gap-3">
            {[
              ["Deployment", "Plug-in setup for campuses, workspaces, and offices", Network],
              ["Operations", "Remote monitoring, updates, and maintenance", Cpu],
              ["Output", "2D paper printing and photocopying without staff bottlenecks", Copy],
            ].map(([title, body, Icon]) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#22E3B9]/10 text-[#22E3B9]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="hero-grid relative overflow-hidden bg-[linear-gradient(135deg,#05070B_0%,#080B12_54%,#0E1424_100%)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,0.2),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(34,227,185,0.16),transparent_28%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#05070B]" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-4 pb-12 pt-28 sm:px-6 lg:grid-cols-[0.98fr_1.02fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-[44rem]"
        >
          <h1 className="font-display text-4xl font-semibold leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-[4.25rem]">
            Put secure printing on autopilot.
          </h1>
          <p className="mt-5 max-w-[39rem] text-lg leading-relaxed text-slate-300 md:text-xl">
            VaultPrint installs self-service print and photocopy kiosks for campuses, workspaces, and businesses,
            with effortless deployment, bank-level security, and zero maintenance headaches.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#2563EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22E3B9]"
            >
              Explore Kiosk Models
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22E3B9]"
            >
              Talk to Us
            </a>
          </div>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {clientTypes.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
                  <Icon className="h-5 w-5 text-[#22E3B9]" />
                  <p className="mt-2 text-sm font-semibold text-white">{item.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <KioskVisual />
      </div>
    </section>
  );
}

function ProblemSolutionSection() {
  return (
    <section className="bg-[#05070B] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="rounded-2xl border border-red-400/15 bg-red-400/[0.035] p-7 md:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-300">The Problem</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Traditional printing is a hassle.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-300">
              Campuses and offices are plagued by broken printers, long queues, unsecure public networks, and
              expensive maintenance.
            </p>
            <div className="mt-7 grid gap-3">
              {problemPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                  <span className="h-2 w-2 rounded-full bg-red-300" />
                  <p className="text-sm font-medium text-slate-200">{point}</p>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="rounded-2xl border border-[#22E3B9]/20 bg-[#22E3B9]/[0.045] p-7 md:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#22E3B9]">The Solution</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              VaultPrint eliminates the friction.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-300">
              Our automated hardware-software kiosks make 2D paper printing instant, seamless, and completely secure.
              Just plug it in, and we handle the rest.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ["Instant", Zap],
                ["Seamless", Cpu],
                ["Secure", ShieldCheck],
              ].map(([label, Icon]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <Icon className="h-5 w-5 text-[#22E3B9]" />
                  <p className="mt-3 text-sm font-semibold text-white">{label}</p>
                </div>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="bg-[#080B12] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Services"
          title="Two flexible ways to bring VaultPrint to your space."
          body="Choose ownership or hardware-as-a-service depending on budget, volume, and how quickly you want to deploy."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {serviceModels.map((model, index) => {
            const Icon = model.icon;
            return (
              <motion.article
                key={model.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
                className="rounded-2xl border border-white/10 bg-[#0B1220]/80 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] md:p-8"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold text-[#22E3B9]">{model.subtitle}</p>
                    <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
                      {model.title}
                    </h3>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#22E3B9]/10 text-[#22E3B9]">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <p className="mt-5 leading-relaxed text-slate-300">{model.body}</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {model.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-300"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  return (
    <section id="security" className="bg-[#05070B] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            align="left"
            eyebrow="Security"
            title="Privacy is not a feature. It is the product standard."
            body="VaultPrint is built for environments where documents are sensitive and trust matters: academic records, business contracts, applications, and internal paperwork."
          />

          <div className="grid gap-4">
            {securityPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.article
                  key={point.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                >
                  <div className="flex gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#22E3B9]/10 text-[#22E3B9]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{point.title}</h3>
                      <p className="mt-2 leading-relaxed text-slate-300">{point.body}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about-us" className="bg-[#080B12] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="About Us"
          title="Meet the founders building automated printing infrastructure."
          body="Our Vision: To redefine physical document output by building scalable, automated hardware-tech solutions that make printing instant, secure, and completely seamless."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {founders.map((founder, index) => (
            <motion.article
              key={founder.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
            >
              <div className="grid gap-0 sm:grid-cols-[0.42fr_0.58fr]">
                <div className="bg-white/[0.035] p-5">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="aspect-square w-full rounded-2xl border border-white/10 object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold text-[#22E3B9]">{founder.role}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{founder.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">{founder.bio}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="bg-[#05070B] py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(34,227,185,0.08))] p-8 text-center md:p-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#22E3B9]">Get VaultPrint</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Ready to deploy self-service printing in your space?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-300">
            Talk to us about kiosk placement, purchase options, subscription deployment, and support for your campus,
            workspace, or business.
          </p>
          <a
            href="mailto:contact@vaultprintpvtltd.online"
            aria-label="Contact VaultPrint sales by email"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:bg-[#2563EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22E3B9]"
          >
            Contact Sales
            <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white p-0.5">
            <img src="/vaultprint-logo-mark.png" alt="" className="h-full w-full rounded-lg object-cover" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-white">VaultPrint</p>
            <p className="text-sm text-slate-500">Secure self-service printing kiosks.</p>
          </div>
        </div>
        <p className="text-sm text-slate-500">Copyright &copy; 2026 VaultPrint. All rights reserved.</p>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05070B] font-sans text-white">
      <NavBar />
      <main>
        <Hero />
        <ProblemSolutionSection />
        <ServicesSection />
        <SecuritySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <LandingPage />;
}
