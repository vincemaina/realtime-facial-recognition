interface ConstructorParams {
    layers: number[];
    learningRate: number;
}

export class NeuralNetwork {

    private weights: number[][][] = [];
    private biases: number[][] = [];

    private readonly learningRate: number;

    static _instance: NeuralNetwork;

    static get instance() {
        if (!NeuralNetwork._instance) {
            throw new Error('NeuralNetwork not initialized');
        }
        return NeuralNetwork._instance;
    }

    static initialize(params: ConstructorParams): NeuralNetwork {
        NeuralNetwork._instance = new NeuralNetwork(params);
        return NeuralNetwork._instance
    }

    private constructor(params: ConstructorParams) {
        if (params.layers.length < 2) {
            throw new Error('Invalid number of layers');
        }

        this.learningRate = params.learningRate;

        console.log('Initializing weights and biases...');

        const w: number[][][] = [];
        const b: number[][] = [];

        for (let i = 0; i < params.layers.length - 1; i++) {
            const layerWeights: number[][] = [];
            const layerBiases: number[] = [];

            for (let j = 0; j < params.layers[i + 1]; j++) {
                const weights: number[] = [];
                for (let k = 0; k < params.layers[i]; k++) {
                    weights.push(Math.random() - 0.5); // Random initialization
                }
                layerWeights.push(weights);
                layerBiases.push(0);
            }

            w.push(layerWeights);
            b.push(layerBiases);
        }

        this.weights = w;
        this.biases = b;
    }
    
    feedforward(inputLayer: number[]): { outputLayer: number[], activations: number[][] } {
        if (!this.weights || !this.biases || !inputLayer) {
            throw new Error('Weights, biases, or input layer not initialized');
        }

        console.log('Feedforward...');

        // Feedforward
        const activations: number[][] = [];
        activations.push(inputLayer);

        for (let i = 0; i < this.weights.length; i++) {
            const layerWeights = this.weights[i];
            const layerBiases = this.biases[i];
            const prevActivations = activations[activations.length - 1];

            const newActivations = layerWeights.map((weights, j) => {
                const weightedSum = weights.reduce((acc, weight, k) => {
                    return acc + weight * prevActivations[k];
                }, layerBiases[j]);

                return 1 / (1 + Math.exp(-weightedSum)); // Sigmoid activation
            });

            activations.push(newActivations);
        }

        return {
            outputLayer: activations[activations.length - 1],
            activations: activations
        }
    }

    backpropogate(activations: number[][], expectedOutput: number[]) {
        console.log('Training...');

        // Calculate the deltas (errors) for the output layer
        let deltas = activations[activations.length - 1].map((output, i) => {
            const error = output - expectedOutput[i];
            return error * output * (1 - output); // Sigmoid derivative
        });

        // Backpropagate the error
        for (let i = this.weights.length - 1; i >= 0; i--) {
            const currentActivations = activations[i + 1];
            const prevActivations = activations[i];

            const newWeights = [...this.weights];
            const newBiases = [...this.biases];

            for (let j = 0; j < newWeights[i].length; j++) {
                for (let k = 0; k < newWeights[i][j].length; k++) {
                    newWeights[i][j][k] -= this.learningRate * deltas[j] * prevActivations[k];
                }
                newBiases[i][j] -= this.learningRate * deltas[j];
            }

            this.weights = newWeights;
            this.biases = newBiases;

            if (i > 0) {
                deltas = prevActivations.map((_, k) => {
                    const sum = this.weights[i].reduce((acc, weights, j) => {
                        return acc + weights[k] * deltas[j];
                    }, 0);
                    return sum * prevActivations[k] * (1 - prevActivations[k]); // Sigmoid derivative
                });
            }
        }
    }

    predict(inputLayer: number[]): number[] {
        return this.feedforward(inputLayer).outputLayer;
    }

    train(inputLayer: number[], expectedOutput: number[]) {
        const { outputLayer, activations } = this.feedforward(inputLayer);

        this.backpropogate(activations, expectedOutput);

        return outputLayer;
    }
}