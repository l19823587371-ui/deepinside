import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// 从环境变量读取 API Key
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

// ✅ 这里是 type ResponseData（在文件顶部，函数之前）
type ResponseData = {
  report?: {
    tag: string;           // 新增：人格标签
    personality: string;
    pattern: string;
    blindspot: string;
    advice: string;
    oneSentence: string;
    bonus?: string;        // 新增：自由输出
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  // 获取用户输入
  const { keywords, struggle, question } = req.body;

  // 简单校验
  if (!keywords || !struggle || !question) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  try {
    // 调用 DeepSeek API
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一位敏锐的人格分析师。你的风格：温柔但直指本质，不灌鸡汤，不评价好坏，只描述"这个人可能正在经历什么"。

根据用户提供的信息，返回一个 JSON 对象，不要返回任何其他文字。

JSON 格式如下：
{
  "tag": "用 4-8 个字给这个人一个标签，像'高敏感型自我审判者'或'清醒的逃避者'，让人想截图发朋友圈",
  "personality": "一句话概括这个人的人格核心（不超过30字）",
  "pattern": "这个人总是______，因为______（填空式，不超过40字）",
  "blindspot": "这个人可能没意识到______（不超过35字）",
  "advice": "一条非常具体、可执行的小建议（不超过45字）",
  "oneSentence": "一句能直接戳中这个人的话（不超过25字）",
  "bonus": "如果以上字段都不够，你觉得有一句不得不说的话，放在这里。可以不安全、不完美，但要真实、锋利。如果没有，就返回空字符串"
}`
        },
        {
          role: 'user',
          content: `用户用三个词形容自己：${keywords}
最近让 ta 困惑或难受的事：${struggle}
ta 最想解决的问题：${question}`
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    // 解析 JSON
    const report = JSON.parse(content || '{}');

    return res.status(200).json({ report });
  } catch (error) {
    console.error('AI 调用失败:', error);
    return res.status(500).json({ error: '生成报告失败，请稍后重试' });
  }
}