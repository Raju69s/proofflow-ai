export default async function sitemap() {
  const baseUrl = 'https://proofflow.nl';

  // Core public marketing and onboarding routes
  const routes = ['', '/login', '/register'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...routes];
}
