import { Metadata } from 'next';

// This will be used for SSR metadata generation
// For now, we're using client-side metadata updates
// In production, you'd fetch property data server-side and generate metadata

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // In a real implementation, fetch property server-side here
  // For now, return default metadata
  return {
    title: 'Property Details | KKTC Emlak',
    description: 'View property details on KKTC Emlak platform',
    openGraph: {
      title: 'Property Details | KKTC Emlak',
      description: 'View property details on KKTC Emlak platform',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

