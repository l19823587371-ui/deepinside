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
    domain_insights?: {
      爱情?: { pattern: string; fear: string; advice: string };
      事业?: { pattern: string; fear: string; advice: string };
      家庭?: { pattern: string; fear: string; advice: string };
      友情?: { pattern: string; fear: string; advice: string };
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

  // ✅ 新版输入字段（来自页面1 + 页面2）
  const { mood, moodDetail, fields, story, domain_answers } = req.body;

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
          content: `你是一位极其敏锐的人格分析师。你的风格：温柔但直指本质，不灌鸡汤，不评价好坏，只描述"这个人可能正在经历什么"。

【用户提供的信息】
- 整体状态：\${mood}
- 补充说明：\${moodDetail}
- 想分析的领域：\${fields}
- 具体事件：\${story}
- 各领域选择题答案：\${domain_answers}

【重要规则】
1. 只返回一个合法的 JSON 对象，不要返回任何其他文字、解释、Markdown。
2. 用户选择的领域可能是：爱情、事业、家庭、友情中的一个或多个。
3. 如果用户提供了某个领域的 domain_answers，你必须为该领域生成 domain_insights。
4. 每个领域的 domain_insights 只输出以下三个字段：
   - pattern：这个人在该领域中最核心的行为模式（一句话，不超过30字）
   - fear：这个人最怕的是什么（一句话，不超过25字）
   - advice：一条非常具体、可执行的小建议（一句话，不超过35字）

5. 除此之外，必须输出以下全局字段：
   - tag：用4-8个字给这个人一个标签（如"高敏感型自我审判者"）
   - personality：一句话概括人格核心（不超过30字）
   - pattern：这个人总是______，因为______（填空式，不超过40字）
   - blindspot：这个人可能没意识到______（不超过35字）
   - advice：一条可执行的小建议（不超过45字）
   - oneSentence：一句能直接戳中这个人的话（不超过25字）
   - bonus：如果你觉得有一句"不得不说的话"不在上述结构里，放在这里；如果没有，返回空字符串

【输出 JSON 格式（严格按这个结构）】
{
  "global": {
    "tag": "字符串",
    "oneSentence": "字符串",
    "bonus": "字符串"
  },
  "personality": "字符串",
  "pattern": "字符串",
  "blindspot": "字符串",
  "advice": "字符串",
  "domain_insights": {
    "爱情": { "pattern": "字符串", "fear": "字符串", "advice": "字符串" },
    "事业": { "pattern": "字符串", "fear": "字符串", "advice": "字符串" },
    "家庭": { "pattern": "字符串", "fear": "字符串", "advice": "字符串" },
    "友情": { "pattern": "字符串", "fear": "字符串", "advice": "字符串" }
  }
}

注意：domain_insights 中只输出用户选择的领域，未选择的不要输出。
现在，根据用户输入开始分析。`
        },
        {
          role: 'user',
          content: `用户整体状态：${mood}。补充说明：${moodDetail || '无'}。
用户想分析的领域：${fields.join('、')}。
具体事件：${story}。
领域选择题答案：${JSON.stringify(domain_answers || {})}`
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    // 解析 JSON，带 fallback
    let report;
    try {
      report = JSON.parse(content || '{}');
      // 确保 global 字段存在
      if (!report.global) {
        report.global = { tag: '探索者', oneSentence: '你比自己想象的更复杂', bonus: '' };
      }
      // 确保基础字段存在
      if (!report.personality) report.personality = '你是一个在成长中不断探索的人';
      if (!report.pattern) report.pattern = '你总是在思考，因为你在意';
      if (!report.blindspot) report.blindspot = '你比自己想象的更有力量';
      if (!report.advice) report.advice = '试着相信自己的直觉';
      // 确保 domain_insights 存在
      if (!report.domain_insights) report.domain_insights = {};
    } catch (e) {
      // 如果 AI 完全不听话，返回一个安全报告
      report = {
        global: { tag: '深度思考者', oneSentence: '你正在成为更完整的自己', bonus: '' },
        personality: '你是一个独特的个体',
        pattern: '你总是在寻找答案，因为你想要更好的生活',
        blindspot: '你可能低估了自己的韧性',
        advice: '给自己一点时间，答案会慢慢浮现',
        domain_insights: {}
      };
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error('AI 调用失败:', error);
    return res.status(500).json({ error: '生成报告失败，请稍后重试' });
  }
}