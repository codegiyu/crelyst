'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { PublicFormPanel } from '@/components/general/PublicFormPanel';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularFileInput } from '@/components/atoms/RegularFileInput';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useForm } from '@/lib/hooks/use-form';
import { usePublicFormAttachments } from '@/lib/hooks/use-public-form-attachments';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';

const quoteRequestSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  company: z.string().min(1, 'Company name is required'),
  email: z.email('Please enter a valid email address'),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().min(1, 'Please select a budget range'),
  message: z
    .string()
    .min(10, 'Please provide more details about your project (at least 10 characters)'),
});

type QuoteRequestFormValues = z.infer<typeof quoteRequestSchema>;

export const ContactFormSection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const attachments = usePublicFormAttachments('quote-request');

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    submitted,
    handleInputChange,
    onChange,
    handleSubmit,
    resetForm,
  } = useForm<typeof quoteRequestSchema>({
    formSchema: quoteRequestSchema,
    defaultFormValues: {
      name: '',
      company: '',
      email: '',
      projectType: '',
      budget: '',
      message: '',
    },
    onSubmit: async (values: QuoteRequestFormValues) => {
      if (attachments.fieldError) {
        toast.error(attachments.fieldError);
        return false;
      }

      try {
        const uploadedAttachments = await attachments.uploadAttachments();
        if (attachments.files.length > 0 && !uploadedAttachments) {
          return false;
        }

        const { error } = await callApi('SUBMIT_QUOTE_REQUEST', {
          payload: {
            ...values,
            uploadSessionId: uploadedAttachments?.length ? attachments.uploadSessionId : undefined,
            attachments: uploadedAttachments,
          },
        });

        if (error) {
          toast.error(error.message || 'Failed to submit quote request. Please try again.');
          return false;
        }

        toast.success("Quote request submitted! We'll get back to you soon.");
        attachments.clearFiles();
        return true;
      } catch (error) {
        toast.error('Failed to submit quote request. Please try again.');
        console.error(error);
        return false;
      }
    },
  });

  const isBusy = loading || attachments.uploading;
  const fileErrors = attachments.fieldError ? [attachments.fieldError] : [];

  const handleReset = () => {
    resetForm();
    attachments.clearFiles();
  };

  return (
    <SectionContainer className="bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}>
        <PublicFormPanel
          caption="Get a Quote"
          title="Request a Quote"
          description="Tell us about your project and we'll provide a customized quote tailored to your needs."
          submitted={submitted}
          successTitle="Quote request received"
          successMessage="Thank you for reaching out. We'll review your project details and respond with a tailored proposal soon."
          successActionLabel="Submit another request"
          onSuccessAction={handleReset}>
          <form onSubmit={handleSubmit} className="grid gap-8" noValidate aria-busy={isBusy}>
            {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
              <div
                className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm"
                role="alert">
                {formErrors.root[0]}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              <RegularInput
                label="Full Name"
                name="name"
                placeholder="John Doe"
                autoComplete="name"
                required
                disabled={isBusy}
                value={formValues.name}
                onChange={handleInputChange}
                errors={errorsVisible ? formErrors.name : []}
              />
              <RegularInput
                label="Company Name"
                name="company"
                placeholder="Your Company"
                autoComplete="organization"
                required
                disabled={isBusy}
                value={formValues.company}
                onChange={handleInputChange}
                errors={errorsVisible ? formErrors.company : []}
              />
            </div>

            <RegularInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
              required
              disabled={isBusy}
              value={formValues.email}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.email : []}
            />

            <RegularSelect
              label="Project Type"
              name="projectType"
              required
              disabled={isBusy}
              placeholder="Select project type"
              value={formValues.projectType}
              onSelectChange={value => onChange('projectType', value)}
              errors={errorsVisible ? formErrors.projectType : []}
              options={[
                { value: 'photography', text: 'Photography' },
                { value: 'branding', text: 'Branding & Visual Identity' },
                { value: 'product-design', text: 'Product Design' },
                { value: 'packaging', text: 'Packaging Design' },
                { value: 'other', text: 'Other' },
              ]}
            />

            <RegularSelect
              label="Budget Range"
              name="budget"
              required
              disabled={isBusy}
              placeholder="Select budget range"
              value={formValues.budget}
              onSelectChange={value => onChange('budget', value)}
              errors={errorsVisible ? formErrors.budget : []}
              options={[
                { value: 'under-50k', text: 'Under ₦50,000' },
                { value: '50k-100k', text: '₦50,000 - ₦100,000' },
                { value: '100k-500k', text: '₦100,000 - ₦500,000' },
                { value: '500k-1m', text: '₦500,000 - ₦1,000,000' },
                { value: '1m-plus', text: '₦1,000,000+' },
              ]}
            />

            <RegularTextarea
              label="Project Details"
              name="message"
              placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
              rows={6}
              required
              disabled={isBusy}
              value={formValues.message}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.message : []}
            />

            <RegularFileInput
              files={attachments.files}
              onFilesSelected={attachments.addFiles}
              onRemoveFile={attachments.removeFile}
              errors={fileErrors}
              disabled={isBusy}
            />

            <RegularBtn
              type="submit"
              className="w-full sm:w-auto"
              disabled={isBusy}
              RightIcon={Send}
              rightIconProps={{ className: 'size-4' }}
              text={
                attachments.uploading
                  ? 'Uploading files...'
                  : loading
                    ? 'Submitting...'
                    : 'Request Quote'
              }
            />
          </form>
        </PublicFormPanel>
      </motion.div>
    </SectionContainer>
  );
};
