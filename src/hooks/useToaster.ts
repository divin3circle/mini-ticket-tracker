import { toast } from '@/components/ui/toast';

export function useToaster() {
  const create = (options: {
    title: string;
    description?: string;
    type?: 'success' | 'error' | 'info' | 'warning' | 'loading';
  }) => {
    toast.add({
      id: crypto.randomUUID(),
      title: options.title,
      description: options.description,
      type: options.type ?? 'info',
      timeout: options.type === 'success' ? 3000 : 5000,
    });
  };

  return { create };
}