import { TemplateLayout, type TemplateLayoutProps } from '../components/TimeBasedTemplateLayout';

interface TemplateProps
  extends Omit<TemplateLayoutProps, 'contentsArr' | 'bannerUrl' | 'heading' | 'otp'> {
  otp: string;
}

export const OTPCode = ({ name, to, code, avatar, branding }: TemplateProps) => {
  const previewText = `Your ${branding.name} verification code is ${code}`;

  return (
    <TemplateLayout
      preview={previewText}
      name={name}
      to={to}
      avatar={avatar}
      heading={`${branding.name} Account Verification Code`}
      code={code}
      branding={branding}
      contentsArr={[
        {
          type: 'textBlock',
          props: {
            paragraphs: [
              {
                type: 'text',
                content:
                  'Please use the following code for verification on your account. Please note that the code is only valid for 10 minutes',
              },
            ],
          },
        },
        {
          type: 'codeOrLinkDisplay',
          props: {
            type: 'code',
            content: code || '******',
            expiresIn: 10,
          },
        },
      ]}
    />
  );
};
