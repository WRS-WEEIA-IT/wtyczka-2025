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
    role: 'Koordynatorka',
    photoUrl: 'https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/kadra/laura.jpg',
    email: 'l.wilczura@samorzad.p.lodz.pl',
    facebookUrl: 'https://www.facebook.com/laura.wilczura',
  },
  {
    id: '2',
    name: 'Dorian Pietruszewski',
    role: 'Wicekoordynator',
    photoUrl: 'https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/kadra/dorian.jpg',
    email: 'd.pietruszewski@samorzad.p.lodz.pl',
    facebookUrl: 'https://www.facebook.com/dorian.pietruszewski',
  },
  {
    id: '3',
    name: 'Daria Zuranska',
    role: 'Kadra',
    photoUrl: 'https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/kadra/daria.jpg',
    email: 'd.zuranska@samorzad.p.lodz.pl',
    facebookUrl: 'https://www.facebook.com/daria.zuranska.1',
  },
  {
    id: '4',
    name: 'Dawid Pawlak',
    role: 'Kadra',
    photoUrl: 'https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/kadra/dawid.jpg',
    email: 'd.pawlak@samorzad.p.lodz.pl',
    facebookUrl: 'https://www.facebook.com/dawid.pawlak.50951',
  },
  {
    id: '5',
    name: 'Adrian Antczak',
    role: 'Kadra',
    photoUrl: 'https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/kadra/adrian.jpg',
    email: 'a.antczak@samorzad.p.lodz.pl',
    facebookUrl: 'https://www.facebook.com/profile.php?id=100009414133154',
  },
  {
    id: '6',
    name: 'Jakub "Wiśnia" Wiślicki',
    role: 'Kadra',
    photoUrl: 'https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/kadra/wisnia.jpg',
    email: 'j.wislicki@samorzad.p.lodz.pl',
    facebookUrl: 'https://www.facebook.com/profile.php?id=100012937775211',
  },
  {
    id: '7',
    name: 'Marta Kawecka',
    role: 'Kadra',
    photoUrl: 'https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/kadra/marta.jpg',
    email: 'm.kawecka@samorzad.p.lodz.pl',
    facebookUrl: 'https://www.facebook.com/marta.kawecka.566',
  },
  {
    id: '8',
    name: 'Oliwier Kalecki',
    role: 'Kadra',
    photoUrl: 'https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/kadra/oliwier.jpg',
    email: 'o.kalecki@samorzad.p.lodz.pl',
    facebookUrl: 'https://www.facebook.com/Oliwier.Kalecki.17',
  },
  {
    id: '9',
    name: 'Patrycja Porada',
    role: 'Kadra',
    photoUrl: 'https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/kadra/patrycja.jpg',
    email: 'p.porada@samorzad.p.lodz.pl',
    facebookUrl: 'https://www.facebook.com/profile.php?id=100013394468940',
  },
  {
    id: '10',
    name: 'Theo de Schaeck',
    role: 'Kadra',
    photoUrl: 'https://bvzdouqtahdyiaaxywsw.supabase.co/storage/v1/object/public/kadra/theo.jpg',
    email: 't.deschaeck@samorzad.p.lodz.pl',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61568438813117',
  },
];

// Function to get all team members
export const getTeamMembers = (): TeamMember[] => {
  return teamMembers;
};