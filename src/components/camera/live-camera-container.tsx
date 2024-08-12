'use client';

import { useRef } from "react";
import { Frame } from "./frame";
import { LiveCamera } from "./live-camera";

export function LiveCameraContainer() {

    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div className="flex gap-2 items-center">
            <LiveCamera videoRef={videoRef}/>
            <Frame videoRef={videoRef} frequency={2}/>
        </div>
    );
}