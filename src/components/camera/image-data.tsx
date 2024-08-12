'use client';

import { useEffect, useState } from "react";

interface Props {
    resizedImageRef: React.RefObject<HTMLCanvasElement>;
}

export function ImageData(props: Props) {
    const [imageData, setImageData] = useState<ImageData | null>(null);

    useEffect(() => {
        if (props.resizedImageRef.current) {
            const canvas = props.resizedImageRef.current;
            const ctx = canvas.getContext('2d')!;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (imageData.colorSpace !== 'srgb') {
                alert('Image data is not in sRGB colour space');
                return;
            }

            setImageData(imageData);
        }
    }, [props]);

    function flattenPixelData(pixelData: ImageData['data']) {
        return Array.from(pixelData);
    }

    return (
        <div>
            {imageData && (
                <div className="font-mono text-xs">
                    <h3>Image data</h3>
                    <p>Width: {imageData.width}</p>
                    <p>Height: {imageData.height}</p>
                    <p>Colour space: {imageData.colorSpace}</p>
                    <p>Pixel count: {imageData.data.length}</p>
                    <p>Pixel data: {JSON.stringify(flattenPixelData(imageData.data), undefined, 2)}</p>
                </div>
            )}
        </div>
    )
}