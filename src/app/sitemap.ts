import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pntacademy.com';

  // Major routes defining the core of PNT Academy
  const routes = [
    '',
    '/schools/robotics-lab',
    '/schools/composite-skill-lab',
    '/courses/offline-bootcamps',
    '/courses/online',
    '/curriculum/cbse-icse-ib',
    '/curriculum/nep-aligned',
    '/programs/schools',
    '/programs/colleges',
    '/programs/courses-for-kids',
    '/programs/army-navy-internship',
    '/programs/summer-camp',
    '/workshop',
    '/kit',
    '/championship',
    '/lms',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
