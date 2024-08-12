'use client';

import { useEffect, useState } from "react";

interface Props {
    layers: number[];
    learningRate: number;
    inputLayer: number[] | null;
    outputLayer: number[] | null;
    setOutputLayer: React.Dispatch<React.SetStateAction<number[] | null>>;
    expectedOutput: number[] | null;
}

export function NeuralNetwork(props: Props) {

    const [weights, setWeights] = useState<number[][][]>();
    const [biases, setBiases] = useState<number[][]>();

    // Initialize weights and biases when the layers change
    useEffect(() => {
        if (props.layers.length < 2) {
            return;
        }

        const w: number[][][] = [];
        const b: number[][] = [];

        for (let i = 0; i < props.layers.length - 1; i++) {
            const layerWeights: number[][] = [];
            const layerBiases: number[] = [];

            for (let j = 0; j < props.layers[i + 1]; j++) {
                const weights: number[] = [];
                for (let k = 0; k < props.layers[i]; k++) {
                    weights.push(Math.random() - 0.5); // Random initialization
                }
                layerWeights.push(weights);
                layerBiases.push(0);
            }

            w.push(layerWeights);
            b.push(layerBiases);
        }

        setWeights(w);
        setBiases(b);
    }, [props.layers]);

    const inputLayer = props.inputLayer
    const outputLayer = props.outputLayer;
    const expectedOutput = props.expectedOutput;

    useEffect(() => {
        if (!weights || !biases || !inputLayer) {
            return;
        }

        // Feedforward
        const activations: number[][] = [];
        activations.push(inputLayer);

        for (let i = 0; i < weights.length; i++) {
            const layerWeights = weights[i];
            const layerBiases = biases[i];
            const prevActivations = activations[activations.length - 1];

            const newActivations = layerWeights.map((weights, j) => {
                const weightedSum = weights.reduce((acc, weight, k) => {
                    return acc + weight * prevActivations[k];
                }, layerBiases[j]);

                return 1 / (1 + Math.exp(-weightedSum)); // Sigmoid activation
            });

            activations.push(newActivations);
        }

        props.setOutputLayer(activations[activations.length - 1]);

    }, [inputLayer, weights, biases]);

    // Backpropagation for training after each drawing
    const train = (expectedOutput: number[]) => {
        if (!weights || !biases || !inputLayer || !outputLayer) {
            return;
        }

        const activations: number[][] = [];
        activations.push(inputLayer);
        
        // Feedforward (same as above)
        for (let i = 0; i < weights.length; i++) {
            const layerWeights = weights[i];
            const layerBiases = biases[i];
            const prevActivations = activations[activations.length - 1];

            const newActivations = layerWeights.map((weights, j) => {
                const weightedSum = weights.reduce((acc, weight, k) => {
                    return acc + weight * prevActivations[k];
                }, layerBiases[j]);

                return 1 / (1 + Math.exp(-weightedSum)); // Sigmoid activation
            });

            activations.push(newActivations);
        }

        // Calculate the deltas (errors) for the output layer
        let deltas = activations[activations.length - 1].map((output, i) => {
            const error = output - expectedOutput[i];
            return error * output * (1 - output); // Sigmoid derivative
        });

        // Backpropagate the error
        for (let i = weights.length - 1; i >= 0; i--) {
            const currentActivations = activations[i + 1];
            const prevActivations = activations[i];

            const newWeights = [...weights];
            const newBiases = [...biases];

            for (let j = 0; j < newWeights[i].length; j++) {
                for (let k = 0; k < newWeights[i][j].length; k++) {
                    newWeights[i][j][k] -= props.learningRate * deltas[j] * prevActivations[k];
                }
                newBiases[i][j] -= props.learningRate * deltas[j];
            }

            setWeights(newWeights);
            setBiases(newBiases);

            if (i > 0) {
                deltas = prevActivations.map((_, k) => {
                    const sum = weights[i].reduce((acc, weights, j) => {
                        return acc + weights[k] * deltas[j];
                    }, 0);
                    return sum * prevActivations[k] * (1 - prevActivations[k]); // Sigmoid derivative
                });
            }
        }
    };

    if (!weights || !biases) {
        return <div>Loading...</div>;
    }

    function handleDrawingComplete() {
        train(expectedOutput!); // Train network after each drawing
    }

    return (
        <div className="flex gap-10 justify-center items-center select-none">
            Neural network
        </div>
    );
}
