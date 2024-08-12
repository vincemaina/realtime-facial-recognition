'use client';

import { useRef, useState } from "react";
import { Frame } from "./frame";
import { LiveCamera } from "./live-camera";
import { ResizedFrame } from "./resized-frame";

interface Props {
    imageData: ImageData | null;
    setImageData: React.Dispatch<React.SetStateAction<ImageData | null>>;
    imageSize: number;
}

export function LiveCameraController(props: Props) {

    const videoRef = useRef<HTMLVideoElement>(null);

    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [resizedImage, setResizedImage] = useState<string | null>(null);

    const frameRef = useRef<HTMLCanvasElement>(null);
    const resizedImageRef = useRef<HTMLCanvasElement>(null);

    return (
        <>
            <div className="flex gap-2 items-center">
                <div>
                    <h3>Live camera feed</h3>
                    <LiveCamera videoRef={videoRef}/>
                </div>
                
                <div>
                    <h3>Grab screenshot ever 1s</h3>
                    <Frame
                        videoRef={videoRef}
                        frequency={5}
                        screenshot={screenshot}
                        setScreenshot={setScreenshot}
                        canvasRef={frameRef}
                    />
                </div>
                
                <div>
                    <h3>Reduce screenshot resolution</h3>

                    <ResizedFrame
                        resizedImage={resizedImage}
                        setResizedImage={setResizedImage}
                        canvasRef={frameRef}
                        screenshot={screenshot}
                        imageSize={props.imageSize}
                        resizedImageRef={resizedImageRef}
                        setImageData={props.setImageData}
                    />
                </div>
            </div>
        </>
    );
}