'use client';

import { useEffect } from "react";

interface FrameProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    frequency?: number;
    screenshot: string | null;
    setScreenshot: React.Dispatch<React.SetStateAction<string | null>>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function Frame(props: FrameProps) {
    function takeScreenshot() {
        if (props.videoRef.current && props.canvasRef.current) {
            console.log('Taking screenshot');
            
            const canvas = props.canvasRef.current;
            const video = props.videoRef.current;
            const context = canvas.getContext('2d')!;

            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            // Determine the square dimensions and starting point for cropping
            const size = Math.min(videoWidth, videoHeight);
            const xOffset = (videoWidth - size) / 2;
            const yOffset = (videoHeight - size) / 2;

            // Draw the cropped square onto the canvas
            canvas.width = size;
            canvas.height = size;
            context.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);

            // Get the full-size screenshot
            const dataURL = canvas.toDataURL('image/png');
            props.setScreenshot(dataURL);
        }
    }

    useEffect(() => {
        const delay = 1000 / (props.frequency || 1);
        const interval = setInterval(takeScreenshot, delay);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <canvas ref={props.canvasRef} className='hidden' />

            {props.screenshot && (
                <img src={props.screenshot} alt='Screenshot'/>
            )}
        </div>
    )
}
