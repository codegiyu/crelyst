import { SectionContainer } from '@/components/general/SectionContainer';

export function PublicLoadErrorBanner() {
  return (
    <SectionContainer>
      <div
        role="alert"
        className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground">
        We&apos;re having trouble loading this right now. Please check back shortly.
      </div>
    </SectionContainer>
  );
}
