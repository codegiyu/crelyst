'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import type {
  ClientFormSubmission,
  FormSubmissionFormType,
  IFormSubmissionsListRes,
} from '@/lib/constants/endpoints';
import { Eye, Mail, RefreshCw } from 'lucide-react';

function formatDate(value: string | undefined) {
  if (!value) return '—';
  try {
    return format(new Date(value), 'PPp');
  } catch {
    return value;
  }
}

function infoRow(label: string, value: string | undefined | null) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground break-words">{value?.trim() || '—'}</p>
    </div>
  );
}

interface FormSubmissionsReadOnlyPageClientProps {
  initial: IFormSubmissionsListRes;
  formType: FormSubmissionFormType;
  title: string;
  description: string;
}

export function FormSubmissionsReadOnlyPageClient({
  initial,
  formType,
  title,
  description,
}: FormSubmissionsReadOnlyPageClientProps) {
  const [search, setSearch] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ClientFormSubmission | null>(null);

  const filteredSubmissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initial.submissions;
    return initial.submissions.filter(s => {
      const haystack = [s.name, s.email, s.message, s.company, s.projectType, s.portfolio]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [initial.submissions, search]);

  const listEmpty = initial.submissions.length === 0;
  const filterEmpty = !listEmpty && filteredSubmissions.length === 0;

  return (
    <DashboardPageWrapper
      header={{ title, description }}
      headerActions={
        <RegularBtn
          text="Refresh"
          variant="outline"
          LeftIcon={RefreshCw}
          leftIconProps={{ className: 'size-4' }}
          onClick={() => window.location.reload()}
        />
      }>
      {!listEmpty && (
        <div className="max-w-md">
          <Input
            placeholder="Search name, email, message..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label={`Filter ${title}`}
          />
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {initial.pagination.total} total
        {initial.pagination.total !== filteredSubmissions.length
          ? ` · ${filteredSubmissions.length} matching`
          : ''}
      </p>

      {listEmpty ? (
        <div className="rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center text-muted-foreground">
          <Mail className="mx-auto mb-3 size-10 opacity-50" />
          <p>No submissions yet.</p>
        </div>
      ) : filterEmpty ? (
        <div className="rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center text-muted-foreground">
          <p>No submissions match your search.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSubmissions.map(submission => (
            <li key={submission._id}>
              <Card className="h-full">
                <CardHeader className="space-y-1 pb-2">
                  <p className="font-semibold text-foreground line-clamp-1">{submission.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{submission.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {formatDate(submission.createdAt)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formType === 'quote-request'
                    ? infoRow('Company', submission.company)
                    : infoRow('Portfolio', submission.portfolio)}
                  {formType === 'quote-request'
                    ? infoRow('Project type', submission.projectType)
                    : infoRow('Experience', submission.experience)}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Message</p>
                    <p className="text-sm text-foreground line-clamp-3">
                      {submission.message || '—'}
                    </p>
                  </div>
                  <RegularBtn
                    text="View"
                    size="sm"
                    variant="outline"
                    LeftIcon={Eye}
                    leftIconProps={{ className: 'size-4' }}
                    onClick={() => setSelectedSubmission(submission)}
                  />
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!selectedSubmission}
        onOpenChange={open => !open && setSelectedSubmission(null)}
        maxWidth="lg"
        header={{
          title: selectedSubmission?.name ?? 'Submission details',
          description: selectedSubmission?.email ?? '',
        }}
        cancelButton={{ text: 'Close' }}>
        {selectedSubmission ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {infoRow('Submitted at', formatDate(selectedSubmission.createdAt))}
            {infoRow('Updated at', formatDate(selectedSubmission.updatedAt))}
            {infoRow('Email', selectedSubmission.email)}
            {infoRow('Source IP', selectedSubmission.sourceIp ?? '—')}
            {formType === 'quote-request' ? (
              <>
                {infoRow('Company', selectedSubmission.company)}
                {infoRow('Project type', selectedSubmission.projectType)}
                {infoRow('Budget', selectedSubmission.budget)}
              </>
            ) : (
              <>
                {infoRow('Portfolio', selectedSubmission.portfolio)}
                {infoRow('Experience', selectedSubmission.experience)}
              </>
            )}
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">Message</p>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {selectedSubmission.message || '—'}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </DashboardPageWrapper>
  );
}
