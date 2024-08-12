'use client';

import { useEffect, useRef, useState } from "react";

interface FrameProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    frequency?: number;
}

export function Frame(props: FrameProps) {
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [resizedImage, setResizedImage] = useState<string | null>(null);

    function takeScreenshot() {
        if (props.videoRef.current && canvasRef.current) {
            console.log('Taking screenshot');
            
            const canvas = canvasRef.current;
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
            setScreenshot(dataURL);
        }
    }

    useEffect(() => {
        const delay = 1000 / (props.frequency || 1);
        const interval = setInterval(takeScreenshot, delay);

        return () => clearInterval(interval);
    }, []);


    function resizeImage() {
        const IMAGE_SIZE = 64;
        if (canvasRef.current) {
            // Resize the image to 16x16 pixels
            const canvas = canvasRef.current;
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = IMAGE_SIZE;
            resizedCanvas.height = IMAGE_SIZE;
            const resizedContext = resizedCanvas.getContext('2d')!;
            resizedContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
            const resizedDataURL = resizedCanvas.toDataURL('image/png');
            setResizedImage(resizedDataURL);
        };
    }

    useEffect(() => {
        resizeImage();
    }, [screenshot]);

    return (
        <div className="flex-auto">
            <canvas ref={canvasRef} className='hidden' />

            {screenshot && (
                <img src={screenshot} alt='Screenshot'/>
            )}

            {resizedImage && (
                <img src={resizedImage} alt='Resized' className='mt-4 w-[100px] aspect-square' />
            )}
        </div>
    )
}
