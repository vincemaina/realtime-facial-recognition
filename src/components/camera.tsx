'use client';

import { useRef, useEffect } from 'react';

export function Camera() {
    
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {

        const video = videoRef.current;

        async function getVideo() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
            }
        }

        getVideo();

        return () => {
            if (video && video.srcObject) {
                (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className='h-[500px] aspect-video'>
            <video
                ref={videoRef}
                autoPlay
                className='bg-black h-full w-full'
            />
        </div>
    );
}
