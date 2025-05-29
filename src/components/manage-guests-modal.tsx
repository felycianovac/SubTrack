import { useState, useEffect } from 'react';
import { ThemeAwareAddButton, ThemeAwareModal, ThemeAwareSelectContent, ThemeAwareSelectItem } from './ui/custom-theme-components';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {  type GuestDTO } from '@/types/permissions';
import { permissionsApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

interface ManageGuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageGuestsModal({ isOpen, onClose }: ManageGuestsModalProps) {
  const [guestEmail, setGuestEmail] = useState('');
  const [permission, setPermission] = useState<'GUEST_RW' | 'GUEST_RO'>('GUEST_RO');
  const queryClient = useQueryClient();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);


  const { data: guests, isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: permissionsApi.getGuests,
  });
  const isExistingGuest = guests?.some((g) => g.guestEmail === guestEmail);


  const addPermissionMutation = useMutation({
    mutationFn: permissionsApi.addPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setGuestEmail('');
      setPermission('GUEST_RO');
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: permissionsApi.deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: permissionsApi.updatePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });

  if (!isOpen) return null;

const handleAddGuest = async (e: React.FormEvent) => {
  e.preventDefault();
    setEmailError(null);
  setGeneralError(null);

  if (!guestEmail){
    setEmailError('Email is required.') 
    return;
  }

  const existingGuest = guests?.find((g) => g.guestEmail === guestEmail);

  try {
    if (existingGuest) {
      await updatePermissionMutation.mutateAsync({
        guestEmail,
        permission,
      });
    } else {
      await addPermissionMutation.mutateAsync({
        guestEmail,
        permission,
      });
    }

    setGuestEmail('');
    setPermission('GUEST_RO');
    setEmailError(null);
    setGeneralError(null);
  } catch (error: any) {
  const raw = error.response?.data;
  const message = typeof raw === 'string' ? raw : raw?.message || 'An unexpected error occurred.';

 if ((message as string).toLowerCase().includes('yourself')) {
   console.log()
    setEmailError(message); // show under email field
  } else if((message as string).toLowerCase().includes('user not found')) {
    setGeneralError(message); // show below the form
  }
  }
};


  const handleRemoveGuest = async (guestEmail: string) => {
    try {
      await deletePermissionMutation.mutateAsync(guestEmail);
    } catch (error) {
      console.error('Failed to remove guest:', error);
    }
    
  };

  return (
    <ThemeAwareModal>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Manage Guests</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleAddGuest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestEmail">Guest Email</Label>
            <Input
              id="guestEmail"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Enter guest email"
              required
            />
{emailError && <div className="text-red-500 text-sm">{emailError}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="permission">Permission Level</Label>
            <Select value={permission} onValueChange={(value: 'GUEST_RW' | 'GUEST_RO') => setPermission(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select permission level" />
              </SelectTrigger>
              <ThemeAwareSelectContent>
                <ThemeAwareSelectItem value="GUEST_RO">Read Only</ThemeAwareSelectItem>
                <ThemeAwareSelectItem value="GUEST_RW">Read & Write</ThemeAwareSelectItem>
              </ThemeAwareSelectContent>
            </Select>
          </div>

          <ThemeAwareAddButton onClick={handleAddGuest}>
            {isExistingGuest ? 'Modify Permission' : 'Add Guest'}
          </ThemeAwareAddButton>
          {generalError && <div className="text-red-500 text-sm mt-2">{generalError}</div>}


        </form>

        <div className="space-y-4">
          <h3 className="font-medium">Current Guests</h3>
          {isLoading ? (
            <div>Loading...</div>
          ) : guests?.length === 0 ? (
            <div className="text-sm text-muted-foreground">No guests added yet</div>
          ) : (
            <div className="space-y-2">
              {guests?.map((guest: GuestDTO) => (
                <div
                  key={guest.guestId}
                  className="flex items-center justify-between p-2 rounded-md bg-muted"
                >
                  <div>
                    <div className="font-medium">{guest.guestEmail}</div>
                    <div className="text-sm text-muted-foreground">
                      {guest.permission === 'GUEST_RW' ? 'Read & Write' : 'Read Only'}
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveGuest(guest.guestEmail)}
                  >
                    Remove
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