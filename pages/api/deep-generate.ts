import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

type ResponseData = {
  report?: {
    root: string;        // 根源拆解
    pathA: string;       // 路径A（不改）
    pathB: string;       // 路径B（改）
    warning: string;     // 风险预警
    map: string;         // 破局地图
    promise: string;     // 一句话承诺
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

  // 深度版需要的输入
  const { originalStory, answer1, answer2, answer3 } = req.body;

  if (!originalStory || !answer1 || !answer2 || !answer3) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一个极其敏锐的“深度人格镜像师”。你的任务是，基于用户原来的故事，以及 ta 对 3 个追问的回答，写一份“深度拆解报告”。这份报告要像一个人坐在 ta 对面，温柔地说出 ta 自己都没看清的东西。

【输出结构】严格按照以下 6 个模块输出 JSON 格式，每个模块用第二人称“你”来写，不要出现任何心理学专业术语，只讲人话。

输出 JSON 格式：
{
  "root": "根源拆解的内容",
  "pathA": "路径A（不改）的内容",
  "pathB": "路径B（改）的内容",
  "warning": "风险预警的内容",
  "map": "破局地图的内容",
  "promise": "一句话承诺的内容"
}

---

模块一：根源拆解
- 从 answer1 里，找到那个“最早的时刻”
- 用这样的句式：“你其实从那时候起，就学会了一件事：______”
- 解释这个“学会”的行为，在当时是怎么保护 ta 的
- 最后说一句：“那不是你的错，那是你当时能想到的最好办法。”

---

模块二：双路径推演
- 路径A（如果你继续现在的方式）：
  基于用户的行为模式，推演 1 年、3 年、5 年的具体画面
  用“我有点担心”开头，语气是“这不是诅咒，是可能”
  每一年的画面都要具象：场景、情绪、关系里的样子
  
- 路径B（如果你开始做那件小事）：
  基于 answer3，推演如果坚持那件小事，1 年、3 年、5 年会变成什么样
  用“但我看到另一种可能”开头
  每一年的画面都要让用户觉得“我想要这个”

---

模块三：风险预警
- 基于 answer2，找出用户“最不想失去的东西”
- 用这样的句式：“如果你发现______，那就是一个信号”
- 指出在路径A里，哪些节点最可能让 ta 失去那个东西
- 语气是“你可以留意”，不是“你会完蛋”

---

模块四：破局地图
- 基于 answer3，把“那件小事”拆成 30 天版本
- 分 4 个阶段，用“第 1 周、第 2 周、第 3 周、第 4 周”
- 每个阶段只说 1 件事，用一句话说明“为什么这样做有用”

第 1 周：只做那件事，不追求结果
为什么：你在告诉自己“我可以行动，不需要完美”

第 2 周：每次做完，记一句话感受
为什么：你在把“行动”和“感受”连起来，不再麻木

第 3 周：主动把这件事和“你最不想失去的东西”连起来
为什么：你在让这件小事变得有意义，不只是“在做事”

第 4 周：问自己“如果我继续这样，我会成为谁”
为什么：你在选择身份，不只是选择行为

---

模块五：一句话承诺
- 从用户的回答里（answer1/answer2/answer3），提炼一句身份宣言
- 格式：“从今天起，我不是______，我是______”
- 这句话要让用户想截图、想发朋友圈
- 不用解释，直接给这句话

【刚性规则】
1. 不准出现任何专业术语
2. 不准灾难化
3. 不准只给恐惧不给路
4. 用“你”称呼，像在写信
5. 整份报告不超过 1200 字

现在开始。只返回 JSON。`
        },
        {
          role: 'user',
          content: `用户原始故事：${originalStory}

追问1（最早从什么时候开始）：${answer1}

追问2（最不想失去什么）：${answer2}

追问3（坚持 30 天最大的变化）：${answer3}`
        }
      ],
      temperature: 0.8,
    });

    const rawContent = response.choices[0].message.content || '';
    
    // 清理可能存在的 markdown 代码块
    let cleanContent = rawContent.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '');
    }
    
    // 解析 JSON
    const parsed = JSON.parse(cleanContent);
    
    const report = {
      root: parsed.root || '暂时无法解析这个模块',
      pathA: parsed.pathA || '暂时无法解析这个模块',
      pathB: parsed.pathB || '暂时无法解析这个模块',
      warning: parsed.warning || '暂时无法解析这个模块',
      map: parsed.map || '暂时无法解析这个模块',
      promise: parsed.promise || '从今天起，你不是过去的你，你是正在成为的自己'
    };

    return res.status(200).json({ report });
  } catch (error) {
    console.error('深度版 AI 调用失败:', error);
    return res.status(500).json({ error: '生成深度报告失败，请稍后重试' });
  }
}