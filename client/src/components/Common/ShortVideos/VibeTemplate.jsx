import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../axiosInstance";
import { Blog } from "../../../Context/Context";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import Comments from "../Comments/Comments";
import FollowBtn from "../../Home/UserToFollow/FollowBtn";

const ReelTemplate = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const videoRefs = useRef({}); 
  const { currentUser } = Blog();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/videos");
        const videosWithFullPath = response.data.map((video) => ({
          ...video,
          videoUrl: `http://localhost:5001${video.videoPath}`,
        }));
        setVideos(videosWithFullPath);
      } catch (error) {
        toast.error("Failed to load videos. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Function to handle video play/pause based on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target;
          if (entry.isIntersecting) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 } 
    );

    
    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos]);

  const handleLike = (videoId) => {
    toast.success(`Liked video ${videoId}!`);
  };

  const handleShare = (videoId) => {
    toast.info(`Shared video ${videoId}!`);
  };

  const toggleExpanded = (videoId) => {
    setExpanded((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  return (
    <div className="w-full h-screen overflow-y-scroll bg-black flex flex-col items-center">
      {loading ? (
        <p className="text-center mt-10 text-white">Loading videos...</p>
      ) : videos.length > 0 ? (
        videos.map((video) => (
          <div
            key={video._id}
            className="w-full max-w-[500px] bg-gray-800 rounded-xl mb-10 p-4 shadow-lg"
          >
            <div className="w-full">
              <video
                ref={(el) => (videoRefs.current[video._id] = el)} // Assign refs dynamically
                className="w-full h-[70vh] object-cover rounded-lg"
                src={video.videoUrl}
                controls
                loop
                muted
                controlsList="nodownload noremoteplayback"
              ></video>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
                src={video.userProfileImage || "/default-avatar.png"}
                alt="user-profile"
                onClick={() => (window.location.href = `/profile/${video.userId}`)}
              />
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {video.username || "Unknown User"}
                </h4>
                <p className="text-sm text-gray-300">
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
              {currentUser && String(currentUser.id) !== String(video.userId) && (
                <FollowBtn userId={video.userId} />
              )}
            </div>

            <div className="mt-4 flex justify-around text-white">
              <button
                onClick={() => handleLike(video._id)}
                className="flex items-center justify-center text-red-500"
              >
                <FaHeart size={24} />
              </button>
              <button
                onClick={() => toast.info(`Comments for video ${video._id}`)}
                className="flex items-center justify-center text-blue-500"
              >
                <FaComment size={24} />
              </button>
              <button
                onClick={() => handleShare(video._id)}
                className="flex items-center justify-center text-green-500"
              >
                <FaShare size={24} />
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => toggleExpanded(video._id)}
                className="text-white underline"
              >
                {expanded[video._id] ? "Hide Details" : "Show Details"}
              </button>
            </div>

            {expanded[video._id] && (
              <div className="mt-4 text-white text-sm">
                <p className="mb-2">{video.description || "No description provided."}</p>
                <p className="text-gray-400">
                  {video.tags ? `Tags: ${video.tags.join(", ")}` : "No tags available"}
                </p>
              </div>
            )}

            <div className="w-full h-[1px] bg-gray-700 mt-8"></div>
          </div>
        ))
      ) : (
        <p className="text-center mt-10 text-white">No videos available.</p>
      )}
    </div>
  );
};

export default ReelTemplate;
