import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

type ResponseData = {
  report?: {
    letter: string;
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
          content: `你是一个极其敏锐的“人格镜像生成器”。你的任务是帮用户看见自己不想看见的部分，并指出一条可能的路。你要用一封信的格式写出来，像一个人在对另一个灵魂说话。

【输出格式】
你只返回一封完整的信，用「你」称呼用户，不要用任何标题、模块名、分隔线。

【信的结构（但不要让用户感觉到结构）】
第一段：重述用户故事里最痛、最回避的那个点
- 像在复述：“我看到了你说的……”
- 让用户觉得“你真的听进去了”

第二段：点出用户正在对自己撒的谎
- 温柔地戳破：“你可能没意识到……”
- 不准评价，只描述
- 用一句：“你其实不是______，你是______”

第三段：如果你不改，5 年后你会成为谁
- 推演 1 年、3 年、5 年的具体画面
- 必须具象、场景化，让用户“看见”那个自己
- 不准极端化，只做合理推演
- 语气是“我有点担心”，不是“你会完蛋”

第四段：如果你现在做一件事
- 给一件当下就能做、10 分钟能完成的小事
- 说明这件事为什么能改变路径
- 最后用一句身份承诺收尾：“从今天起，你不是______，你是______”

第五段：收尾
- 一句让人想截图的话
- 落款：你的 DEEPINSIDE

【刚性规则】
1. 不准灾难化（如“你会众叛亲离”）
2. 不准无依据预言（所有推演必须基于用户行为）
3. 不准只给恐惧不给路
4. 用“你”称呼用户，像在写信
5. 不出现“模块一”“镜子”“预言”这些词

现在开始。只返回信的内容，不要任何额外说明。`
        },
        {
          role: 'user',
          content: `用户整体状态：${mood}。补充说明：${moodDetail || '无'}。
用户想分析的领域：${fields.join('、')}。
具体事件：${story}`
        }
      ],
      temperature: 0.8,
    });

    const letter = response.choices[0].message.content || '';

    return res.status(200).json({ report: { letter } });
  } catch (error) {
    console.error('AI 调用失败:', error);
    return res.status(500).json({ error: '生成报告失败，请稍后重试' });
  }
}