import { EditProfileForm, ProfileData } from "@/src/components/profile";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Header */}
      <ProfileData />

      {/* Profile Edit Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-black/40">
          <h2 className="text-2xl font-semibold text-slate-50 mb-6">
            Edit Profile
          </h2>
          <EditProfileForm />
        </div>
      </div>
    </div>
  );
}
