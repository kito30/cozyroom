import profileActions from "./profile_actions"

const ProfilePage = async () => {
    const profile = await profileActions();
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <h1 className="text-2xl font-semibold mb-4">Profile</h1>
            <div className="space-y-2">
                <p><span className="text-slate-400">Email:</span> {profile.email}</p>
                {profile.full_name && (
                    <p><span className="text-slate-400">Name:</span> {profile.full_name}</p>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;