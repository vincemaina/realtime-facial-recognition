'use client';

import { useEffect, useState } from "react";
import { LiveCameraController } from "./camera/live-camera-controller";
import { flattenPixelData } from "./camera/image-data";
import { ConfidenceMeterList } from "./neural-network/confidence-meter-list";

const RESIZED_IMAGE_SIZE = 40;
const NUM_OUTPUTS = 2;


export function FacialRecognitionController() {

    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [outputLayer, setOutputLayer] = useState<number[] | null>(null);
    const [expectedOutput, setExpectedOutput] = useState<number[] | null>(null);
    const [labels, setLabels] = useState<string[]>();
    const [isTraining, setIsTraining] = useState<boolean>(false);
    const [output, setOutput] = useState<number>(0);
    const [worker, setWorker] = useState<Worker | null>(null);

    useEffect(() => {
        const newWorker = new Worker('worker.js');

        // Set up event listener for messages from the worker
        newWorker.onmessage = function (event) {
            // console.log('Received result from worker:', event.data);
            setOutputLayer(event.data);
        };

        setWorker(newWorker);

        // Clean up the worker when the component unmounts
        return () => {
            newWorker.terminate();
        };
    }, [])

    // Produce input layer from image data
    useEffect(() => {
        if (imageData) {            
            const inputLayer = flattenPixelData(imageData.data);

            // Send a message to the worker
            if (worker) {
                if (isTraining) {
                    if (!expectedOutput) {
                        throw new Error('Expected output not set');
                    }
                }
                worker.postMessage(JSON.stringify({
                    type: isTraining ? 'train' : 'predict',
                    data: inputLayer,
                    expected: isTraining ? expectedOutput : null
                }));
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