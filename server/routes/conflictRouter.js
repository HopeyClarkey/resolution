const express = require('express');
const conflictRouter = express.Router();
const { OverviewConflicts } = require('../database/index.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

conflictRouter.post('/judge', async (req, res) => {
  const { promptA, promptB } = req.body;

  if (!promptA || !promptB) {
    return res.status(400).send({ error: "Both Side A and Side B arguments are required." });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: "You are an impartial, highly analytical judge. Your goal is to review two conflicting arguments and render a clear verdict. You must decide on a winner (or call it a tie if absolutely necessary) and provide deep reasoning based on logic and ethics. Return your response ONLY as a JSON object with the following structure: { 'winner': string, 'reasoning': string, 'confidenceScore': number (1-10) }",
    });

    const prompt = `
      JUDICIAL CASE REVIEW REQUEST:
      
      SIDE A ARGUMENT:
      """
      ${promptA}
      """
      
      SIDE B ARGUMENT:
      """
      ${promptB}
      """
      
      Please analyze both perspectives and render your official verdict in the specified JSON format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim(); // Clean up potential markdown formatting
    
    res.status(200).send(JSON.parse(text));
  } catch (err) {
    console.error('Judge Error:', err);
    res.status(500).send({ error: "The judge encountered a legal loophole. Please try again later." });
  }
});

conflictRouter.get('/api/getAllConflicts', (req, res) => {
    OverviewConflicts.findAll({})
    .then((results) => {
        res.status(200).send(results)
    })
    .catch((err) => {
        console.error(err)
        res.sendStatus(500)
    })
})

conflictRouter.post('/api/createConflict', (req, res) => {
    OverviewConflicts.create(req.body)
    .then((results) => {
        res.sendStatus(200)
    })
    .catch((err) => {
        console.error(err)
        res.sendStatus(500)
    })
})

conflictRouter.patch(`/api/updateStatus`, (req, res) => {
    const { id, conflictStatus } = req.body;
  OverviewConflicts.update({ conflictStatus }, { where: { id } })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
    
})

conflictRouter.delete('/api/deleteConflict/:id', (req, res) => {
    const {id} = req.params
    OverviewConflicts.destroy({
        where: {id}
    })
    .then(() => {
        res.sendStatus(200)

    })
    .catch(() => {
        res.sendStatus(500)
    })
})

module.exports = conflictRouter;
