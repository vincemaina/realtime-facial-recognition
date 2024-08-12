'use client';

import { useState } from "react";
import { LiveCameraController } from "./camera/live-camera-controller";

export function FacialRecognitionController() {

    const [imageData, setImageData] = useState<ImageData | null>(null);

    return (
        <div>
            <LiveCameraController
                imageData={imageData}
                setImageData={setImageData}
            />
        </div>
    );
}