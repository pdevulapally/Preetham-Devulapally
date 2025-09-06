import { Section } from "../components/Section";
import { ContactForm } from "../components/ContactForm";
import { ProtectedPhone } from "../components/ProtectedPhone";
import { personal } from "../data/cv";
import { Mail, Linkedin, MapPin } from "lucide-react";

export function Contact() {
  return (
    <Section id="contact" title="Contact" intro="Let's discuss how I can contribute to your team.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
              Get in Touch
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-brand to-fuchsia-500 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">Email</h4>
                  <a 
                    className="text-brand hover:underline underline-offset-8 transition-colors" 
                    href={`mailto:${personal.email}`}
                  >
                    {personal.email}
                  </a>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    I'll respond within 24 hours
                  </p>
                </div>
              </div>

              <ProtectedPhone />

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">LinkedIn</h4>
                  <a 
                    className="text-brand hover:underline underline-offset-8 transition-colors" 
                    href={personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    linkedin.com/in/preethamdevulapally
                  </a>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Connect with me professionally
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">Location</h4>
                  <p className="text-neutral-700 dark:text-neutral-300">{personal.location}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Open to remote opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Response Info */}
          <div className="card p-6 bg-gradient-to-br from-brand/5 to-fuchsia-500/5 border-brand/20">
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
              Response Time
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              I typically respond to messages within 24 hours. For urgent matters, 
              feel free to call or send a direct email.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
