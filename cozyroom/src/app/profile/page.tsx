import { getProfileAction } from "@/src/app/services/profile";
import { ProfileProvider } from "@/src/providers/ProfileProvider";
import { ProfilePage } from "@/src/components/profile";

export default async function Page() {
  const profile = await getProfileAction();
  return (
    <ProfileProvider profile={profile}>
      <ProfilePage />
    </ProfileProvider>
  );
}
