import Link from "next/link";
import { Scale } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Citation Guide", href: "#" },
    { label: "Writing Tips", href: "#" },
    { label: "API", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy-950 text-navy-200">
      <div className="container-max mx-auto section-padding !py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500">
                <Scale className="h-5 w-5 text-navy-950" />
              </div>
              <span className="font-display text-xl font-semibold text-white">
                LexWrite <span className="text-gold-400">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              Professional legal writing enhancement for students, researchers,
              and practitioners. Improve clarity while preserving citations and accuracy.
            </p>
            <p className="mt-4 text-xs text-navy-400">
              LexWrite AI does not bypass AI detectors or guarantee detector evasion.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm hover:text-gold-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-navy-400">
            &copy; {new Date().getFullYear()} LexWrite AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-navy-400">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
