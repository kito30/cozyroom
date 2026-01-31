import { getProfileAction } from "@/src/app/services/profile";
import { ProfilePage } from "@/src/components/profile";

export default async function Page() {
  const profile = await getProfileAction();
  return <ProfilePage profile={profile} />;
}
