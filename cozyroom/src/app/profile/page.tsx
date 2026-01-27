import profileActions from "./profile_actions";
import EditProfileForm from "./edit-profile-form";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const ProfilePage = async () => {
    const profile = await profileActions();
    
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Hero Header */}
            <div className="relative border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-5xl font-bold text-slate-900 shadow-2xl shadow-emerald-500/30 ring-4 ring-slate-800/50">
                                {profile.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt="Profile"
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    profile.email.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50 ring-4 ring-slate-950">
                                <UserCircleIcon className="w-6 h-6 text-slate-900" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-50 mb-1">
                                {profile.full_name || 'Anonymous User'}
                            </h1>
                            <p className="text-slate-400 mb-2">{profile.email}</p>
                            {profile.bio && (
                                <p className="text-sm text-slate-300 max-w-2xl">
                                    {profile.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Edit Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-black/40">
                    <h2 className="text-2xl font-semibold text-slate-50 mb-6">
                        Edit Profile
                    </h2>
                    <EditProfileForm profile={profile} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
