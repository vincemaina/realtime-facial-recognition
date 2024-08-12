'use client';

import { useRef, useState } from "react";
import { Frame } from "./frame";
import { LiveCamera } from "./live-camera";
import { ResizedFrame } from "./resized-frame";

const RESIZED_IMAGE_SIZE = 100;

export function LiveCameraController() {

    const videoRef = useRef<HTMLVideoElement>(null);

    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [resizedImage, setResizedImage] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <div className="flex gap-2 items-center">
            <div>
                <h3>Live camera feed</h3>
                <LiveCamera videoRef={videoRef}/>
            </div>
            
            <div>
                <h3>Grab screenshot ever 1s</h3>
                <Frame
                    videoRef={videoRef}
                    frequency={1}
                    screenshot={screenshot}
                    setScreenshot={setScreenshot}
                    canvasRef={canvasRef}
                />
            </div>
            
            <div>
                <h3>Reduce screenshot resolution</h3>

                <ResizedFrame
                    resizedImage={resizedImage}
                    setResizedImage={setResizedImage}
                    canvasRef={canvasRef}
                    screenshot={screenshot}
                    imageSize={RESIZED_IMAGE_SIZE}
                />
            </div>
        </div>
    );
}