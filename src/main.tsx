import React from "react";
import { createRoot } from "react-dom/client";
import { TarotReel } from "@/components/TarotReel";
import "@/styles.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TarotReel />
  </React.StrictMode>,
);
