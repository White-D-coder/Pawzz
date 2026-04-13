import OpenAI from 'openai';
const CHATBOT_ID = '000000000000000000000001';

export const getChatbotResponse = async (userMessage, chatHistory = []) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ No OpenAI API Key found. Using Mock Chatbot Response.');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "Woof! 🐾 I'm the PAWZZ AI Assistant. I see you're asking about '" + userMessage + "'. Currently, I'm in demo mode, but once the API key is set, I can help you with pet care, bookings, and more!";
  }

  const openai = new OpenAI({ apiKey });

  try {
    const messages = [
      { 
        role: "system", 
        content: "You are the PAWZZ AI Assistant, a helpful and knowledgeable pet care expert. You assist users with questions about dogs, cats, pet health, adoption, and how to use the PAWZZ platform (pet clinic bookings, NGO volunteering, etc.). Keep your tone friendly, encouraging, and professional. Use emojis like 🐾, 🐶, 🐱 where appropriate." 
      },
      ...chatHistory.map(msg => ({
        role: msg.senderId.toString() === CHATBOT_ID ? "assistant" : "user",
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('❌ Chatbot AI Error:', error);
    return "I'm sorry, I'm having a bit of trouble thinking right now. 🐾 Please try again in a moment!";
  }
};
