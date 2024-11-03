const express = require('express');
const router = express.Router();
const PromptFunctions = require('../functions/promptFunctions');
const promptFunctions = new PromptFunctions();

router.post('/generate', async(req, res) => {
    try {
        let response = await promptFunctions.createCodeUsing({
            prompt: req.body.prompt,
            primaryColor: req.body.primaryColor,
            secondaryColor: req.body.secondaryColor,
            userId: req.body.userId
        });
        res.status(response.status).json(response.json);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/edit', async(req, res) => {
    try {
        let response = await promptFunctions.editCode({
            code: req.body.code,
            prompt: req.body.prompt
        });
        res.status(response.status).send(response.json);
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
});

router.get('/generated-code', async(req, res) => {
    try {
        let response = await promptFunctions.getCode({
            id: req.query.id
        });
        res.status(response.status).json(response.json);
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
});

module.exports = router;