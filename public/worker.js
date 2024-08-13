const NUM_OUTPUTS = 2;
const IMAGE_SIZE = 40;

class NeuralNetwork {

    weights = [];
    biases = [];

    learningRate;

    static _instance;

    static get instance() {
        if (!NeuralNetwork._instance) {
            throw new Error('NeuralNetwork not initialized');
        }
        return NeuralNetwork._instance;
    }

    static initialize(params) {
        NeuralNetwork._instance = new NeuralNetwork(params);
        return NeuralNetwork._instance
    }

    constructor(params) {
        if (params.layers.length < 2) {
            throw new Error('Invalid number of layers');
        }

        this.learningRate = params.learningRate;

        console.log('Initializing weights and biases...');

        const w = [];
        const b = [];

        for (let i = 0; i < params.layers.length - 1; i++) {
            const layerWeights = [];
            const layerBiases = [];

            for (let j = 0; j < params.layers[i + 1]; j++) {
                const weights = [];
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
    
    feedforward(inputLayer) {
        if (!this.weights || !this.biases || !inputLayer) {
            throw new Error('Weights, biases, or input layer not initialized');
        }

        console.log('Feedforward...');

        // Feedforward
        const activations = [];
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

    backpropogate(activations, expectedOutput) {
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

    predict(inputLayer) {
        return this.feedforward(inputLayer).outputLayer;
    }

    train(inputLayer, expectedOutput) {
        const { outputLayer, activations } = this.feedforward(inputLayer);

        this.backpropogate(activations, expectedOutput);

        return outputLayer;
    }
}


const pixelCount = IMAGE_SIZE * IMAGE_SIZE * 4

NeuralNetwork.initialize({
    layers: [
        pixelCount,
        Math.floor(pixelCount / 3 / 3),
        Math.floor(pixelCount / 3 / 3 / 3),
        NUM_OUTPUTS
    ],
    learningRate: 0.15
});

onmessage = (e) => {
    // console.log("Message received from main script");
    // const workerResult = `Result: ${e.data[0] * e.data[1]}`;
    // console.log("Posting message back to main script");
    const inputLayer = e.data ? JSON.parse(e.data) : null;
    // console.log(`inputLayer: ${inputLayer}`);

    if (!inputLayer) {
        throw new Error('Invalid input layer');
    }

    let outputLayer = [];
    if (inputLayer.type === 'predict') {
        console.log('Predicting...');
        outputLayer = NeuralNetwork.instance.predict(inputLayer.data)
    } else if (inputLayer.type === 'train') {
        console.log('Training...');
        outputLayer = NeuralNetwork.instance.train(inputLayer.data, inputLayer.expected);
    }
    
    postMessage(outputLayer);
  };
  