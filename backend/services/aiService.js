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
            content: 'You are a professional product description writer. Generate compelling, SEO-friendly product descriptions.'
          },
          {
            role: 'user',
            content: `Generate a product description for "${title}" in the "${category}" category. Include key features, benefits, and a call to action. Keep it concise but informative, around 150-200 words.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenRouter API error');
    }

    return data.choices[0]?.message?.content || '';
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