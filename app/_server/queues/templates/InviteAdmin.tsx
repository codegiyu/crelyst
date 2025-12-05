import type { InviteAdminJobData } from '../../lib/types/queues';
import type { CompanyBranding } from '../../lib/types/companies';
import { Body, Container, Head, Hr, Html, Img, Section, Text } from '@react-email/components';
import { CodeOrLinkDisplay } from './components/CodeOrLinkDisplay';
import {
  anchor,
  box,
  container,
  footer,
  headerText,
  hr,
  main,
  paragraph,
  responsiveStyles,
  signature,
} from './styles/main';

export const InviteAdmin = ({
  to,
  name,
  firstName,
  lastName,
  inviteLink,
  role,
  permissions,
  avatar,
  branding,
}: InviteAdminJobData & { branding: CompanyBranding }) => {
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : name || 'Admin';

  return (
    <Html>
      <Head>
        <style>
          {`@font-face {
            font-family: '${branding.fontFamily}';
            src: url('https://fonts.gstatic.com/s/comfortaa/v28/1Ptsg8LJRfWJmhDAuUs4TYFs.woff2') format('woff2');
          }`}
        </style>
        <style>{responsiveStyles}</style>
      </Head>

      <Body style={{ ...main, fontFamily: branding.fontFamily }}>
        <Container style={{ ...container }} className="container">
          <Section style={box}>
            {avatar && (
              <Img
                src={avatar}
                width="50"
                height="50"
                alt="Pinpoint Logo"
                style={{ margin: '0 auto' }}
              />
            )}
            <Hr style={hr} />
            <Text style={{ ...headerText, color: branding.primaryColor }}>
              Welcome to {branding.name}, {displayName}!
            </Text>
            <Text style={paragraph}>
              You have been invited to join the {branding.name} Admin Console as an{' '}
              <strong>{role}</strong>.
            </Text>
            {permissions && permissions.length > 0 && (
              <Text style={paragraph}>
                Your assigned permissions include: {permissions.join(', ')}
              </Text>
            )}
            <Text style={paragraph}>
              Click the link below to accept your invitation and set up your account password. This
              link will expire in 1 hour.
            </Text>
            <CodeOrLinkDisplay type="link" content={inviteLink} expiresIn={60} />
            <Text style={signature}>
              Cheers, <br />
              ❤️ The {branding.name} Team
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              This email was intended for{' '}
              <a style={{ ...anchor, color: branding.primaryColor }} href={`mailto:${to}`}>
                {to}
              </a>
              . If this wasn't you, please ignore and report to{' '}
              <a
                style={{ ...anchor, color: branding.primaryColor }}
                href={`mailto:${branding.supportEmail}`}>
                {branding.supportEmail}
              </a>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
