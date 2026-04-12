const cleanDescription = (text) => {
  return text
    .replace(/[#*]/g, "")
    .replace(/buy now|order now|limited offer/gi, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
};

export const generateProductDescription = async (title, category) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'ShopFusion'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'minimax/minimax-m2.5',
        messages: [
          {
            role: 'system',
            content: `
You are an e-commerce admin writing product descriptions.

Rules:
- Write simple, natural, human-like text
- Do NOT use markdown (#, ##, **, etc.)
- Do NOT use headings
- Do NOT use marketing or promotional language
- Do NOT include call to action (like "buy now")
- Keep sentences short and clear
- Keep total length under 150-200 words

Format:
- First 1-2 lines: short description
- Then a line: Features:
- Then 6-8 bullet points using "-" only

Tone:
Neutral, practical, like a real admin listing a product
`
          },
          {
            role: 'user',
            content: `Product: ${title}
Category: ${category}

Generate a clean product description.`
          }
        ],
        temperature: 0.4,
        max_tokens: 200
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenRouter API error');
    }
    const rawText = data.choices[0]?.message?.content || '';
    return cleanDescription(rawText);

  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    throw new Error('Failed to generate product description');
  }
};

export const generateChatResponse = async (userMessage, context) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'ShopFusion'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'minimax/minimax-m2.5',
        messages: [
          {
            role: 'system',
            content: `You are a helpful shopping assistant for ShopFusion e-commerce store. ${context}`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    console.log('OpenRouter response:', data);
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenRouter API error');
    }

    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    throw new Error('Failed to generate response');
  }
};

export const getProductRecommendations = async (userHistory, products) => {
  try {
    const productList = products.map(p => `${p.name} - ${p.category} - $${p.price}`).join('\n');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'ShopFusion'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'minimax/minimax-m2.5',
        messages: [
          {
            role: 'system',
            content: 'You are a product recommendation expert. Analyze user preferences and suggest relevant products.'
          },
          {
            role: 'user',
            content: `Based on user purchase/browse history: ${userHistory.join(', ')}\n\nAvailable products:\n${productList}\n\nSuggest top 5 products that match user preferences. Return as a JSON array of product IDs.`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenRouter API error');
    }

    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
    throw new Error('Failed to get recommendations');
  }
};