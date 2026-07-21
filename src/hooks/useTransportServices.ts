import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Briefcase, Cog, Home as HomeIcon, Package, Truck } from 'lucide-react';
import { adminTransportServiceService, type TransportService } from '../services/adminTransportServiceService';

export interface TransportServiceCardData {
  _id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  capacity?: string;
  gradient: string;
}

const fallbackServices: TransportService[] = [
  {
    _id: 'fallback-household',
    title: 'Household Items Transport',
    description: 'Safe relocation of household belongings with professional handling and door-to-door delivery.',
    icon: 'Home',
    capacity: 'Up to 1.5 Ton',
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: 'fallback-coconut',
    title: 'Coconut Transport',
    description: 'Bulk coconut transport with safe loading, unloading, and fast delivery across cities and states.',
    icon: 'Package',
    capacity: 'Bulk & Wholesale',
    displayOrder: 2,
    isActive: true,
  },
  {
    _id: 'fallback-cotton',
    title: 'Cotton Box Transport',
    description: 'Cotton boxes and textile transport with weatherproof handling and secure loading.',
    icon: 'Truck',
    capacity: 'Up to 1.5 Ton',
    displayOrder: 3,
    isActive: true,
  },
  {
    _id: 'fallback-machinery',
    title: 'Machinery Items Transport',
    description: 'Machinery transport with secure strapping, heavy equipment handling, and careful transit management.',
    icon: 'Cog',
    capacity: 'Up to 1.5 Ton',
    displayOrder: 4,
    isActive: true,
  },
];

export const getTransportServiceIcon = (service: Partial<TransportService>): LucideIcon => {
  const rawIcon = (service.icon || '').toLowerCase();
  if (rawIcon.includes('home')) return HomeIcon;
  if (rawIcon.includes('cog') || rawIcon.includes('machinery')) return Cog;
  if (rawIcon.includes('truck') || rawIcon.includes('cotton')) return Truck;
  if (rawIcon.includes('briefcase') || rawIcon.includes('business')) return Briefcase;
  return Package;
};

export const getTransportServiceGradient = (service: Partial<TransportService>): string => {
  const title = (service.title || '').toLowerCase();
  if (title.includes('household')) return 'from-blue-500 to-indigo-600';
  if (title.includes('coconut')) return 'from-emerald-500 to-teal-600';
  if (title.includes('cotton')) return 'from-amber-500 to-orange-600';
  if (title.includes('machinery')) return 'from-rose-500 to-pink-600';
  return 'from-primary to-primary/80';
};

export const getTransportServiceCardData = (service: Partial<TransportService>): TransportServiceCardData => {
  const title = service.title || 'Transport Service';
  const description = service.description || 'Professional transport solution tailored to your needs.';
  const capacity = service.capacity || (title.toLowerCase().includes('household') || title.toLowerCase().includes('cotton') || title.toLowerCase().includes('machinery') ? 'Up to 1.5 Ton' : 'Bulk & Wholesale');

  return {
    _id: service._id || title,
    title,
    description,
    Icon: getTransportServiceIcon(service),
    capacity,
    gradient: getTransportServiceGradient(service),
  };
};

export const useTransportServices = () => {
  const [services, setServices] = useState<TransportService[]>(fallbackServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await adminTransportServiceService.getAllServices();
        if (!active) return;

        const normalized = (data || [])
          .filter((service) => service.isActive !== false)
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

        setServices(normalized.length ? normalized : fallbackServices);
      } catch (error) {
        console.error('Error fetching transport services', error);
        if (active) {
          setServices(fallbackServices);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadServices();

    const onUpdate = () => {
      loadServices();
    };
    window.addEventListener('services:updated', onUpdate);

    return () => {
      active = false;
      window.removeEventListener('services:updated', onUpdate);
    };
  }, []);

  return { services, loading };
};
