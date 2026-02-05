import { ProfileProvider } from "@/src/providers/ProfileProvider";
import { ProfilePage } from "@/src/components/profile";
import { Profile } from "@/src/types";
import { getProfileServer } from "../services/api";

export default async function Page() {
  const res = await getProfileServer();

  if (!res || !res.ok) {
    throw new Error('Failed to fetch profile');
  }

  const data = await res.json();
  const profile: Profile = data.profile ?? data;   // must be plain JSON

  return (
    <ProfileProvider profile={profile}>      
      <ProfilePage />
    </ProfileProvider>
  );
}