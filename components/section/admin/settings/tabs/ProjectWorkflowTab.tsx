'use client';

import { z } from 'zod';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { Button } from '@/components/ui/button';
import { Plus, Save, X } from 'lucide-react';

const projectWorkflowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  steps: z
    .array(
      z.object({
        title: z.string().min(1, 'Step title is required'),
        description: z.string().min(1, 'Step description is required'),
        order: z.number().int().min(0),
      })
    )
    .min(1, 'At least one step is required'),
});

type ProjectWorkflowFormValues = z.infer<typeof projectWorkflowSchema>;

type ProjectWorkflowTabProps = {
  settings: Partial<ClientSiteSettings>;
};

export const ProjectWorkflowTab = ({ settings }: ProjectWorkflowTabProps) => {
  const {
    actions: { updateSettings },
  } = useSiteSettingsStore(state => state);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    setFormValues,
  } = useForm<typeof projectWorkflowSchema>({
    formSchema: projectWorkflowSchema,
    defaultFormValues: {
      title: settings.projectWorkflow?.title || 'Project Workflow',
      subtitle: settings.projectWorkflow?.subtitle || '',
      steps:
        settings.projectWorkflow?.steps?.map((step, index) => ({
          ...step,
          order: step.order ?? index,
        })) || [],
    },
    noFocusOnFirstField: true,
    onSubmit: async (values: ProjectWorkflowFormValues) => {
      const workflowValue = {
        ...values,
        steps: values.steps.map((step, index) => ({ ...step, order: index })),
      };

      const data = await adminCallApiToast(
        'Saving project workflow…',
        () =>
          callApi('ADMIN_UPDATE_SITE_SETTINGS', {
            payload: {
              settingsPayload: [{ name: 'projectWorkflow', value: workflowValue }],
            },
          }),
        'Project workflow updated successfully'
      );

      if (!data) {
        setFormErrors({ root: ['Failed to save project workflow'] });
        return false;
      }

      updateSettings({ projectWorkflow: workflowValue });
      return true;
    },
  });

  const steps = formValues.steps;

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card shadow-sm p-6 grid gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Project Workflow</h2>
        <p className="text-sm text-muted-foreground">
          The client journey shown on the Work With Us page before the inquiry form.
        </p>
      </div>

      <RegularInput
        label="Section title"
        name="title"
        value={formValues.title}
        onChange={handleInputChange}
        errors={errorsVisible ? formErrors.title : []}
      />
      <RegularInput
        label="Section subtitle"
        name="subtitle"
        value={formValues.subtitle || ''}
        onChange={handleInputChange}
        placeholder="From brief to final delivery"
      />

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Workflow steps</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setFormValues(current => ({
                ...current,
                steps: [
                  ...current.steps,
                  { title: '', description: '', order: current.steps.length },
                ],
              }))
            }>
            <Plus className="mr-1 size-4" /> Add step
          </Button>
        </div>

        {steps.map((step, index) => (
          <div key={index} className="grid gap-3 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Step {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() =>
                  setFormValues(current => ({
                    ...current,
                    steps: current.steps.filter((_, stepIndex) => stepIndex !== index),
                  }))
                }>
                <X className="size-4" />
              </Button>
            </div>
            <RegularInput
              label="Step title"
              name="_"
              value={step.title}
              onChange={e => {
                setFormValues(current => {
                  const nextSteps = [...current.steps];
                  nextSteps[index] = { ...nextSteps[index], title: e.target.value };
                  return { ...current, steps: nextSteps };
                });
              }}
            />
            <RegularTextarea
              label="Step description"
              name="_"
              rows={3}
              value={step.description}
              onChange={e => {
                setFormValues(current => {
                  const nextSteps = [...current.steps];
                  nextSteps[index] = { ...nextSteps[index], description: e.target.value };
                  return { ...current, steps: nextSteps };
                });
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <RegularBtn type="submit" loading={loading} LeftIcon={Save} text="Save changes" />
      </div>
    </form>
  );
};
