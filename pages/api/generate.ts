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
    fields: {
      爱情?: { pattern: string; insight: string; action: string };
      事业?: { pattern: string; insight: string; action: string };
      家庭?: { pattern: string; insight: string; action: string };
      友情?: { pattern: string; insight: string; action: string };
    };
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

  // ✅ 新版输入字段
  const { mood, moodDetail, fields, story } = req.body;

  // 简单校验
  if (!mood || !fields || fields.length === 0 || !story) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  try {
    // 调用 DeepSeek API
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一位极其敏锐的人格分析师。你的任务是：根据用户提供的【整体状态】+【选择分析的领域】+【一件具体的事】，给出深度、场景化、不套话的分析。

【重要规则】
1. 只返回一个合法的 JSON 对象，不要返回任何其他文字、解释、Markdown。
2. 用户选择的领域可能是：爱情、事业、家庭、友情、全部。
3. 如果用户选了"全部"，你按优先级输出：爱情 → 事业 → 家庭（友情可选）。
4. 每个领域下，只输出以下三个字段（不要多，不要少）：
   - pattern：这个人在该领域中最核心的行为模式（一句话，不超过30字）
   - insight：一个可能没意识到的深层需求或恐惧（一句话，不超过35字）
   - action：一条非常具体、可执行的小建议（一句话，不超过40字）

5. 除此之外，必须额外输出三个全局字段：
   - tag：用4-8个字给这个人一个标签（如"高敏感型自我审判者"）
   - oneSentence：一句能直接戳中这个人的话（不超过25字）
   - bonus：如果你觉得有一句"不得不说的话"不在上述结构里，放在这里；如果没有，返回空字符串

【输出 JSON 格式（严格按这个结构）】
{
  "global": {
    "tag": "字符串",
    "oneSentence": "字符串",
    "bonus": "字符串"
  },
  "fields": {
    "爱情": { "pattern": "字符串", "insight": "字符串", "action": "字符串" },
    "事业": { "pattern": "字符串", "insight": "字符串", "action": "字符串" },
    "家庭": { "pattern": "字符串", "insight": "字符串", "action": "字符串" },
    "友情": { "pattern": "字符串", "insight": "字符串", "action": "字符串" }
  }
}

注意：用户没选的领域，对应的值可以是 null。
现在，根据用户输入开始分析。`
        },
        {
          role: 'user',
          content: `用户整体状态：${mood}。补充说明：${moodDetail || '无'}。
用户想分析的领域：${fields.join('、')}。
具体事件：${story}`
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    // 解析 JSON，带 fallback
    let report;
    try {
      report = JSON.parse(content || '{}');
      // 如果缺少 global 或 fields，手动补一个默认结构
      if (!report.global) {
        report.global = { tag: '探索者', oneSentence: '你比自己想象的更复杂', bonus: '' };
      }
      if (!report.fields) {
        report.fields = {};
      }
    } catch (e) {
      // 如果 AI 完全不听话，返回一个安全报告
      report = {
        global: { tag: '深度思考者', oneSentence: '你正在成为更完整的自己', bonus: '' },
        fields: {}
      };
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error('AI 调用失败:', error);
    return res.status(500).json({ error: '生成报告失败，请稍后重试' });
  }
}