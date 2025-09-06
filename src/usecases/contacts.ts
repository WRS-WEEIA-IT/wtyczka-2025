import { supabase } from "../lib/supabase";

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  availability: string;
  responsibilities: string[];
}

export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from("contacts")
    .select("*");
  if (error) throw error;
  return data as Contact[];
}
