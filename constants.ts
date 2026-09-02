import { Room, RoomType, MediaOption } from './types';

export const ALL_TIME_SLOTS = [
  "10:00 น.", "11:00 น.", "12:00 น.", "13:00 น.", 
  "14:00 น.", "15:00 น.", "16:00 น.", "17:00 น."
];

export const MOCK_ROOMS: Room[] = [
  {
    id: 'sofa',
    name: 'กลุ่มโซฟา',
    type: RoomType.SOFA,
    capacity: '3-5 คน',
    totalSeats: 4,
    availableSeats: 4,
    imageUrl: 'https://i.postimg.cc/x8VCtq3F/กลุ่มโซฟา.jpg',
    tags: ["10:00 น.", "11:00 น.", "12:00 น.", "13:00 น.", "14:00 น.", "15:00 น.", "16:00 น."],
    facilities: ['Comfortable Sofa', 'Coffee Table', 'Ambient Lighting', 'Smart TV']
  },
  {
    id: 'meeting',
    name: 'ห้องประชุม',
    type: RoomType.MEETING,
    capacity: '4-8 คน',
    totalSeats: 2,
    availableSeats: 2,
    imageUrl: 'https://i.postimg.cc/d3c14Djx/ห้องประชุม.jpg',
    tags: ["10:00 น.", "11:00 น.", "12:00 น.", "13:00 น.", "14:00 น.", "15:00 น."],
    facilities: ['Whiteboard', 'Conference Phone', 'Video Conferencing', 'Large Monitor']
  },
  {
    id: 'individual',
    name: 'ห้องเดี่ยว',
    type: RoomType.INDIVIDUAL,
    capacity: '1 คน',
    totalSeats: 26,
    availableSeats: 26,
    imageUrl: 'https://i.postimg.cc/gkNz6g1z/ห้องเดี่ยว.jpg',
    tags: ["ทุกเวลา"],
    facilities: ['High Speed Internet', 'Power Outlet', 'Ergonomic Chair', 'Privacy Partition']
  },
  {
    id: 'theater',
    name: 'ห้องเธียร์เตอร์',
    type: RoomType.THEATER,
    capacity: '6-12 คน',
    totalSeats: 2,
    availableSeats: 2,
    imageUrl: 'https://i.postimg.cc/BQMS1mR9/ห้องเทียร์เตียร์ใหญ่.jpg',
    tags: ["11:00 น.", "14:00 น.", "16:00 น."],
    facilities: ['4K Projector', 'Surround Sound', 'Recliner Seats', 'Acoustic Walls']
  }
];

export const START_TIMES = [
  "10:30 น.", "11:00 น.", "11:30 น.", "12:00 น.", 
  "12:30 น.", "13:00 น.", "13:30 น.", "14:00 น.", 
  "14:30 น.", "15:00 น.", "15:30 น.", "16:00 น."
];

export const STREAMING_PLATFORMS: MediaOption[] = [
  { id: 'netflix', name: 'Netflix' },
  { id: 'disney', name: 'Disney+ Hotstar' },
  { id: 'iqiyi', name: 'iQIYI' },
  { id: 'hbo', name: 'HBO GO' },
  { id: 'prime', name: 'Prime Video' },
  { id: 'youtube', name: 'YouTube Premium' }
];

export const CD_LIBRARY: MediaOption[] = [
    { id: 'cd1', name: 'Inception' },
    { id: 'cd2', name: 'Interstellar' },
    { id: 'cd3', name: 'The Dark Knight' }
];