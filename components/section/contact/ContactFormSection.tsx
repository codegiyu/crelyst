'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useForm } from '@/lib/hooks/use-form';
import { z } from 'zod';
import { Send, FileText } from 'lucide-react';
import { toast } from 'sonner';

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

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    onChange,
    handleSubmit,
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
      try {
        console.log({ values });
        // Simulate form submission - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // TODO: Replace with actual API call
        // const { data, error } = await callApi('SUBMIT_QUOTE_REQUEST', { payload: values });

        toast.success(
          "Quote request submitted successfully! We'll get back to you soon with a customized proposal."
        );
        return true;
      } catch (error) {
        toast.error('Failed to submit quote request. Please try again.');
        console.error(error);
        return false;
      }
    },
  });

  return (
    <SectionContainer className="bg-card">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-sans">
            Request a Quote
          </h2>
          <p className="text-muted-foreground">
            Tell us about your project and we&apos;ll provide a customized quote tailored to your
            needs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
              {formErrors.root[0]}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <RegularInput
              label="Full Name"
              name="name"
              placeholder="John Doe"
              required
              value={formValues.name}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.name : []}
            />
            <RegularInput
              label="Company Name"
              name="company"
              placeholder="Your Company"
              required
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
            required
            value={formValues.email}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.email : []}
          />

          <RegularSelect
            label="Project Type"
            name="projectType"
            required
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
            placeholder="Select budget range"
            value={formValues.budget}
            onSelectChange={value => onChange('budget', value)}
            errors={errorsVisible ? formErrors.budget : []}
            options={[
              { value: 'under-5k', text: 'Under $5,000' },
              { value: '5k-10k', text: '$5,000 - $10,000' },
              { value: '10k-25k', text: '$10,000 - $25,000' },
              { value: '25k-50k', text: '$25,000 - $50,000' },
              { value: '50k-plus', text: '$50,000+' },
            ]}
          />

          <RegularTextarea
            label="Project Details"
            name="message"
            placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
            rows={6}
            required
            value={formValues.message}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.message : []}
          />

          <RegularBtn
            type="submit"
            className="w-full sm:w-auto"
            disabled={loading}
            RightIcon={Send}
            rightIconProps={{ className: 'size-4' }}
            text={loading ? 'Submitting...' : 'Request Quote'}
          />
        </form>
      </motion.div>
    </SectionContainer>
  );
};
