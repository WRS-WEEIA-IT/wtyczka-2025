export interface TeamMember {
  id: string;
  name: string;
  role?: string; // Optional role/position in the team
  photoUrl: string;
  email: string;
  facebookUrl: string;
}

// Sample data - replace with actual team members later
export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Laura Wilczura',
    role: 'Koordynator Główny',
    photoUrl: '/wtyczka_avatar.jpg', // Placeholder image
    email: 'anna.kowalska@example.com',
    facebookUrl: 'https://facebook.com/profile',
  },
  {
    id: '2',
    name: 'Dorian Pietruszewski',
    role: 'Wice Koordynator',
    photoUrl: '/wtyczka_avatar.jpg',
    email: 'jan.nowak@example.com',
    facebookUrl: 'https://facebook.com/profile',
  },
  {
    id: '3',
    name: 'Karolina Wiśniewska',
    role: 'Koordynator Logistyki',
    photoUrl: '/wtyczka_avatar.jpg',
    email: 'karolina.wisniewska@example.com',
    facebookUrl: 'https://facebook.com/profile',
  },
  {
    id: '4',
    name: 'Michał Kowalczyk',
    role: 'Koordynator Programu',
    photoUrl: '/wtyczka_avatar.jpg',
    email: 'michal.kowalczyk@example.com',
    facebookUrl: 'https://facebook.com/profile',
  },
  {
    id: '5',
    name: 'Aleksandra Nowakowska',
    role: 'Koordynator Promocji',
    photoUrl: '/wtyczka_avatar.jpg',
    email: 'aleksandra.nowakowska@example.com',
    facebookUrl: 'https://facebook.com/profile',
  },
  {
    id: '6',
    name: 'Piotr Lewandowski',
    role: 'Koordynator Integracji',
    photoUrl: '/wtyczka_avatar.jpg',
    email: 'piotr.lewandowski@example.com',
    facebookUrl: 'https://facebook.com/profile',
  },
  {
    id: '7',
    name: 'Natalia Kamińska',
    role: 'Koordynator Sponsorów',
    photoUrl: '/wtyczka_avatar.jpg',
    email: 'natalia.kaminska@example.com',
    facebookUrl: 'https://facebook.com/profile',
  },
  {
    id: '8',
    name: 'Krzysztof Woźniak',
    role: 'Koordynator Techniczny',
    photoUrl: '/wtyczka_avatar.jpg',
    email: 'krzysztof.wozniak@example.com',
    facebookUrl: 'https://facebook.com/profile',
  },
  {
    id: '9',
    name: 'Marta Szymańska',
    role: 'Koordynator Finansów',
    photoUrl: '/wtyczka_avatar.jpg',
    email: 'marta.szymanska@example.com',
    facebookUrl: 'https://facebook.com/profile',
  },
  {
    id: '10',
    name: 'Daria Żurańska',
    role: 'Kadrowicz',
    photoUrl: '/wtyczka_avatar.jpg',
    email: 'adam.jankowski@example.com',
    facebookUrl: 'https://facebook.com/profile',
  },
];

// Function to get all team members
export const getTeamMembers = (): TeamMember[] => {
  return teamMembers;
};