'use client';

import { useState } from 'react';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { PublicFormPanel } from '@/components/general/PublicFormPanel';
import { StyleguidePreviewBox } from './StyleguideSection';

export function StyleguideFormsDemo() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="space-y-10">
      <StyleguidePreviewBox label="Input — default">
        <RegularInput label="Full name" name="sg-name" placeholder="Jane Smith" />
      </StyleguidePreviewBox>

      <StyleguidePreviewBox label="Input — error">
        <RegularInput
          label="Email"
          name="sg-email"
          type="email"
          placeholder="you@example.com"
          errors={['Please enter a valid email address']}
          defaultValue="not-an-email"
        />
      </StyleguidePreviewBox>

      <StyleguidePreviewBox label="Input — disabled">
        <RegularInput label="Company" name="sg-company" placeholder="—" disabled />
      </StyleguidePreviewBox>

      <StyleguidePreviewBox label="Textarea">
        <RegularTextarea
          label="Message"
          name="sg-message"
          placeholder="Tell us about your project..."
          rows={4}
        />
      </StyleguidePreviewBox>

      <StyleguidePreviewBox label="Select">
        <RegularSelect
          label="Project type"
          name="sg-project-type"
          placeholder="Select project type"
          value=""
          onSelectChange={() => {}}
          options={[
            { value: 'branding', text: 'Branding' },
            { value: 'photography', text: 'Photography' },
          ]}
        />
      </StyleguidePreviewBox>

      <StyleguidePreviewBox label="Select — error">
        <RegularSelect
          label="Budget"
          name="sg-budget"
          placeholder="Select budget range"
          value=""
          onSelectChange={() => {}}
          errors={['Please select a budget range']}
          options={[{ value: '50k-100k', text: '₦50,000 - ₦100,000' }]}
        />
      </StyleguidePreviewBox>

      <StyleguidePreviewBox label="Public form panel — success state">
        <PublicFormPanel
          caption="Get a Quote"
          title="Request a Quote"
          description="Example panel used on Contact and Work With Us forms."
          submitted={showSuccess}
          successTitle="Quote request received"
          successMessage="We will review your details and respond soon."
          successActionLabel="Send another request"
          onSuccessAction={() => setShowSuccess(false)}>
          <p className="text-sm text-muted-foreground mb-4">
            Toggle success state for documentation.
          </p>
          <button
            type="button"
            className="text-sm text-primary underline-offset-4 hover:underline"
            onClick={() => setShowSuccess(true)}>
            Preview success state
          </button>
        </PublicFormPanel>
      </StyleguidePreviewBox>
    </div>
  );
}
