export interface PermissionRequest {
    guestEmail: string;
    permission: 'GUEST_RW' | 'GUEST_RO';
  }
  
  export interface ContextDTO {
    ownerId: number;
    ownerEmail: string;
    permission: string;
  }
  
  export interface GuestDTO {
    guestId: number;
    guestEmail: string;
    permission: string;
  }
  