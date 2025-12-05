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
import { Send, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

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

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    onChange,
    handleSubmit,
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
      try {
        console.log({ values });
        // Simulate form submission - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // TODO: Replace with actual API call
        // const { data, error } = await callApi('SUBMIT_WORK_WITH_US', { payload: values });

        toast.success(
          "Application submitted successfully! We'll review your application and get back to you soon."
        );
        return true;
      } catch (error) {
        toast.error('Failed to submit application. Please try again.');
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
        className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-sans">
            Apply to Collaborate
          </h2>
          <p className="text-muted-foreground">
            Tell us about yourself and your work. We&apos;ll review your application and get back to
            you soon.
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
              placeholder="Jane Smith"
              required
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
            value={formValues.portfolio}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.portfolio : []}
          />

          <RegularSelect
            label="Years of Experience"
            name="experience"
            required
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
            text={loading ? 'Submitting...' : 'Submit Application'}
          />
        </form>
      </motion.div>
    </SectionContainer>
  );
};
