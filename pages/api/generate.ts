import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// 从环境变量读取 API Key
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

type ResponseData = {
  report?: {
    global: {
      tag: string;
      oneSentence: string;
      bonus: string;
    };
    personality: string;
    pattern: string;
    blindspot: string;
    advice: string;
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  const { mood, moodDetail, fields, story } = req.body;

  if (!mood || !fields || fields.length === 0 || !story) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一位极其敏锐的人格分析师。你的风格：温柔但直指本质，不灌鸡汤，不评价好坏。

【核心任务】
用户会告诉你：
- 整体状态：{mood}
- 想分析的领域：{fields}
- 一件具体的事：{story}

请仔细阅读用户写的具体故事（story），从中提取情绪、行为模式、深层恐惧。不要用通用套话，要针对用户描述的具体细节给出分析。

【输出格式】
只返回一个 JSON 对象，不要返回任何其他文字。

{
  "global": {
    "tag": "用4-8个字给这个人一个标签，如'高敏感型自我审判者'",
    "oneSentence": "一句能直接戳中这个人的话（不超过25字）",
    "bonus": "如果你觉得有一句不得不说的话，放在这里；如果没有，返回空字符串"
  },
  "personality": "一句话概括这个人的人格核心（不超过30字）",
  "pattern": "这个人总是______，因为______（填空式，不超过40字）",
  "blindspot": "这个人可能没意识到______（不超过35字）",
  "advice": "一条非常具体、可执行的小建议（不超过45字）"
}

现在，开始分析。`
        },
        {
          role: 'user',
          content: `用户整体状态：${mood}。补充说明：${moodDetail || '无'}。
用户想分析的领域：${fields.join('、')}。
用户写的具体故事：${story}`
        }
      ],
      temperature: 0.8,  // 稍微提高，让输出更有惊喜感
    });

    const content = response.choices[0].message.content;
    
    let report;
    try {
      report = JSON.parse(content || '{}');
      // fallback：如果缺少字段，补默认值
      if (!report.global) {
        report.global = { tag: '探索者', oneSentence: '你比自己想象的更复杂', bonus: '' };
      }
      if (!report.personality) report.personality = '正在成为更完整的自己';
      if (!report.pattern) report.pattern = '在觉察中成长';
      if (!report.blindspot) report.blindspot = '你比你认为的更勇敢';
      if (!report.advice) report.advice = '相信你的直觉';
    } catch (e) {
      report = {
        global: { tag: '深度思考者', oneSentence: '你正在成为更完整的自己', bonus: '' },
        personality: '独特且复杂的存在',
        pattern: '在思考中前行',
        blindspot: '你比你想象的更有力量',
        advice: '给自己一点耐心'
      };
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error('AI 调用失败:', error);
    return res.status(500).json({ error: '生成报告失败，请稍后重试' });
  }
}