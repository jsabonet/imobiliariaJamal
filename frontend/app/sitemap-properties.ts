import { MetadataRoute } from 'next';

// This will be a dynamic sitemap for properties
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://imobiliariajamal.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  try {
    // Fetch all properties from API
    const response = await fetch(`${apiUrl}/properties/?page_size=1000`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    
    const data = await response.json();
    const properties = data.results || [];
    
    // Generate sitemap entries for each property
    return properties.map((property: any) => ({
      url: `${baseUrl}/propriedades/${property.id}`,
      lastModified: new Date(property.updated_at || property.created_at),
      changeFrequency: 'weekly' as const,
      priority: property.is_featured ? 0.9 : 0.7,
    }));
  } catch (error) {
    console.error('Error generating properties sitemap:', error);
    return [];
  }
}
