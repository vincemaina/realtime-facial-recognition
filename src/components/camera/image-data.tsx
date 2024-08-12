'use client';

export function flattenPixelData(pixelData: ImageData['data']): number[] {
    return Array.from(pixelData);
}

interface Props {
    resizedImageRef: React.RefObject<HTMLCanvasElement>;
    imageData: ImageData | null;
}

export function ImageData(props: Props) {
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