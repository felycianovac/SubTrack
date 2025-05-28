import { ThemeAwareModal } from './ui/custom-theme-components';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { ContextDTO } from '@/types/permissions';
import { permissionsApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface GuestProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuestProfilesModal({ isOpen, onClose }: GuestProfilesModalProps) {
  const { data: contexts, isLoading } = useQuery({
    queryKey: ['contexts'],
    queryFn: permissionsApi.getContexts,
  });

  if (!isOpen) return null;

  return (
    <ThemeAwareModal>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Guest Profiles</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : contexts?.length === 0 ? (
            <div className="text-sm text-muted-foreground">No guest profiles available</div>
          ) : (
            <div className="space-y-2">
              {contexts?.map((context: ContextDTO) => (
                <div
                  key={context.ownerId}
                  className="flex items-center justify-between p-2 rounded-md bg-muted"
                >
                  <div>
                    <div className="font-medium">{context.ownerEmail}</div>
                    <div className="text-sm text-muted-foreground">
                      {context.permission === 'GUEST_RW' ? 'Read & Write' : 'Read Only'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement profile switching
                      console.log('Switch to profile:', context.ownerEmail);
                    }}
                  >
                    Switch Profile
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ThemeAwareModal>
  );
} 