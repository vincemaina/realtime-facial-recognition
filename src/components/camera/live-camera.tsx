'use client';

import { useRef, useEffect } from 'react';

interface LiveCameraProps {
    videoRef: React.RefObject<HTMLVideoElement>;
}

export function LiveCamera(props: LiveCameraProps) {

    useEffect(() => {
        const video = props.videoRef.current;

        async function getVideo() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (props.videoRef.current) {
                    props.videoRef.current.srcObject = stream;
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
        <div className='aspect-video'>
            <video
                ref={props.videoRef}
                autoPlay
                className='bg-black h-full w-full'
            />
        </div>
    );
}
