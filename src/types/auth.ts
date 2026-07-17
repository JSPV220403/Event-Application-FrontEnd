export interface AuthUser {
  id: string;
  name:string;
  phoneNumber:string;
  email: string;
  role: "USER" | "ORGANIZER" | "ADMIN";
  status: "APPROVED" | "PENDING";
  exp: number;
  iat: number;
}