'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { SocialBtn } from '@/components/layout/Footer';
import { getSocialIcon, formatSocialLabel } from '@/lib/utils/socials';
import { formatOfficeHours } from '@/lib/utils/contactInfo';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import { cn } from '@/lib/utils';

export const ContactInfoSection = ({
  contactInfo: contactInfoProp,
  socials: socialsProp,
}: {
  contactInfo?: ClientSiteSettings['contactInfo'];
  socials?: ClientSiteSettings['socials'];
}) => {
  const { siteLoading } = useSiteStore(state => state);

  const contactInfo = contactInfoProp;
  const officeHours = formatOfficeHours(contactInfo?.officeHours);

  const socials =
    socialsProp
      ?.filter(social => social.href?.trim())
      .map(social => ({
        Icon: getSocialIcon(social.platform),
        href: social.href,
        label: formatSocialLabel(social.platform),
      })) || [];

  const whatsappDigits = contactInfo?.whatsapp?.replace(/\D/g, '') ?? '';
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Hello Crelyst, I would like to get in touch.')}`
    : '';

  const contactItems = [
    {
      Icon: MapPin,
      title: 'Visit Us',
      details: contactInfo?.address || [],
    },
    {
      Icon: Phone,
      title: 'Call Us',
      details: contactInfo?.tel || [],
      isLink: true,
      linkPrefix: 'tel:',
    },
    {
      Icon: Mail,
      title: 'Email Us',
      details: contactInfo?.email || [],
      isLink: true,
      linkPrefix: 'mailto:',
    },
    ...(whatsappUrl
      ? [
          {
            Icon: MessageCircle,
            title: 'WhatsApp',
            details: [contactInfo?.whatsapp ?? whatsappDigits],
            isLink: true,
            href: whatsappUrl,
          },
        ]
      : []),
    {
      Icon: Clock,
      title: 'Office Hours',
      details: officeHours.map(h => `${h.days}: ${h.time}`),
    },
  ];

  return (
    <SectionContainer className="bg-background lg:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-none h-full">
        <SectionHeading
          caption="Reach Out"
          title="Contact Information"
          text="Reach out through any of these channels."
          variant="compact"
          align="start"
          spacing="tight"
          className="mb-16"
        />

        <div className="mt-8 grid gap-4">
          {contactItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: 16 }}
              whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              className={cn(
                'flex items-start gap-4 rounded-xl border border-border/80 bg-muted/20 p-4 transition-colors hover:border-primary/30'
              )}>
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.Icon className="w-5 h-5 text-primary" aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <div className="grid gap-0.5">
                  {item.details.length === 0 ? (
                    <p className="text-muted-foreground italic text-sm">Not available</p>
                  ) : (
                    item.details.map((detail, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        {item.isLink ? (
                          <a
                            href={
                              'href' in item && item.href
                                ? item.href
                                : `${item.linkPrefix}${detail.replace(/\s/g, '')}`
                            }
                            className="hover:text-primary transition-colors break-all"
                            {...('href' in item && item.href?.startsWith('https://wa.me')
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}>
                            {detail}
                          </a>
                        ) : (
                          detail
                        )}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-border">
          <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
          <div className="flex items-center gap-3 flex-wrap">
            {socials.length === 0 ? (
              <p className="text-muted-foreground italic text-sm">No social links available</p>
            ) : (
              socials.map((social, idx) => <SocialBtn key={idx} {...social} />)
            )}
          </div>
        </motion.div>
      </motion.div>
    </SectionContainer>
  );
};
