import { useToastManager } from '@/components/ui/toast';

export function useToaster() {
  const { toasts, toastManager } = useToastManager();

  const create = (options: {
    title: string;
    description?: string;
    type?: 'success' | 'error' | 'info' | 'warning' | 'loading';
  }) => {
    toastManager.addToast({
      id: crypto.randomUUID(),
      title: options.title,
      description: options.description,
      type: options.type ?? 'info',
      timeout: options.type === 'success' ? 3000 : 5000,
    });
  };

  const dismiss = (id: string) => {
    toastManager.dismissToast(id);
  };

  return { create, dismiss, toasts };
}