import { useEffect } from "react";

interface Props {
    resizedImage: string | null;
    setResizedImage: React.Dispatch<React.SetStateAction<string | null>>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    screenshot: string | null;
    imageSize: number;
    resizedImageRef: React.RefObject<HTMLCanvasElement>;
}

export function ResizedFrame(props: Props) {

    // Resize the image once the screenshot is taken
    useEffect(() => {
        const imageSize = props.imageSize;
        
        if (props.canvasRef.current) {
            // Resize the image to 16x16 pixels
            const canvas = props.canvasRef.current;
            const resizedCanvas = props.resizedImageRef.current!;
            resizedCanvas.width = imageSize;
            resizedCanvas.height = imageSize;
            const resizedContext = resizedCanvas.getContext('2d')!;
            resizedContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, imageSize, imageSize);
            const resizedDataURL = resizedCanvas.toDataURL('image/png');
            props.setResizedImage(resizedDataURL);
        };
    }, [props]);

    return (
        <div>
            <canvas ref={props.resizedImageRef} className='hidden' />

            {props.resizedImage && (
                <img
                    src={props.resizedImage}
                    alt='Resized'
                    className='mt-4 w-[100px] aspect-square'
                />
            )}
        </div>
    );
}