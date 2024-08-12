import { useEffect } from "react";

interface Props {
    resizedImage: string | null;
    setResizedImage: React.Dispatch<React.SetStateAction<string | null>>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    screenshot: string | null;
}

export function ResizedFrame(props: Props) {

    // Resize the image once the screenshot is taken
    useEffect(() => {
        const IMAGE_SIZE = 64;
        if (props.canvasRef.current) {
            // Resize the image to 16x16 pixels
            const canvas = props.canvasRef.current;
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = IMAGE_SIZE;
            resizedCanvas.height = IMAGE_SIZE;
            const resizedContext = resizedCanvas.getContext('2d')!;
            resizedContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
            const resizedDataURL = resizedCanvas.toDataURL('image/png');
            props.setResizedImage(resizedDataURL);
        };
    }, [props]);

    return (
        <div>
            {props.resizedImage && (
                <img src={props.resizedImage} alt='Resized' className='mt-4 w-[100px] aspect-square' />
            )}
        </div>
    );
}