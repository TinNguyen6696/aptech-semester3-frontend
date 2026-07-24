import { API } from "@/lib/apiendpoint";
import axiosClient from "@/services/axiosClient";
import { useUserStore } from "@/Store/userStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserCard from "./followerUserCard";
import UserAvatar from "@/components/ui/UserAvatar/userAvatar";

export default function FollowerPage() {
    const {userInfo} = useUserStore();
    const [activeTab, setActiveTab] = useState("followers");
    const [follower, setFollower] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followState, setFollowState] = useState({});
    
    useEffect(() => {
        const fetchAll = async () => {
            const [resFollower, resFollowing] = await Promise.all([
                axiosClient.get(API.AXIOS_USER_GET_FOLLOWER.replace("{id}", userInfo?.id)),
                axiosClient.get(API.AXIOS_USER_GET_FOLLOWING.replace("{id}", userInfo?.id)),
            ]);

            const followerUsers = resFollower.data.isSuccess ? resFollower.data.data.users : [];
            const followingUsers = resFollowing.data.isSuccess ? resFollowing.data.data.users : [];

            setFollower(followerUsers);
            setFollowing(followingUsers);
            
            const followingIds = new Set(followingUsers.map((u) => u.id));
            const followerState = followerUsers.reduce((acc, u) => ({ ...acc, [u.id]: followingIds.has(u.id) }), {});
            const followingState = followingUsers.reduce((acc, u) => ({ ...acc, [u.id]: true }), {});

            console.log("followingIds:", [...followingIds]);
            console.log("followerState:", followerState);  // id:30 phải là true
            console.log("followingState:", followingState);
            setFollowState({
                ...followerUsers.reduce((acc, u) => ({ ...acc, [u.id]: followingIds.has(u.id) }), {}),
                ...followingUsers.reduce((acc, u) => ({ ...acc, [u.id]: true }), {}),
            });
        };
        fetchAll();
    }, []);

    async function handleToggleFollow(id) {
      const prev = followState[id];
      setFollowState((s) => ({ ...s, [id]: !prev }));
      try {
          const res = await axiosClient.post(API.AXIOS_USER_FOLLOW.replace("{id}", id));
          if (res.data.isSuccess) {
              if (activeTab === "following" && prev === true) {
                  setFollowing((list) => list.filter((u) => u.id !== id));
              }
          } else {
              setFollowState((s) => ({ ...s, [id]: prev }));
              toast.error(res.data.message);
          }
      } catch {
          setFollowState((s) => ({ ...s, [id]: prev }));
          toast.error("Failed to update follow status");
      }
  }

  const list = activeTab === "followers" ? follower : following;

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Profile header */}
      {userInfo?.username && (
        <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl mb-5">
          <UserAvatar
            profileImageUrl={userInfo?.profileImageUrl}
            firstName={userInfo?.firstName}
            lastName={userInfo?.lastName}
            username={userInfo?.username}
            size={52}
            className="text-lg"
          />
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-900">
              {userInfo?.username}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {[userInfo?.primaryCategory, userInfo?.skillLevel, userInfo?.provinceName].filter(Boolean).join(" · ")}
            </p>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium text-gray-900">{follower.length}</span>
              <span className="text-xs text-gray-400">Followers</span>
            </div>
            <div className="w-px h-7 bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium text-gray-900">{following.length}</span>
              <span className="text-xs text-gray-400">Following</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        {["followers", "following"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm -mb-px border-b-2 transition-colors cursor-pointer bg-transparent ${
              activeTab === tab
                ? "font-medium text-blue-600 border-blue-600"
                : "font-normal text-gray-500 border-transparent"
            }`}
          >
            {tab === "followers" ? "Followers" : "Following"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {list?.length === 0 ? (
        <div className="text-center py-10 text-sm text-gray-400">No users found.</div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
          {list?.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              tab={activeTab}
              followState={followState}
              onToggleFollow={handleToggleFollow}
            />
          ))}
        </div>
      )}
    </div>
  );
}