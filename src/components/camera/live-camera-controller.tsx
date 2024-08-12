'use client';

import { useRef, useState } from "react";
import { Frame } from "./frame";
import { LiveCamera } from "./live-camera";
import { ResizedFrame } from "./resized-frame";

export function LiveCameraController() {

    const videoRef = useRef<HTMLVideoElement>(null);

    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [resizedImage, setResizedImage] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <div className="flex gap-2 items-center">
            <LiveCamera videoRef={videoRef}/>
            <Frame
                videoRef={videoRef}
                frequency={2}
                screenshot={screenshot}
                setScreenshot={setScreenshot}
                canvasRef={canvasRef}
            />
            <ResizedFrame
                resizedImage={resizedImage}
                setResizedImage={setResizedImage}
                canvasRef={canvasRef}
                screenshot={screenshot}
            />
        </div>
    );
}