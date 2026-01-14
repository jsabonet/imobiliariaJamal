import { Metadata } from 'next';
import Hero from "@/components/home/Hero";
import SearchSection from "@/components/home/SearchSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Services from "@/components/home/Services";
// import WhyChooseUs from "@/components/home/WhyChooseUs";
import CallToAction from "@/components/home/CallToAction";
import OrganizationSchema from "@/components/seo/OrganizationSchema";

export const metadata: Metadata = {
  title: 'IJPS - Imobiliária em Moçambique | Compra, Venda e Arrendamento de Imóveis',
  description: 'Encontre o imóvel dos seus sonhos em Moçambique com a IJPS. Apartamentos, casas e terrenos para venda e arrendamento em Maputo. Avaliação gratuita e consultoria especializada.',
  keywords: [
    'imobiliária Moçambique',
    'imóveis Maputo',
    'apartamentos venda Maputo',
    'casas arrendamento Moçambique',
    'comprar casa Maputo',
    'arrendar apartamento Maputo',
    'terrenos venda Moçambique',
    'avaliação imóveis',
    'imobiliária Polana',
    'propriedades Sommerschield',
    'IJPS imobiliária',
  ],
  openGraph: {
    title: 'IJPS - Imobiliária Líder em Moçambique',
    description: 'Encontre apartamentos, casas e terrenos em Maputo. Avaliação gratuita e consultoria especializada.',
    url: 'https://imobiliariajamal.com',
    siteName: 'IJPS Imobiliária',
    images: [
      {
        url: 'https://imobiliariajamal.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'IJPS Imobiliária Moçambique',
      },
    ],
    locale: 'pt_MZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IJPS - Imobiliária em Moçambique',
    description: 'Encontre o imóvel dos seus sonhos. Apartamentos, casas e terrenos em Maputo.',
    images: ['https://imobiliariajamal.com/logo.png'],
  },
  alternates: {
    canonical: 'https://imobiliariajamal.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <Hero />
      <SearchSection />
      <FeaturedProperties />
      <Services />
      {/* <WhyChooseUs /> */}
      <CallToAction />
    </>
  );
}
