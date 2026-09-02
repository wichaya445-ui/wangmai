
export enum RoomType {
  INDIVIDUAL = 'Individual',
  SOFA = 'Sofa',
  THEATER = 'Theater',
  MEETING = 'Meeting'
}

export type Page = 
  | 'HOME' 
  | 'ROOM_LIST' 
  | 'MOVIES' 
  | 'BOOKING_TIME' 
  | 'BOOKING_SEAT' 
  | 'BOOKING_DETAILS' 
  | 'QR_CODE' 
  | 'SUCCESS' 
  | 'PROFILE' 
  | 'LOGIN' 
  | 'SIGNUP'
  | 'ACCOUNT_SETTINGS'
  | 'PERSONAL_QR'
  | 'POINTS_HISTORY'
  | 'FAQ';

export interface MediaOption {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: string; 
  totalSeats: number;
  availableSeats: number;
  imageUrl: string;
  tags?: string[]; 
  facilities: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  studentId: string;
  selectedSeats: string[];
  timeSlot?: string;
  duration?: number;
  endTime?: string;
  date?: Date;
  startTime: Date;
  status: 'Active' | 'Cancelled' | 'Completed';
  mediaId?: string;
}
