'use client';

import { useEffect, useRef, useState } from "react";

interface FrameProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    frequency?: number;
}

export function Frame(props: FrameProps) {
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);

    function takeScreenshot() {
        if (props.videoRef.current && canvasRef.current) {
            console.log('Taking screenshot');
            
            const canvas = canvasRef.current;
            const video = props.videoRef.current;
            const context = canvas.getContext('2d')!;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL('image/png');
            setScreenshot(dataURL);
        }
    }

    useEffect(() => {
        const delay = 1000 / (props.frequency || 1);
        const interval = setInterval(takeScreenshot, delay);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-auto">
            <canvas ref={canvasRef} className='hidden' />

            {screenshot && (
                <img src={screenshot} alt='Screenshot' className='mt-4' />
            )}
        </div>
    )
}
