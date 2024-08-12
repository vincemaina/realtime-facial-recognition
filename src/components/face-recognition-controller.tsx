'use client';

import { useEffect, useState } from "react";
import { LiveCameraController } from "./camera/live-camera-controller";
import { NeuralNetwork } from "./neural-network/neural-network";
import { flattenPixelData } from "./camera/image-data";
import { ConfidenceMeterList } from "./neural-network/confidence-meter-list";

const RESIZED_IMAGE_SIZE = 64;

const NUM_OUTPUTS = 2;

export function FacialRecognitionController() {

    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [inputLayer, setInputLayer] = useState<number[] | null>(null);
    const [outputLayer, setOutputLayer] = useState<number[] | null>(null);
    const [expectedOutput, setExpectedOutput] = useState<number[] | null>(null);
    const [labels, setLabels] = useState<string[]>();
    const [isTraining, setIsTraining] = useState<boolean>(false);
    const [output, setOutput] = useState<number>(0);

    // Produce input layer from image data
    useEffect(() => {
        if (imageData) {            
            setInputLayer(flattenPixelData(imageData.data));
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