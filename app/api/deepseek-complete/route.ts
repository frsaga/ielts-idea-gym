type CompletionRequest = {
  claim?: unknown;
  category?: unknown;
  topic?: unknown;
};

type GeneratedContent = {
  reference: string;
  exampleEn: string;
  keywords: string[];
  chain: { zh: string; en: string }[];
  question: string;
};

const MAX_TEXT_LENGTH = 240;

function text(value: unknown, maxLength = MAX_TEXT_LENGTH) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parseModelJson(content: string): unknown {
  const trimmed = content.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
  return JSON.parse(trimmed);
}

function validateGeneratedContent(value: unknown): GeneratedContent | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const reference = text(data.reference);
  const exampleEn = text(data.exampleEn);
  const question = text(data.question);
  const keywords = Array.isArray(data.keywords)
    ? data.keywords.map((item) => text(item, 48)).filter(Boolean).slice(0, 5)
    : [];
  const chain = Array.isArray(data.chain)
    ? data.chain
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const node = item as Record<string, unknown>;
          const zh = text(node.zh, 60);
          const en = text(node.en, 100);
          return zh && en ? { zh, en } : null;
        })
        .filter((item): item is { zh: string; en: string } => Boolean(item))
        .slice(0, 4)
    : [];

  return reference && exampleEn && question && keywords.length >= 3 && chain.length === 4
    ? { reference, exampleEn, keywords, chain, question }
    : null;
}

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY") {
    return Response.json(
      { error: "尚未配置 DeepSeek API 密钥。请先设置 DEEPSEEK_API_KEY。" },
      { status: 503 },
    );
  }

  let body: CompletionRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求格式不正确。" }, { status: 400 });
  }

  const claim = text(body.claim);
  const category = text(body.category, 60);
  const topic = text(body.topic, 100);
  if (!claim || !category || !topic) {
    return Response.json({ error: "缺少需要补全的观点信息。" }, { status: 400 });
  }

  const prompt = `You create original IELTS Writing Task 2 practice material. Return only a valid JSON object with this exact shape:
{
  "reference": "one natural English sentence that expresses the claim",
  "exampleEn": "one concrete, realistic English example sentence",
  "keywords": ["3 to 5 useful English collocations"],
  "chain": [{"zh":"a concise Chinese causal step","en":"its natural English version"}, {"zh":"...","en":"..."}, {"zh":"...","en":"..."}, {"zh":"...","en":"..."}],
  "question": "one original IELTS Writing Task 2 question in English"
}

Topic category: ${category}
Topic: ${topic}
Chinese claim: ${claim}

Requirements: use precise but teachable IELTS 6.5–7.5 vocabulary; keep every field concise; make the causal chain logically connected; do not copy from a known source; do not include markdown or explanations outside the JSON.`;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.55,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a careful IELTS writing tutor who returns strict JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return Response.json({ error: "DeepSeek 暂时无法生成内容，请稍后再试。" }, { status: 502 });
    }

    const result = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = result.choices?.[0]?.message?.content;
    if (!content) throw new Error("DeepSeek returned an empty response");
    const generated = validateGeneratedContent(parseModelJson(content));
    if (!generated) throw new Error("DeepSeek returned an invalid response shape");

    return Response.json(generated);
  } catch {
    return Response.json({ error: "生成内容没有通过校验，请再试一次。" }, { status: 502 });
  }
}
