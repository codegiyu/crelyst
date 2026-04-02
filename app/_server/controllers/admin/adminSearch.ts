import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  listBrands,
  listProjects,
  listServices,
  listTeamMembers,
  listTestimonials,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';

function matches(q: string, parts: (string | undefined | null)[]) {
  return parts.some(p => p != null && String(p).toLowerCase().includes(q));
}

export const adminSearch: RouteHandler = async ({ request, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim().toLowerCase() ?? '';
  if (q.length < 2) {
    throw new AppError('Search query must be at least 2 characters', 400);
  }

  const [servicesR, projectsR, brandsR, testimonialsR, teamR] = await Promise.all([
    listServices({ limit: 200, page: 1 }),
    listProjects({ limit: 200, page: 1 }),
    listBrands({ limit: 200, page: 1 }),
    listTestimonials({ limit: 200, page: 1 }),
    listTeamMembers({ limit: 200, page: 1 }),
  ]);

  type Svc = {
    id: string;
    title?: string;
    slug?: string;
    shortDescription?: string;
    description?: string;
  };
  type Prj = {
    id: string;
    title?: string;
    slug?: string;
    shortDescription?: string;
    description?: string;
  };
  type Br = { id: string; name?: string; websiteUrl?: string };
  type Tes = { id: string; clientName?: string; companyName?: string; testimonial?: string };
  type Tm = { id: string; name?: string; email?: string; role?: string };

  const services = (servicesR.items as Svc[])
    .filter(s =>
      matches(q, [
        s.title,
        s.slug,
        s.shortDescription,
        typeof s.description === 'string' ? s.description : '',
      ])
    )
    .slice(0, 30)
    .map(s => ({
      type: 'service' as const,
      id: s.id,
      title: s.title ?? s.slug ?? s.id,
      slug: s.slug,
    }));

  const projects = (projectsR.items as Prj[])
    .filter(p =>
      matches(q, [
        p.title,
        p.slug,
        p.shortDescription,
        typeof p.description === 'string' ? p.description : '',
      ])
    )
    .slice(0, 30)
    .map(p => ({
      type: 'project' as const,
      id: p.id,
      title: p.title ?? p.slug ?? p.id,
      slug: p.slug,
    }));

  const brands = (brandsR.items as Br[])
    .filter(b => matches(q, [b.name, b.websiteUrl]))
    .slice(0, 30)
    .map(b => ({
      type: 'brand' as const,
      id: b.id,
      title: b.name ?? b.id,
    }));

  const testimonials = (testimonialsR.items as Tes[])
    .filter(t => matches(q, [t.clientName, t.companyName, t.testimonial]))
    .slice(0, 30)
    .map(t => ({
      type: 'testimonial' as const,
      id: t.id,
      title: t.clientName ?? t.companyName ?? t.id,
    }));

  const teamMembers = (teamR.items as Tm[])
    .filter(m => matches(q, [m.name, m.email, m.role]))
    .slice(0, 30)
    .map(m => ({
      type: 'teamMember' as const,
      id: m.id,
      title: m.name ?? m.id,
    }));

  return sendResponse(
    200,
    {
      query: q,
      services,
      projects,
      brands,
      testimonials,
      teamMembers,
    },
    'Search completed'
  );
};
