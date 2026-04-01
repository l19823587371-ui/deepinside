import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// 从环境变量读取 API Key
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

type ResponseData = {
  report?: {
    mirror_a: string;
    mirror_b: string;
    path: string;
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
          content: `你是一个极其敏锐的“人格镜像生成器”。

【绝对规则】
1. 你必须只返回一个 JSON 对象，不要返回任何其他文字、解释、Markdown、前后缀。
2. JSON 的 key 必须是 mirror_a、mirror_b、path，且每个 value 必须是字符串。
3. 如果不按这个格式返回，你的输出将无法被解析，用户会看到错误信息。

【输出示例】
{
  "mirror_a": "模块一的内容",
  "mirror_b": "模块二的内容",
  "path": "模块三的内容"
}

模块一：你现在在做什么
- 重述用户故事里最痛、最回避的那个点
- 点出用户正在对自己撒的谎
- 用一句话戳破：“你其实不是______，你是______”

模块二：如果你不改，5 年后你会成为谁
- 基于模块一的行为模式，推演 1 年、3 年、5 年的具体画面
- 必须具象、场景化，让用户“看见”那个自己
- 不准极端化，只做合理推演

模块三：如果你现在做一件事
- 给一件当下就能做、10 分钟能完成的小事
- 说明这件事为什么能改变路径
- 最后用一句身份承诺收尾：“从今天起，你不是______，你是______”

【刚性规则】
1. 不准灾难化（如“你会众叛亲离”）
2. 不准无依据预言（所有推演必须基于用户行为）
3. 不准只给恐惧不给路（必须三个模块完整输出）

现在开始。只返回 JSON。`
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

    const rawContent = response.choices[0].message.content || '';
    
    // 清理可能存在的 markdown 代码块
    let cleanContent = rawContent.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '');
    }
    
    // 解析 JSON，带 fallback
    let report;
    try {
      const parsed = JSON.parse(cleanContent);
      report = {
        mirror_a: parsed.mirror_a || '暂时无法解析这个模块',
        mirror_b: parsed.mirror_b || '暂时无法解析这个模块',
        path: parsed.path || '暂时无法解析这个模块'
      };
    } catch (e) {
      console.error('JSON 解析失败，原始内容:', rawContent);
      // 如果解析失败，返回一个更友好的提示，而不是简陋的 fallback
      report = {
        mirror_a: '我看到了你的故事，但暂时无法完整解析。请稍后重试一次。',
        mirror_b: '你的故事值得被认真对待。稍后再试，我会给你更好的回应。',
        path: '今天，先做一件让你觉得“我在照顾自己”的小事。哪怕只有 5 分钟。'
      };
    }

    return res.status(200).json({ report });
  } catch (error) {
    console.error('AI 调用失败:', error);
    return res.status(500).json({ error: '生成报告失败，请稍后重试' });
  }
}