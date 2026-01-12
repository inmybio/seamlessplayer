"use client";

import { useRef, useState, useEffect } from "react";

export default function Home() {

  // VIDEO ELEMENTS
  const v1 = useRef(null);
  const v2 = useRef(null);
  const [active, setActive] = useState("v1");

  // LOOP CONTROL
  const runningRef = useRef(false);

  // AUDIO CONTROL
  const [audioEnabled, setAudioEnabled] = useState(false);

  // SPEED MODE
  const [randomSpeed, setRandomSpeed] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState("1.00×");

  function getRandomSpeed() {
    return 0.93 + Math.random() * (1.07 - 0.93);
  }

  // GROUP STORAGE
  const [group67, setGroup67] = useState([]);

  // NO-REPEAT QUEUE FOR folder67
  const queue67 = useRef([]);

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function next67() {
    if (queue67.current.length === 0) {
      queue67.current = shuffle(group67);
    }
    return queue67.current.shift();
  }

  // LOAD VIDEOS
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/listVideos");
      const data = await res.json();
      setGroup67(data.folder67 || []);
    })();
  }, []);

  // SEAMLESS PLAYER (AUDIO FIXED)
  async function playVideo(file) {
    if (!file) return;

    const cur = active === "v1" ? v1.current : v2.current;
    const nxt = active === "v1" ? v2.current : v1.current;

    let speed = randomSpeed ? getRandomSpeed() : 1.0;
    setCurrentSpeed(`${speed.toFixed(2)}×`);

    // 🔑 FORCE AUDIO STATE ON BOTH ELEMENTS (CRITICAL FIX)
    v1.current.muted = !audioEnabled;
    v2.current.muted = !audioEnabled;

    nxt.src = file;
    nxt.playbackRate = speed;
    nxt.currentTime = 0;

    try {
      await nxt.play();
    } catch (e) {
      console.error("Play failed:", e);
      return;
    }

    cur.pause();
    setActive(v => (v === "v1" ? "v2" : "v1"));

    await new Promise(res => (nxt.onended = res));
  }

  // 🎞 folder67 → 45sec.mp4 LOOP
  async function playFolder67WithSpacer() {
    if (!group67.length) {
      alert("folder67 is empty or not loaded");
      return;
    }

    // USER GESTURE → ENABLE AUDIO
    setAudioEnabled(true);
    runningRef.current = true;

    while (runningRef.current) {

      // ▶️ RANDOM folder67 (NO REPEATS)
      const clip = next67();
      await playVideo(clip);
      if (!runningRef.current) return;

      // ▶️ FIXED 45-SECOND VIDEO
      await playVideo("/videos/45sec.mp4");
      if (!runningRef.current) return;
    }
  }

  return (
    <div style={{ background:"#0c0c0c", color:"#fff", minHeight:"100vh", padding:"30px", textAlign:"center" }}>

      <h1>ADVANCED VIDEO ENGINE</h1>

      <div style={{ marginBottom:"26px" }}>
        <button
          onClick={playFolder67WithSpacer}
          style={{ padding:"12px 26px", margin:"6px", background:"#3b82f6", borderRadius:"6px" }}
        >
          🎞 folder67 → 45sec Loop
        </button>

        <button
          onClick={() => (runningRef.current = false)}
          style={{ padding:"12px 26px", margin:"6px", background:"#ff4444", borderRadius:"6px" }}
        >
          ⛔ STOP
        </button>
      </div>

      <div style={{
        position:"relative",
        width:"80%",
        maxWidth:"950px",
        aspectRatio:"16/9",
        margin:"0 auto",
        background:"#000",
        borderRadius:"7px",
        overflow:"hidden"
      }}>
        <video
          ref={v1}
          playsInline
          style={{ position:"absolute", width:"100%", height:"100%" }}
        />
        <video
          ref={v2}
          playsInline
          style={{ position:"absolute", width:"100%", height:"100%" }}
        />

        <div style={{
          position:"absolute",
          top:"12px",
          left:"12px",
          background:"rgba(0,0,0,0.6)",
          padding:"6px 10px",
          borderRadius:"6px",
          fontSize:"16px",
          fontWeight:"600",
          pointerEvents:"none"
        }}>
          Current Speed: {currentSpeed}
        </div>
      </div>

    </div>
  );
}
