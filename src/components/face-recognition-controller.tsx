'use client';

import { useEffect, useRef, useState } from "react";
import { LiveCameraController } from "./camera/live-camera-controller";
import { flattenPixelData } from "./camera/image-data";
import { ConfidenceMeterList } from "./neural-network/confidence-meter-list";
import { NeuralNetwork } from "./neural-network/neural-network";

const RESIZED_IMAGE_SIZE = 64;

const NUM_OUTPUTS = 2;

export function FacialRecognitionController() {

    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [outputLayer, setOutputLayer] = useState<number[] | null>(null);
    const [expectedOutput, setExpectedOutput] = useState<number[] | null>(null);
    const [labels, setLabels] = useState<string[]>();
    const [isTraining, setIsTraining] = useState<boolean>(false);
    const [output, setOutput] = useState<number>(0);

    useEffect(() => {
        const pixelCount = RESIZED_IMAGE_SIZE * RESIZED_IMAGE_SIZE * 4
        NeuralNetwork.initialize({
            layers: [
                pixelCount,
                Math.floor(pixelCount / 3),
                Math.floor(pixelCount / 3 / 3),
                Math.floor(pixelCount / 3 / 3 / 3),
                NUM_OUTPUTS
            ],
            learningRate: 0.1
        });
    }, [])

    // Produce input layer from image data
    useEffect(() => {
        if (imageData) {            
            const inputLayer = flattenPixelData(imageData.data);
            
            if (isTraining) {
                if (!expectedOutput) {
                    throw new Error('Expected output not set');
                }
                setOutputLayer(NeuralNetwork.instance.train(inputLayer, expectedOutput));
            } else {
                setOutputLayer(NeuralNetwork.instance.predict(inputLayer));
            }
        }
    }, [imageData]);

    // Set expected output based on output
    useEffect(() => {
        if (output === 0) {
            setExpectedOutput([1, 0]);
        } else {
            setExpectedOutput([0, 1]);
        }
    }, [output]);

    return (
        <div>
            <button className="bg-black text-white p-3" onClick={() => setIsTraining(!isTraining)}>
                {isTraining ? 'Stop training' : 'Start training'}
            </button>

            <button className="bg-black text-white p-3" onClick={() => setOutput((output + 1) % NUM_OUTPUTS)}>
                Output: {output} {JSON.stringify(expectedOutput)}
            </button>

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