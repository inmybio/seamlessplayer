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
  const [started, setStarted] = useState(false);

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

  function safePlay(src) {
    const v = videoRef.current;
    if (!v) return;

    v.src = src;
    v.load();

    const playPromise = v.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        // autoplay blocked — user click will fix
      });
    }
  }

  function playNext() {
    if (!videoRef.current) return;

    let nextSrc;

    if (playShortNext) {
      nextSrc = SHORT_VIDEO;
      setPlayShortNext(false);
    } else {
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

    safePlay(nextSrc);
  }

  // Start first video once user clicks
  function startPlayback() {
    if (!videoRef.current || !normalVideos.length) return;

    const v = videoRef.current;
    v.muted = false;
    v.volume = 1;

    safePlay(normalVideos[0]);

    setIndex(1);
    setPlayShortNext(true);
    setStarted(true);
  }

  return (
    <div
      onClick={!started ? startPlayback : undefined}
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        cursor: !started ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {!started && (
        <div
          style={{
            position: "absolute",
            color: "white",
            fontSize: 24,
            zIndex: 10
          }}
        >
          Click to start
        </div>
      )}

      <video
        ref={videoRef}
        playsInline
        muted
        onEnded={playNext}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
