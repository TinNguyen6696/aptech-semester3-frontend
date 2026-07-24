import UserAvatar from "@/components/ui/UserAvatar/userAvatar";
import { useState } from "react";

function skillBadgeStyle(level) {
  const map = {
    Beginner: { bg: "#EFF6FF", text: "#1D4ED8" },
    Intermediate: { bg: "#FFF7ED", text: "#C2410C" },
    Advanced: { bg: "#F0FDF4", text: "#15803D" },
  };
  return map[level] || { bg: "#F3F4F6", text: "#374151" };
}

export default function UserCard({ user, tab, followState, onToggleFollow }) {
  const badge = skillBadgeStyle(user.skillLevel);
  const isFollowing = followState[user.id];
  const [hovered, setHovered] = useState(false);
 console.log(`UserCard id:${user.id} tab:${tab} isFollowing:${isFollowing}`);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 text-center">
      <UserAvatar
        profileImageUrl={user.profileImageUrl}
        firstName={user.firstName}
        lastName={user.lastName}
        username={user.username}
        size={44}
      />

      <div className="flex flex-col items-center gap-0.5">
        <p className="text-sm font-medium text-gray-900 m-0">
          {user.firstName && user.lastName ? `${user.lastName} ${user.firstName}` : user.username}
        </p>
        <p className="text-xs text-gray-500 m-0">
          {user.primaryCategory}{user.provinceName ? ` · ${user.provinceName}` : ""}
        </p>
        <span
          className="text-[11px] px-2 py-0.5 rounded-md font-medium mt-0.5"
          style={{ background: badge.bg, color: badge.text }}
        >
          {user.skillLevel}
        </span>
      </div>

      {tab === "followers" && !isFollowing ? (
          <button
            className="mt-1 w-full py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50"
            onClick={() => onToggleFollow(user.id)}
          >
            Follow back
          </button>
        ) : tab === "following" ? (
          <button
            className={`mt-1 w-full py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              hovered
                ? "bg-red-50 text-red-500 border border-red-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
            onClick={() => onToggleFollow(user.id)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {hovered ? "Unfollow" : "Following"}
          </button>
        ) : null}
    </div>
  );
}