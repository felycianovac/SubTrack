export interface AuthRequest {
  email: string;
  password: string;
}

export interface UserDTO {
  id: number;
  email: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  user?: UserDTO;
}

export interface SwitchContextRequest {
  ownerId: number;
} 