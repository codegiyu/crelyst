'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { PublicFormPanel } from '@/components/general/PublicFormPanel';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularFileInput } from '@/components/atoms/RegularFileInput';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useSiteStore } from '@/lib/store/siteStore';
import { useForm } from '@/lib/hooks/use-form';
import { usePublicFormAttachments } from '@/lib/hooks/use-public-form-attachments';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';

const FORM_SIDE_IMAGE = '/images/bg-hero-gallery.jpg';

const workWithUsSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.email('Please enter a valid email address'),
  portfolio: z.url('Please enter a valid portfolio URL'),
  experience: z.string().min(1, 'Please select your experience level'),
  message: z.string().min(10, 'Please tell us more about yourself (at least 10 characters)'),
});

type WorkWithUsFormValues = z.infer<typeof workWithUsSchema>;

export const WorkWithUsFormSection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const attachments = usePublicFormAttachments('work-with-us');

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
  } = useForm<typeof workWithUsSchema>({
    formSchema: workWithUsSchema,
    defaultFormValues: {
      name: '',
      email: '',
      portfolio: '',
      experience: '',
      message: '',
    },
    onSubmit: async (values: WorkWithUsFormValues) => {
      if (attachments.fieldError) {
        toast.error(attachments.fieldError);
        return false;
      }

      try {
        const uploadedAttachments = await attachments.uploadAttachments();
        if (attachments.files.length > 0 && !uploadedAttachments) {
          return false;
        }

        const { error } = await callApi('SUBMIT_WORK_WITH_US', {
          payload: {
            ...values,
            uploadSessionId: uploadedAttachments?.length ? attachments.uploadSessionId : undefined,
            attachments: uploadedAttachments,
          },
        });

        if (error) {
          toast.error(error.message || 'Failed to submit application. Please try again.');
          return false;
        }

        toast.success(
          "Application submitted! We'll review your application and get back to you soon."
        );
        attachments.clearFiles();
        return true;
      } catch (error) {
        toast.error('Failed to submit application. Please try again.');
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
      <div className="grid gap-10 md:gap-12 lg:gap-16 lg:grid-cols-2 lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full">
          <PublicFormPanel
            caption="Careers"
            title="Apply to Collaborate"
            description="Tell us about yourself and your work. We'll review your application and get back to you soon."
            headingAlign="start"
            submitted={submitted}
            successTitle="Application received"
            successMessage="Thanks for applying. Our team will review your portfolio and experience, then reach out if there's a fit."
            successActionLabel="Submit another application"
            onSuccessAction={handleReset}
            className="max-md:mx-auto max-w-xl md:max-w-none">
            <form onSubmit={handleSubmit} className="grid gap-6" noValidate aria-busy={isBusy}>
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
                  placeholder="Jane Smith"
                  required
                  disabled={isBusy}
                  value={formValues.name}
                  onChange={handleInputChange}
                  errors={errorsVisible ? formErrors.name : []}
                />
                <RegularInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  required
                  disabled={isBusy}
                  value={formValues.email}
                  onChange={handleInputChange}
                  errors={errorsVisible ? formErrors.email : []}
                />
              </div>

              <RegularInput
                label="Portfolio Link"
                name="portfolio"
                type="url"
                placeholder="https://yourportfolio.com"
                required
                disabled={isBusy}
                value={formValues.portfolio}
                onChange={handleInputChange}
                errors={errorsVisible ? formErrors.portfolio : []}
              />

              <RegularSelect
                label="Years of Experience"
                name="experience"
                required
                disabled={isBusy}
                placeholder="Select experience level"
                value={formValues.experience}
                onSelectChange={value => onChange('experience', value)}
                errors={errorsVisible ? formErrors.experience : []}
                options={[
                  { value: '0-1', text: '0-1 years' },
                  { value: '2-3', text: '2-3 years' },
                  { value: '4-5', text: '4-5 years' },
                  { value: '6-10', text: '6-10 years' },
                  { value: '10+', text: '10+ years' },
                ]}
              />

              <RegularTextarea
                label="Tell Us About Yourself"
                name="message"
                placeholder="Share your design philosophy, areas of expertise, and why you'd like to collaborate with Crelyst..."
                rows={6}
                required
                disabled={isBusy}
                value={formValues.message}
                onChange={handleInputChange}
                errors={errorsVisible ? formErrors.message : []}
              />

              <RegularFileInput
                label="Résumé or work samples"
                subtext="Optional · up to 3 files · 5MB each"
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
                      : 'Submit Application'
                }
              />
            </form>
          </PublicFormPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="hidden lg:block w-full sticky top-28">
          <div className="relative aspect-[4/5] max-h-[min(720px,75vh)] w-full overflow-hidden rounded-2xl border border-border shadow-none">
            <Image
              src={FORM_SIDE_IMAGE}
              alt="Creative professionals collaborating at Crelyst"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 0px"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </motion.div>
      </div>
    </SectionContainer>
  );
};
