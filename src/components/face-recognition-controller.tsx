'use client';

import { useEffect, useState } from "react";
import { LiveCameraController } from "./camera/live-camera-controller";
import { NeuralNetwork } from "./neural-network/neural-network";
import { flattenPixelData } from "./camera/image-data";
import { ConfidenceMeterList } from "./neural-network/confidence-meter-list";

const RESIZED_IMAGE_SIZE = 64;

export function FacialRecognitionController() {

    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [inputLayer, setInputLayer] = useState<number[] | null>(null);
    const [outputLayer, setOutputLayer] = useState<number[] | null>(null);
    const [expectedOutput, setExpectedOutput] = useState<number[] | null>(null);
    const [labels, setLabels] = useState<string[]>();
    const [isTraining, setIsTraining] = useState<boolean>(false);

    // Produce input layer from image data
    useEffect(() => {
        if (imageData) {
            console.log('Image data:', imageData);
            
            setInputLayer(flattenPixelData(imageData.data));
        }
    }, [imageData]);

    return (
        <div>
            <button className="bg-black text-white p-3" onClick={() => setIsTraining(!isTraining)}>
                {isTraining ? 'Stop training' : 'Start training'}
            </button>

            <NeuralNetwork
                layers={[RESIZED_IMAGE_SIZE * RESIZED_IMAGE_SIZE * 4, 100, 2]}
                learningRate={0.1}
                inputLayer={inputLayer}
                outputLayer={outputLayer}
                setOutputLayer={setOutputLayer}
                expectedOutput={expectedOutput}
                isTraining={isTraining}
            />

            <ConfidenceMeterList
                outputLayer={outputLayer}
                labels={labels}
            />

            <LiveCameraController
                imageData={imageData}
                setImageData={setImageData}
                imageSize={RESIZED_IMAGE_SIZE}
            />
        </div>
    );
}