const axios = require("axios");
const Prompt = require("../model/prompt");
require('dotenv').config();


const openAIHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
};


class PromptFunctions {
    constructor() {
        this.promptFunctions = {};
    }

    async createCodeUsing ({prompt, primaryColor, secondaryColor, userId}) {
        try {
            const messages = [
                {
                    role: 'system',
                    content: `Generate a complete, single-page website layout in React and Tailwind CSS code, returning only the code with no additional output or commentary. The layout should be professional, SEO-optimized, and modern, with a templated design that is responsive across devices. Use an accent color for key elements (e.g., buttons, headers, icons) as specified in the user prompt to ensure brand consistency.
                    
                    Include structured sections based on user input, such as "services," "about," "contact," or "testimonials." For any images required, use this link: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_HeSzHfBorKS4muw4IIeVvvRgnhyO8Gn8w&s". Text content should be meaningful and contextually relevant, rather than default placeholder text. 
            
                    Apply varied gradient colors for backgrounds and text for a visually engaging design. Ensure the layout is fully responsive, optimized for mobile, tablet, and desktop screens, with each section using a minimum of 100% of the screen width and height.
            
                    Use Tailwind CSS classes correctly, with random property values enclosed in brackets (e.g., color-[#ccc]).

                    Do not import anything in code except react, if anycase any state management tool need then use like this: const [state, setState] = React.useState(null);

                    Use default things, like if you create any kind of front page use navbar and footer, use image in header section, All section not looks similar.

                    The returned code should be organized and include comments to explain each main section, utilizing Tailwind CSS utilities to create a modern, engaging design aesthetic. Ensure the sections are filled with appropriate text and content so they do not appear empty.`
                },
                {
                    role: 'user',
                    content: `Please create a single-page website using React and Tailwind CSS. Include only the code, with no additional output. Add the following sections: ${prompt}. Use ${primaryColor} as the primary color and ${secondaryColor} as the secondary color for highlights like buttons and headings. Ensure the code is SEO-friendly, responsive, and includes comments for each section.`
                }
            ];
            

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o',
                    messages: messages,
                    max_tokens: 2500,
                    temperature: 0.5,
                },
                { headers: openAIHeaders }
            );

            let code = response.data.choices[0].message.content;

            code = code.replace("```jsx\n", '');
            code = code.replace("```", '');

            let rectiFyCode = this.#reviewAndFixCode(code);


            let promptCreate = await Prompt.create({
                userId,
                prompt,
                response: rectiFyCode,
                primaryColor,
                secondaryColor
            });

            return {
                status: 200,
                json: promptCreate
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                json: 'Internal Server Error'
            };
        }
    }
    
    async editCode ({targetedCode, prompt, promptId}) {
        try {
            const messages = [
                { role: 'system', content: 'Edit the given code to make it more readable and maintainable. Do not change the functionality of the code. Return only the edited code(only jsx format), with no additional output, commentary or any kind of internal code comentary.' },
                { role: 'user', content: `Please edit the following code: ${targetedCode}. Add comments for each section using Tailwind CSS utilities to achieve a modern, engaging design aesthetic. ${prompt}` },
            ];

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o',
                    messages: messages,
                    max_tokens: 1500,
                    temperature: 1,
                },
                { headers: openAIHeaders }
            );

            let code = response.data.choices[0].message.content;

            code = code.replace("```jsx\n", '');
            code = code.replace("```\n", '');

            let rectiFyCode = this.#reviewAndFixCode(code);

            return {
                status: 200,
                json: response.data.choices[0].message.content
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                json: 'Internal Server Error'
            };
        }
    }

    async getCode ({id}) {
        try {
            let prompt = await Prompt.findById(id);
            return {
                status: 200,
                json: prompt
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                json: 'Internal Server Error'
            };
        }
    }

    #reviewAndFixCode(code) {
        const importRegex = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]react-icons\/[a-z]+['"]/gi;
        const iconsUsed = [];
        
        let match;
        while ((match = importRegex.exec(code)) !== null) {
            const icons = match[1].split(',').map(icon => icon.trim());
            iconsUsed.push(...icons);
        }
    
        // Step 2: Replace incorrect icon usage with the correct JSX syntax
        iconsUsed.forEach(icon => {
            const incorrectUsageRegex = new RegExp(`<\\s*${icon.toLowerCase()}\\s*\\/\\s*>`, 'gi');
            code = code.replace(incorrectUsageRegex, `<${icon} />`);
        });
    
        return code;
    }
    
}


module.exports = PromptFunctions;