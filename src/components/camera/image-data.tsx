'use client';

import { useEffect } from "react";

interface Props {
    resizedImageRef: React.RefObject<HTMLCanvasElement>;
    imageData: ImageData | null;
    setImageData: React.Dispatch<React.SetStateAction<ImageData | null>>;
}

export function ImageData(props: Props) {

    useEffect(() => {
        if (props.resizedImageRef.current) {
            const canvas = props.resizedImageRef.current;
            const ctx = canvas.getContext('2d')!;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (imageData.colorSpace !== 'srgb') {
                alert('Image data is not in sRGB colour space');
                return;
            }

            props.setImageData(imageData);
        }
    }, [props]);

    function flattenPixelData(pixelData: ImageData['data']) {
        return Array.from(pixelData);
    }

    return (
        <div>
            {props.imageData && (
                <div className="font-mono text-xs">
                    <h3>Image data</h3>
                    <p>Width: {props.imageData.width}</p>
                    <p>Height: {props.imageData.height}</p>
                    <p>Colour space: {props.imageData.colorSpace}</p>
                    <p>Pixel count: {props.imageData.data.length}</p>
                    <p>Pixel data: {JSON.stringify(flattenPixelData(props.imageData.data), undefined, 2)}</p>
                </div>
            )}
        </div>
    )
}