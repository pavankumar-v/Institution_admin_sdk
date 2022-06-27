import * as tf from "@tensorflow/tfjs-node";

const xs = tf.tensor([
  [0, 0, 0, 0, 15],
  [0, 0, 0, 0, 15],
  [0, 25, 10, 4, 10],
  [1, 35, 13, 6, 9],
  [2, 42, 16, 7, 8],
  [4, 73, 23, 10, 2],
  [6, 96, 29, 10, 1],
  [5, 85, 25, 10, 3],
  [3, 66, 22, 9, 5],
  [2, 52, 17, 7, 8],
  [3, 69, 25, 10, 2],
  [4, 71, 23, 9, 6],
  [2, 51, 17, 8, 0],
  [3, 66, 20, 10, 0],
  [4, 80, 26, 10, 2],
  [2, 45, 15, 10, 0],
  [3, 63, 20, 8, 3],
  [6, 98, 30, 10, 5],
  [5, 89, 29, 10, 1],
  [3, 59, 19, 9, 8],
  [2, 49, 14, 7, 9],
  [1, 36, 13, 5, 1],
  [2, 56, 20, 8, 2],
  [3, 68, 22, 10, 5],
  [4, 85, 25, 10, 8],
  [3, 63, 21, 10, 0],
  [2, 49, 20, 10, 0],
  [4, 79, 22, 5, 8],
  [5, 88, 22, 6, 6],
]);
const ys = tf.tensor2d(
  [
    0, 0, 27, 45, 55, 78, 98, 87, 73, 52, 79, 74, 59, 78, 82, 49, 69, 98, 95,
    58, 45, 43, 63, 69, 86, 75, 60, 78, 87,
  ],
  [29, 1]
);

//  Model ----------
const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [5] }));

const learningRate = 0.0001;
const optimizer = tf.train.sgd(learningRate);

model.compile({
  loss: "meanSquaredError",
  optimizer: optimizer,
});

const service = {
  model,
  tf,
  xs,
  ys,
};

export default service;
