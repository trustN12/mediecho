"use client";

import { useState } from "react";
import { ShineBorder } from "@/components/magicui/shine-border";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import MuxPlayer from "@mux/mux-player-react";

export function WatchVideoButton() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      {/* Watch Button */}
      <div className="relative inline-block rounded-lg">
        <ShineBorder
          className="rounded-lg"
          shineColor={["#A7F3D0", "#F97316", "#8B5CF6", "#FFFF00"]}
        />
        <button
          onClick={() => setShowVideo(true)}
          className="cursor-pointer flex items-center justify-center w-60 rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
        >
          Watch Video
          <FontAwesomeIcon icon={faPlay} className="ml-2 w-5 h-5" />
        </button>
      </div>

      {/* Modal Overlay */}
      {showVideo && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 z-0" />

          {/* Video Modal */}
          <div className="relative z-10 w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setShowVideo(false)}
                className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-black/70 hover:bg-emerald-400/40 text-white hover:text-white transition-all"
                aria-label="Close video"
              >
                <FontAwesomeIcon icon={faXmark} className="text-md" />
              </button>
            </div>

            {/* Mux Player */}
            <MuxPlayer
            accentColor="#10B981"
              playbackId="dQe6mKpIWjIaHbF2tnHnpwwIm7pF3adX3ClO301iTrMQ"
              streamType="on-demand"
              autoPlay
              className="w-full h-full"
              metadata={{
                video_title: "Introducing Mediecho",
                viewer_user_id: "landing",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
