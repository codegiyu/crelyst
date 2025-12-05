import { Img, Link } from '@react-email/components';
import { type CSSProperties } from 'react';
import type { CompanyBranding } from '../../../lib/types/companies';
import { Box } from './Box';
import { MulticolorBand } from './MulticolorBand';

interface HeaderProps {
  branding: CompanyBranding;
}

export const Header = ({ branding }: HeaderProps) => {
  return (
    <Box styles={[{}, { padding: '36px 20px 2px' }]}>
      <MulticolorBand />
      <Link
        href={branding.primaryUrl}
        style={{ width: '151px', display: 'block', margin: '0 auto' }}>
        <Img src={branding.logo} alt={branding.name} width={152} height={28} style={imgStyle} />
      </Link>
    </Box>
  );
};

const imgStyle: CSSProperties = {
  margin: '0 auto',
  display: 'block',
  overflow: 'hidden',
  objectFit: 'cover',
};
