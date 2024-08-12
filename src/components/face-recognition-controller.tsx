'use client';

import { useEffect, useState } from "react";
import { LiveCameraController } from "./camera/live-camera-controller";
import { NeuralNetwork } from "./neural-network/neural-network";
import { flattenPixelData } from "./camera/image-data";

const RESIZED_IMAGE_SIZE = 64;

export function FacialRecognitionController() {

    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [inputLayer, setInputLayer] = useState<number[] | null>(null);
    const [outputLayer, setOutputLayer] = useState<number[] | null>(null);
    const [expectedOutput, setExpectedOutput] = useState<number[] | null>(null);

    // Produce input layer from image data
    useEffect(() => {
        if (imageData) {
            setInputLayer(flattenPixelData(imageData.data));
        }
    }, [imageData]);

    return (
        <div>
            <NeuralNetwork
                layers={[RESIZED_IMAGE_SIZE * RESIZED_IMAGE_SIZE, 100, 10]}
                learningRate={0.1}
                inputLayer={inputLayer}
                outputLayer={outputLayer}
                setOutputLayer={setOutputLayer}
                expectedOutput={expectedOutput}
            />
            
            <LiveCameraController
                imageData={imageData}
                setImageData={setImageData}
                imageSize={RESIZED_IMAGE_SIZE}
            />
        </div>
    );
}