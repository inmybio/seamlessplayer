"use client";

import { useEffect, useRef, useState } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VideoPlayer() {
  const videoRef = useRef(null);

  const [normalVideos, setNormalVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [playShortNext, setPlayShortNext] = useState(false);

  const SHORT_VIDEO =
    "https://pub-ed211d2dbf8d43b6a81391be2bf18901.r2.dev/folder67/45sec.mp4";

  // Load + shuffle normal videos
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/listVideos");
      const data = await res.json();

      const normals = (data.folder67 || []).filter(
        v => !v.endsWith("45sec.mp4")
      );

      setNormalVideos(shuffle(normals));
      setIndex(0);
      setPlayShortNext(false);
    }

    load();
  }, []);

  function playNext() {
    let nextSrc;

    if (playShortNext) {
      nextSrc = SHORT_VIDEO;
      setPlayShortNext(false);
    } else {
      // reshuffle when cycle finishes
      if (index >= normalVideos.length) {
        const reshuffled = shuffle(normalVideos);
        setNormalVideos(reshuffled);
        setIndex(1);
        nextSrc = reshuffled[0];
      } else {
        nextSrc = normalVideos[index];
        setIndex(i => i + 1);
      }
      setPlayShortNext(true);
    }

    if (videoRef.current) {
      videoRef.current.src = nextSrc;
      videoRef.current.play();
    }
  }

  // Start first video
  useEffect(() => {
    if (normalVideos.length && videoRef.current) {
      videoRef.current.src = normalVideos[0];
      videoRef.current.play();
      setIndex(1);
      setPlayShortNext(true);
    }
  }, [normalVideos]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      controls={false}
      onEnded={playNext}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
