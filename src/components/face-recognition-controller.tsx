'use client';

import { useState } from "react";
import { LiveCameraController } from "./camera/live-camera-controller";

const RESIZED_IMAGE_SIZE = 64;

export function FacialRecognitionController() {

    const [imageData, setImageData] = useState<ImageData | null>(null);

    return (
        <div>
            <LiveCameraController
                imageData={imageData}
                setImageData={setImageData}
                imageSize={RESIZED_IMAGE_SIZE}
            />
        </div>
    );
}