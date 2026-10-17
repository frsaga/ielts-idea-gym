"use client";

import { useEffect, useMemo, useState } from "react";
import { allIdeas } from "./all-ideas";

type PracticeMode = "sentence" | "chain" | "paragraph";
type View = "practice" | "library" | "review";

type IdeaCard = {
  id: string;
  category: string;
  categoryEn: string;
  topic: string;
  stance: "正面" | "反面" | "平衡";
  promptZh: string;
  reference: string;
  keywords: string[];
  chain: { zh: string; en: string }[];
  exampleZh: string;
  exampleEn: string;
  question: string;
  needsAiSupplement?: boolean;
};

type AiSupplement = Pick<IdeaCard, "reference" | "keywords" | "chain" | "exampleEn" | "question">;

const cards: IdeaCard[] = [
  {
    id: "gov-services",
    category: "政府",
    categoryEn: "Government",
    topic: "公共服务",
    stance: "正面",
    promptZh: "政府的首要职责之一是提供公共服务和基础设施。",
    reference:
      "One of the primary responsibilities of governments is to provide public services and essential infrastructure.",
    keywords: ["responsibility", "public services", "infrastructure"],
    chain: [
      { zh: "政府投资基础设施", en: "governments invest in infrastructure" },
      { zh: "交通和服务更加便利", en: "transport and services become more accessible" },
      { zh: "企业运营成本下降", en: "business operating costs fall" },
      { zh: "经济与生活质量改善", en: "the economy and quality of life improve" },
    ],
    exampleZh: "例如，完善的公共交通可以缩短通勤时间，并帮助低收入居民获得更多工作机会。",
    exampleEn:
      "For example, an efficient public transport system can shorten commuting times and give low-income residents access to more job opportunities.",
    question:
      "Some people think governments should spend more money on public services than on the arts. To what extent do you agree?",
  },
  {
    id: "gov-welfare",
    category: "政府",
    categoryEn: "Government",
    topic: "社会福利",
    stance: "正面",
    promptZh: "社会福利能够帮助弱势群体，并提高社会公平。",
    reference:
      "Social welfare programmes can support vulnerable groups and promote greater social equality.",
    keywords: ["social welfare", "vulnerable groups", "equality"],
    chain: [
      { zh: "提供补贴和基本保障", en: "subsidies and basic support are provided" },
      { zh: "低收入家庭压力下降", en: "financial pressure on low-income families falls" },
      { zh: "教育和医疗更可及", en: "education and healthcare become more accessible" },
      { zh: "贫富差距缩小", en: "the wealth gap narrows" },
    ],
    exampleZh: "住房补贴能够让低收入家庭负担住所，并把更多收入用于教育和医疗。",
    exampleEn:
      "Housing subsidies allow low-income families to afford accommodation and devote more of their income to education and healthcare.",
    question:
      "Some people believe that governments should provide financial support for disadvantaged citizens. Discuss both views and give your opinion.",
  },
  {
    id: "gov-environment",
    category: "政府",
    categoryEn: "Government",
    topic: "环境监管",
    stance: "正面",
    promptZh: "政府必须通过法律和投资来保护环境与自然资源。",
    reference:
      "Governments must protect the environment and natural resources through effective regulation and investment.",
    keywords: ["regulation", "investment", "natural resources"],
    chain: [
      { zh: "制定排放法规", en: "emission regulations are introduced" },
      { zh: "企业采用清洁技术", en: "companies adopt cleaner technologies" },
      { zh: "污染物排放减少", en: "pollutant emissions decline" },
      { zh: "生态系统得到保护", en: "ecosystems are better protected" },
    ],
    exampleZh: "政府可以补贴太阳能和风能项目，减少社会对化石燃料的依赖。",
    exampleEn:
      "Governments can subsidise solar and wind projects, reducing society's dependence on fossil fuels.",
    question:
      "Environmental problems are too large for individuals to solve. Only governments can address them. Do you agree or disagree?",
  },
  {
    id: "global-growth",
    category: "全球化",
    categoryEn: "Globalisation",
    topic: "经济增长",
    stance: "正面",
    promptZh: "全球化通过增加贸易和投资来促进经济增长。",
    reference:
      "Globalisation promotes economic growth by increasing international trade and foreign investment.",
    keywords: ["globalisation", "trade", "foreign investment"],
    chain: [
      { zh: "贸易壁垒降低", en: "trade barriers are reduced" },
      { zh: "企业进入海外市场", en: "companies enter overseas markets" },
      { zh: "生产规模扩大", en: "production expands" },
      { zh: "就业与收入增加", en: "employment and incomes rise" },
    ],
    exampleZh: "一家跨国汽车公司在海外设厂，可能直接创造数千个当地岗位。",
    exampleEn:
      "A multinational car manufacturer that opens a factory overseas may directly create thousands of jobs for local workers.",
    question:
      "Globalisation has brought more benefits than problems. To what extent do you agree?",
  },
  {
    id: "global-culture",
    category: "全球化",
    categoryEn: "Globalisation",
    topic: "文化交流",
    stance: "正面",
    promptZh: "全球化使不同国家的人更容易理解彼此的文化和价值观。",
    reference:
      "Globalisation encourages cultural exchange and enables people to understand different values and ways of life.",
    keywords: ["cultural exchange", "understand", "values"],
    chain: [
      { zh: "旅行与留学增加", en: "travel and overseas study increase" },
      { zh: "人们亲身接触其他文化", en: "people encounter other cultures firsthand" },
      { zh: "偏见逐渐减少", en: "prejudice is reduced" },
      { zh: "社会包容性增强", en: "social tolerance grows" },
    ],
    exampleZh: "留学生与当地同学共同学习，可以让双方理解不同的习俗与思维方式。",
    exampleEn:
      "When international and local students study together, both groups can develop a better understanding of different customs and perspectives.",
    question:
      "Some people think globalisation is damaging local cultures. Discuss both views and give your opinion.",
  },
  {
    id: "global-identity",
    category: "全球化",
    categoryEn: "Globalisation",
    topic: "文化认同",
    stance: "反面",
    promptZh: "全球流行文化可能削弱传统文化和地方认同。",
    reference:
      "The spread of global popular culture may weaken traditional customs and local cultural identity.",
    keywords: ["popular culture", "traditional customs", "identity"],
    chain: [
      { zh: "全球媒体大量传播", en: "global media content spreads widely" },
      { zh: "年轻人模仿相同的生活方式", en: "young people adopt similar lifestyles" },
      { zh: "地方传统被忽视", en: "local traditions receive less attention" },
      { zh: "文化多样性下降", en: "cultural diversity declines" },
    ],
    exampleZh: "国际连锁品牌取代传统商店后，城市街区可能逐渐失去原有特色。",
    exampleEn:
      "When international chains replace traditional shops, urban neighbourhoods may gradually lose their distinctive character.",
    question:
      "Some people believe that countries are becoming increasingly similar. Is this a positive or negative development?",
  },
  {
    id: "environment-warming",
    category: "环境",
    categoryEn: "Environment",
    topic: "全球变暖",
    stance: "反面",
    promptZh: "化石燃料的大量使用加剧全球变暖，并威胁人类生活。",
    reference:
      "The extensive use of fossil fuels accelerates global warming and threatens human communities.",
    keywords: ["fossil fuels", "global warming", "threatens"],
    chain: [
      { zh: "燃烧化石燃料", en: "fossil fuels are burned" },
      { zh: "温室气体增加", en: "greenhouse gas emissions rise" },
      { zh: "极端天气更频繁", en: "extreme weather becomes more frequent" },
      { zh: "生命与财产受损", en: "lives and property are put at risk" },
    ],
    exampleZh: "更频繁的热浪会增加老年人的健康风险，并给医院带来额外压力。",
    exampleEn:
      "More frequent heatwaves can endanger elderly people and place additional pressure on hospitals.",
    question:
      "What are the causes of climate change, and what measures can governments and individuals take?",
  },
  {
    id: "environment-renewable",
    category: "环境",
    categoryEn: "Environment",
    topic: "可再生能源",
    stance: "正面",
    promptZh: "发展可再生能源能减少污染，并提高能源安全。",
    reference:
      "Developing renewable energy can reduce pollution while improving long-term energy security.",
    keywords: ["renewable energy", "pollution", "energy security"],
    chain: [
      { zh: "投资太阳能与风能", en: "solar and wind power are expanded" },
      { zh: "化石燃料需求下降", en: "demand for fossil fuels falls" },
      { zh: "碳排放减少", en: "carbon emissions decline" },
      { zh: "能源供应更加可持续", en: "energy supplies become more sustainable" },
    ],
    exampleZh: "在日照充足的地区，屋顶太阳能可以为家庭供电，并降低长期电费。",
    exampleEn:
      "In sunny regions, rooftop solar panels can power homes and reduce household electricity bills over time.",
    question:
      "Some people believe renewable energy should replace fossil fuels as soon as possible. Do you agree?",
  },
  {
    id: "environment-shared",
    category: "环境",
    categoryEn: "Environment",
    topic: "环保责任",
    stance: "平衡",
    promptZh: "解决环境问题需要政府与个人共同承担责任。",
    reference:
      "Environmental problems can only be addressed effectively when governments and individuals share responsibility.",
    keywords: ["address", "governments", "individuals"],
    chain: [
      { zh: "政府提供制度与设施", en: "governments provide rules and facilities" },
      { zh: "个人改变日常行为", en: "individuals change daily behaviour" },
      { zh: "政策得到广泛执行", en: "policies are widely followed" },
      { zh: "总体环境影响下降", en: "the overall environmental impact falls" },
    ],
    exampleZh: "政府建设可靠的回收系统后，居民分类垃圾才会变得方便有效。",
    exampleEn:
      "Once governments provide reliable recycling systems, residents can sort household waste conveniently and effectively.",
    question:
      "Some people think individuals cannot improve the environment, while others believe they can make a difference. Discuss both views.",
  },
  {
    id: "health-prevention",
    category: "健康",
    categoryEn: "Health",
    topic: "预防与治疗",
    stance: "正面",
    promptZh: "预防疾病通常比治疗疾病更经济、更有效。",
    reference:
      "Preventing disease is often more cost-effective and beneficial than treating illness after it occurs.",
    keywords: ["preventing disease", "cost-effective", "treating"],
    chain: [
      { zh: "开展健康教育与筛查", en: "health education and screening are provided" },
      { zh: "疾病更早被发现", en: "illnesses are detected earlier" },
      { zh: "严重病例减少", en: "fewer cases become severe" },
      { zh: "医疗系统成本下降", en: "healthcare costs are reduced" },
    ],
    exampleZh: "定期体检可能在早期发现高血压，避免日后出现更严重的心脏疾病。",
    exampleEn:
      "Regular health checks can identify high blood pressure early and prevent more serious heart disease later in life.",
    question:
      "Governments should spend more on preventing illness than on treating it. To what extent do you agree?",
  },
  {
    id: "health-public",
    category: "健康",
    categoryEn: "Health",
    topic: "公共医疗",
    stance: "正面",
    promptZh: "公共医疗体系能够保证不同收入的人获得基本治疗。",
    reference:
      "A public healthcare system ensures that people from all income groups can obtain essential medical treatment.",
    keywords: ["public healthcare", "income groups", "medical treatment"],
    chain: [
      { zh: "基础医疗由公共资金支持", en: "basic care is publicly funded" },
      { zh: "患者费用负担下降", en: "patients face lower costs" },
      { zh: "低收入者及时就医", en: "low-income people seek treatment earlier" },
      { zh: "健康差距缩小", en: "health inequalities are reduced" },
    ],
    exampleZh: "免费的儿童疫苗能保护贫困家庭的孩子，也能降低传染病传播风险。",
    exampleEn:
      "Free childhood vaccinations protect children in low-income families and reduce the wider risk of infectious disease.",
    question:
      "Some people believe healthcare should be free for everyone. Discuss both views and give your opinion.",
  },
  {
    id: "health-exercise",
    category: "健康",
    categoryEn: "Health",
    topic: "运动",
    stance: "正面",
    promptZh: "规律运动可以改善身体健康与心理状态。",
    reference:
      "Regular physical activity improves both physical health and psychological well-being.",
    keywords: ["physical activity", "physical health", "well-being"],
    chain: [
      { zh: "人们保持规律运动", en: "people exercise regularly" },
      { zh: "体能与睡眠改善", en: "fitness and sleep improve" },
      { zh: "压力和患病风险下降", en: "stress and disease risks fall" },
      { zh: "整体生活质量提高", en: "overall quality of life rises" },
    ],
    exampleZh: "公司提供午间健身活动，可以帮助员工缓解压力并提高下午的专注力。",
    exampleEn:
      "Workplace exercise sessions at lunchtime can reduce employee stress and improve concentration in the afternoon.",
    question:
      "Why do many people not exercise enough, and what can be done to encourage them?",
  },
  {
    id: "tech-efficiency",
    category: "科技",
    categoryEn: "Technology",
    topic: "科技进步",
    stance: "正面",
    promptZh: "科技进步通过自动化重复任务提高生产效率。",
    reference:
      "Technological progress raises productivity by automating repetitive and time-consuming tasks.",
    keywords: ["technological progress", "productivity", "automating"],
    chain: [
      { zh: "机器处理重复工作", en: "machines handle repetitive work" },
      { zh: "员工节省时间", en: "employees save time" },
      { zh: "人力转向复杂任务", en: "workers focus on complex tasks" },
      { zh: "组织效率提高", en: "organisational efficiency improves" },
    ],
    exampleZh: "医院使用数字系统整理病历后，医生可以把更多时间用于诊断患者。",
    exampleEn:
      "When hospitals use digital systems to organise medical records, doctors can spend more time diagnosing patients.",
    question:
      "Technology is making people more productive but also more dependent. Discuss both views.",
  },
  {
    id: "tech-internet",
    category: "科技",
    categoryEn: "Technology",
    topic: "互联网",
    stance: "正面",
    promptZh: "互联网让知识和教育资源变得更容易获得。",
    reference:
      "The internet has made knowledge and educational resources accessible to a much wider population.",
    keywords: ["internet", "educational resources", "accessible"],
    chain: [
      { zh: "课程在网络上发布", en: "courses are published online" },
      { zh: "地域限制被打破", en: "geographical barriers are removed" },
      { zh: "更多人获得学习机会", en: "more people gain learning opportunities" },
      { zh: "技能与就业能力提升", en: "skills and employability improve" },
    ],
    exampleZh: "偏远地区的学生可以通过在线课程学习当地学校没有开设的科目。",
    exampleEn:
      "Students in remote areas can use online courses to study subjects that their local schools do not offer.",
    question:
      "The internet has changed the way people learn. Is this a positive or negative development?",
  },
  {
    id: "tech-jobs",
    category: "科技",
    categoryEn: "Technology",
    topic: "科技与就业",
    stance: "平衡",
    promptZh: "自动化会取代部分岗位，但也会创造新的职业需求。",
    reference:
      "Automation may replace certain jobs, but it also creates demand for new occupations and specialised skills.",
    keywords: ["automation", "replace", "specialised skills"],
    chain: [
      { zh: "常规岗位被自动化", en: "routine jobs are automated" },
      { zh: "部分工人暂时失业", en: "some workers are displaced" },
      { zh: "新技术行业扩张", en: "new technology sectors expand" },
      { zh: "再培训创造新机会", en: "retraining opens new opportunities" },
    ],
    exampleZh: "自助结账减少收银岗位，但同时增加了系统维护和数据分析方面的工作。",
    exampleEn:
      "Self-service checkouts may reduce cashier roles while increasing demand for system maintenance and data analysis.",
    question:
      "More jobs are being replaced by computers and robots. Is this a positive or negative development?",
  },
  {
    id: "society-inequality",
    category: "社会",
    categoryEn: "Society",
    topic: "贫富差距",
    stance: "反面",
    promptZh: "过大的贫富差距会削弱社会流动性与社会稳定。",
    reference:
      "A wide gap between rich and poor can undermine social mobility and social stability.",
    keywords: ["gap", "social mobility", "stability"],
    chain: [
      { zh: "资源集中在富裕家庭", en: "resources are concentrated among wealthy families" },
      { zh: "贫困儿童机会减少", en: "poorer children have fewer opportunities" },
      { zh: "阶层差距固化", en: "social divisions become entrenched" },
      { zh: "不满与冲突增加", en: "resentment and conflict grow" },
    ],
    exampleZh: "无法负担优质教育的儿童，成年后可能仍难获得高收入工作。",
    exampleEn:
      "Children who cannot afford quality education may continue to struggle to obtain well-paid employment as adults.",
    question:
      "The gap between rich and poor is increasing. What problems does this cause, and how can they be solved?",
  },
  {
    id: "society-ageing",
    category: "社会",
    categoryEn: "Society",
    topic: "人口老龄化",
    stance: "平衡",
    promptZh: "人口老龄化会增加公共支出，但年长者仍能为社会作出贡献。",
    reference:
      "An ageing population increases public expenditure, although older people can continue to contribute valuable skills and experience.",
    keywords: ["ageing population", "public expenditure", "experience"],
    chain: [
      { zh: "老年人口比例上升", en: "the proportion of older people rises" },
      { zh: "养老金与医疗需求增加", en: "pension and healthcare demand grows" },
      { zh: "公共财政承压", en: "public finances face pressure" },
      { zh: "灵活就业可保留经验", en: "flexible work can retain valuable experience" },
    ],
    exampleZh: "退休教师可以兼职辅导年轻教师，在较低工作强度下继续贡献经验。",
    exampleEn:
      "Retired teachers can mentor younger colleagues part-time and continue sharing their experience with a lighter workload.",
    question:
      "An ageing population is a burden on society. To what extent do you agree?",
  },
  {
    id: "society-urban",
    category: "社会",
    categoryEn: "Society",
    topic: "城市化",
    stance: "平衡",
    promptZh: "城市化创造就业机会，却也会加剧住房和交通压力。",
    reference:
      "Urbanisation creates employment opportunities but can also intensify pressure on housing and transport.",
    keywords: ["urbanisation", "employment", "housing"],
    chain: [
      { zh: "人口迁往城市", en: "people move to cities" },
      { zh: "劳动力与企业聚集", en: "workers and businesses concentrate" },
      { zh: "经济机会增加", en: "economic opportunities expand" },
      { zh: "房价和拥堵加剧", en: "housing costs and congestion increase" },
    ],
    exampleZh: "快速增长的城市如果没有同步建设公共交通，通勤时间和空气污染都会上升。",
    exampleEn:
      "If fast-growing cities fail to expand public transport, commuting times and air pollution are likely to increase.",
    question:
      "More people are moving from rural areas to cities. Is this a positive or negative development?",
  },
  {
    id: "work-balance",
    category: "工作",
    categoryEn: "Work",
    topic: "工作与生活",
    stance: "正面",
    promptZh: "良好的工作与生活平衡能提升幸福感和长期生产力。",
    reference:
      "A healthy work-life balance improves personal well-being and supports productivity in the long term.",
    keywords: ["work-life balance", "well-being", "productivity"],
    chain: [
      { zh: "员工拥有充分休息", en: "employees receive adequate rest" },
      { zh: "压力与倦怠减少", en: "stress and burnout decline" },
      { zh: "注意力与动力恢复", en: "concentration and motivation recover" },
      { zh: "长期表现改善", en: "long-term performance improves" },
    ],
    exampleZh: "减少不必要的加班能让员工第二天更专注，也会降低离职率。",
    exampleEn:
      "Reducing unnecessary overtime allows employees to concentrate better the next day and may also lower staff turnover.",
    question:
      "Many people struggle to achieve a balance between work and other parts of life. Why is this, and what can be done?",
  },
  {
    id: "work-learning",
    category: "工作",
    categoryEn: "Work",
    topic: "终身学习",
    stance: "正面",
    promptZh: "终身学习帮助劳动者适应技术和就业市场的变化。",
    reference:
      "Lifelong learning enables workers to adapt to technological change and an evolving labour market.",
    keywords: ["lifelong learning", "adapt", "labour market"],
    chain: [
      { zh: "行业技能不断变化", en: "industry skill requirements change" },
      { zh: "劳动者持续学习", en: "workers continue learning" },
      { zh: "旧技能得到更新", en: "outdated skills are updated" },
      { zh: "就业能力得以保持", en: "employability is maintained" },
    ],
    exampleZh: "会计人员学习数据工具后，可以承担分析工作，而不只是处理常规账目。",
    exampleEn:
      "Accountants who learn data tools can take on analytical work rather than only processing routine transactions.",
    question:
      "Education should continue throughout a person's life. To what extent do you agree?",
  },
  {
    id: "work-purpose",
    category: "工作",
    categoryEn: "Work",
    topic: "工作目的",
    stance: "反面",
    promptZh: "收入并不是努力工作的唯一目的，成就感同样重要。",
    reference:
      "Income is not the only reason people work hard, as achievement and personal fulfilment can be equally important.",
    keywords: ["income", "achievement", "fulfilment"],
    chain: [
      { zh: "员工完成有意义的任务", en: "workers complete meaningful tasks" },
      { zh: "看到工作产生影响", en: "they see the impact of their work" },
      { zh: "获得成就与价值感", en: "they gain achievement and purpose" },
      { zh: "内在动力增强", en: "intrinsic motivation grows" },
    ],
    exampleZh: "教师看到学生进步时获得的满足感，可能远超过额外奖金带来的短期快乐。",
    exampleEn:
      "The satisfaction teachers gain from seeing students improve may outweigh the short-term pleasure of an additional bonus.",
    question:
      "Some people think the only reason for working hard is to earn money. Do you agree or disagree?",
  },
  {
    id: "education-importance",
    category: "教育",
    categoryEn: "Education",
    topic: "教育价值",
    stance: "正面",
    promptZh: "教育不仅传授知识，也培养独立思考与社会责任。",
    reference:
      "Education not only provides knowledge but also develops independent thinking and social responsibility.",
    keywords: ["education", "independent thinking", "responsibility"],
    chain: [
      { zh: "学生接触不同观点", en: "students encounter different perspectives" },
      { zh: "学习评估证据", en: "they learn to evaluate evidence" },
      { zh: "形成独立判断", en: "independent judgement develops" },
      { zh: "作出更负责的决定", en: "more responsible decisions are made" },
    ],
    exampleZh: "课堂讨论公共议题，可以训练学生倾听他人并用证据支持自己的立场。",
    exampleEn:
      "Classroom discussions of public issues teach students to listen to others and support their positions with evidence.",
    question:
      "The main purpose of education is to prepare people for employment. To what extent do you agree?",
  },
  {
    id: "education-online",
    category: "教育",
    categoryEn: "Education",
    topic: "在线教育",
    stance: "平衡",
    promptZh: "在线教育更加灵活，但难以完全替代面对面互动。",
    reference:
      "Online education offers greater flexibility, although it cannot fully replace face-to-face interaction.",
    keywords: ["online education", "flexibility", "face-to-face"],
    chain: [
      { zh: "课程不受地点限制", en: "courses are not limited by location" },
      { zh: "学习时间更加灵活", en: "study schedules become more flexible" },
      { zh: "更多人能够参与", en: "more learners can participate" },
      { zh: "即时互动可能减少", en: "immediate interaction may be reduced" },
    ],
    exampleZh: "全职工作者可以在晚上学习，但可能缺少课堂中即时提问和小组讨论的机会。",
    exampleEn:
      "Full-time employees can study in the evening, but they may have fewer opportunities for immediate questions and group discussion.",
    question:
      "Online learning is replacing classroom education. Is this a positive or negative development?",
  },
  {
    id: "education-free",
    category: "教育",
    categoryEn: "Education",
    topic: "免费高等教育",
    stance: "平衡",
    promptZh: "免费高等教育能促进公平，但也会给公共财政带来压力。",
    reference:
      "Free higher education can widen access, but it may also place substantial pressure on public finances.",
    keywords: ["higher education", "widen access", "public finances"],
    chain: [
      { zh: "取消或降低学费", en: "tuition fees are removed or reduced" },
      { zh: "贫困学生更容易入学", en: "disadvantaged students can enrol more easily" },
      { zh: "教育机会更加公平", en: "educational access becomes fairer" },
      { zh: "政府支出明显增加", en: "government expenditure rises considerably" },
    ],
    exampleZh: "按家庭收入提供学费补助，可以扩大教育机会，同时避免为富裕家庭提供不必要补贴。",
    exampleEn:
      "Means-tested tuition support can widen access without providing unnecessary subsidies to wealthy families.",
    question:
      "University education should be free for everyone. To what extent do you agree?",
  },
  {
    id: "culture-exchange",
    category: "文化",
    categoryEn: "Culture",
    topic: "文化交流",
    stance: "正面",
    promptZh: "文化交流能够拓宽个人视野，并提升社会包容性。",
    reference:
      "Cultural exchange broadens individual perspectives and encourages greater social tolerance.",
    keywords: ["cultural exchange", "perspectives", "tolerance"],
    chain: [
      { zh: "接触不同文化", en: "people encounter different cultures" },
      { zh: "理解其他生活方式", en: "other ways of life are understood" },
      { zh: "刻板印象减少", en: "stereotypes are challenged" },
      { zh: "包容性增强", en: "tolerance increases" },
    ],
    exampleZh: "学习外语往往也会让人理解另一种文化的习俗、幽默与价值观。",
    exampleEn:
      "Learning a foreign language often helps people understand another culture's customs, humour and values.",
    question:
      "Some people think cultural exchange has more benefits than drawbacks. Do you agree?",
  },
  {
    id: "culture-preserve",
    category: "文化",
    categoryEn: "Culture",
    topic: "文化保护",
    stance: "正面",
    promptZh: "保护文化遗产有助于维持社会认同，并把知识传给下一代。",
    reference:
      "Preserving cultural heritage maintains a shared identity and passes valuable knowledge to future generations.",
    keywords: ["cultural heritage", "identity", "future generations"],
    chain: [
      { zh: "修复遗址与传承技艺", en: "sites and traditional skills are preserved" },
      { zh: "年轻人接触本地历史", en: "young people encounter local history" },
      { zh: "群体认同得到加强", en: "a shared identity is strengthened" },
      { zh: "传统得以延续", en: "traditions continue" },
    ],
    exampleZh: "传统工艺工作坊可以让年轻人向老一代学习即将消失的制作技术。",
    exampleEn:
      "Traditional craft workshops allow young people to learn disappearing skills directly from older generations.",
    question:
      "Governments should spend money protecting cultural heritage. To what extent do you agree?",
  },
  {
    id: "culture-economy",
    category: "文化",
    categoryEn: "Culture",
    topic: "文化与经济",
    stance: "正面",
    promptZh: "文化旅游能够创造收入，并支持地方服务业。",
    reference:
      "Cultural tourism generates revenue and supports employment in local service industries.",
    keywords: ["cultural tourism", "revenue", "employment"],
    chain: [
      { zh: "文化景点吸引游客", en: "cultural attractions draw visitors" },
      { zh: "游客在当地消费", en: "visitors spend money locally" },
      { zh: "酒店与餐饮需求增加", en: "demand for hotels and restaurants grows" },
      { zh: "地方就业增加", en: "local employment expands" },
    ],
    exampleZh: "历史街区得到保护后，可以吸引游客并为导游、餐馆和手工艺人带来收入。",
    exampleEn:
      "A preserved historic district can attract visitors and generate income for guides, restaurants and craftspeople.",
    question:
      "Tourism is the best way to protect local culture. To what extent do you agree?",
  },
  {
    id: "media-awareness",
    category: "媒体",
    categoryEn: "Media",
    topic: "广告",
    stance: "正面",
    promptZh: "广告通过提高品牌认知帮助新产品进入市场。",
    reference:
      "Advertising helps new products enter the market by increasing brand awareness among potential customers.",
    keywords: ["advertising", "brand awareness", "customers"],
    chain: [
      { zh: "消费者看到产品信息", en: "consumers see product information" },
      { zh: "品牌认知提高", en: "brand awareness grows" },
      { zh: "更多人尝试产品", en: "more people try the product" },
      { zh: "销量增加", en: "sales increase" },
    ],
    exampleZh: "新饮料品牌通过社交媒体展示产品特点，可以快速接触大量潜在消费者。",
    exampleEn:
      "A new beverage brand can reach a large number of potential customers quickly by presenting its features on social media.",
    question:
      "Advertising has a strong influence on what people buy. Is this a positive or negative development?",
  },
  {
    id: "media-demand",
    category: "媒体",
    categoryEn: "Media",
    topic: "消费主义",
    stance: "反面",
    promptZh: "广告可能制造不必要的需求，并鼓励过度消费。",
    reference:
      "Advertising can create unnecessary desires and encourage excessive consumption.",
    keywords: ["advertising", "unnecessary", "consumption"],
    chain: [
      { zh: "广告把产品与理想生活联系", en: "products are linked with an ideal lifestyle" },
      { zh: "消费者产生焦虑或欲望", en: "consumers feel desire or insecurity" },
      { zh: "购买并不需要的商品", en: "unnecessary products are purchased" },
      { zh: "浪费与债务增加", en: "waste and debt increase" },
    ],
    exampleZh: "手机广告不断强调新功能，可能促使消费者在旧设备仍可使用时就进行更换。",
    exampleEn:
      "Smartphone advertising may persuade consumers to replace devices that still work by constantly emphasising new features.",
    question:
      "Advertising encourages people to buy things they do not need. To what extent do you agree?",
  },
  {
    id: "media-social",
    category: "媒体",
    categoryEn: "Media",
    topic: "社交媒体",
    stance: "平衡",
    promptZh: "社交媒体方便人际联系，却也可能减少深入的面对面交流。",
    reference:
      "Social media makes communication more convenient, but it may reduce meaningful face-to-face interaction.",
    keywords: ["social media", "communication", "face-to-face"],
    chain: [
      { zh: "即时联系变得容易", en: "instant contact becomes easy" },
      { zh: "远距离关系得以维持", en: "long-distance relationships are maintained" },
      { zh: "线上交流占用更多时间", en: "online interaction takes more time" },
      { zh: "线下对话可能减少", en: "in-person conversation may decline" },
    ],
    exampleZh: "居住在不同国家的家人可以每天视频通话，但同桌吃饭的人也可能各自看手机。",
    exampleEn:
      "Relatives in different countries can speak by video every day, while people at the same dinner table may still focus on their phones.",
    question:
      "Social media is reducing the quality of human relationships. Do you agree or disagree?",
  },
  {
    id: "crime-prevention",
    category: "犯罪",
    categoryEn: "Crime",
    topic: "预防犯罪",
    stance: "正面",
    promptZh: "教育和就业机会可以从根源上降低犯罪率。",
    reference:
      "Access to education and employment can reduce crime by addressing its underlying social causes.",
    keywords: ["education", "employment", "underlying causes"],
    chain: [
      { zh: "高风险人群获得技能", en: "at-risk people gain useful skills" },
      { zh: "合法就业机会增加", en: "legal employment opportunities expand" },
      { zh: "犯罪的经济诱因下降", en: "financial incentives for crime fall" },
      { zh: "再犯率降低", en: "offending and reoffending decline" },
    ],
    exampleZh: "为年轻人提供职业培训，可以给他们稳定收入来源，减少加入犯罪团伙的吸引力。",
    exampleEn:
      "Vocational training can give young people a stable source of income and make criminal gangs less attractive.",
    question:
      "The best way to reduce crime is to give longer prison sentences. To what extent do you agree?",
  },
  {
    id: "crime-punishment",
    category: "犯罪",
    categoryEn: "Crime",
    topic: "刑罚",
    stance: "平衡",
    promptZh: "刑罚能够起到威慑作用，但改造罪犯同样不可缺少。",
    reference:
      "Punishment can deter crime, but offender rehabilitation is equally necessary for long-term public safety.",
    keywords: ["punishment", "deter", "rehabilitation"],
    chain: [
      { zh: "违法行为受到惩罚", en: "offending is punished" },
      { zh: "潜在罪犯考虑后果", en: "potential offenders consider the consequences" },
      { zh: "短期威慑形成", en: "a short-term deterrent is created" },
      { zh: "改造减少长期再犯", en: "rehabilitation reduces long-term reoffending" },
    ],
    exampleZh: "监狱中的职业培训能让服刑人员出狱后更容易找到合法工作。",
    exampleEn:
      "Vocational programmes in prison can help offenders find lawful employment after release.",
    question:
      "Prisons should punish criminals rather than rehabilitate them. Discuss both views and give your opinion.",
  },
  {
    id: "crime-youth",
    category: "犯罪",
    categoryEn: "Crime",
    topic: "青少年犯罪",
    stance: "平衡",
    promptZh: "处理青少年犯罪应兼顾责任、年龄与改造机会。",
    reference:
      "Responses to juvenile crime should balance accountability with the offender's age and capacity for rehabilitation.",
    keywords: ["juvenile crime", "accountability", "rehabilitation"],
    chain: [
      { zh: "青少年承担适当后果", en: "young offenders face proportionate consequences" },
      { zh: "接受教育与心理支持", en: "education and counselling are provided" },
      { zh: "行为原因得到处理", en: "causes of behaviour are addressed" },
      { zh: "重新融入社会", en: "reintegration becomes more likely" },
    ],
    exampleZh: "社区服务结合心理辅导，既能让青少年承担责任，也能避免他们受到成年罪犯影响。",
    exampleEn:
      "Community service combined with counselling holds young offenders accountable without exposing them to the influence of adult criminals.",
    question:
      "Young people who commit serious crimes should receive the same punishment as adults. Do you agree?",
  },
  {
    id: "animal-endangered",
    category: "动物",
    categoryEn: "Animals",
    topic: "濒危动物",
    stance: "正面",
    promptZh: "保护濒危物种有助于维持生态系统平衡。",
    reference:
      "Protecting endangered species helps preserve the balance and resilience of ecosystems.",
    keywords: ["endangered species", "balance", "ecosystems"],
    chain: [
      { zh: "关键物种得到保护", en: "key species are protected" },
      { zh: "食物链保持稳定", en: "food chains remain stable" },
      { zh: "其他物种得以生存", en: "other species can survive" },
      { zh: "生态系统更加健康", en: "ecosystems become more resilient" },
    ],
    exampleZh: "保护狼等顶级捕食者可以控制食草动物数量，避免植被被过度消耗。",
    exampleEn:
      "Protecting apex predators such as wolves can control herbivore populations and prevent vegetation from being overgrazed.",
    question:
      "Too much money is spent protecting endangered animals. To what extent do you agree?",
  },
  {
    id: "animal-zoo",
    category: "动物",
    categoryEn: "Animals",
    topic: "动物园",
    stance: "平衡",
    promptZh: "动物园能够支持保育教育，但圈养也可能损害动物福利。",
    reference:
      "Zoos can support conservation and public education, although captivity may seriously harm animal welfare.",
    keywords: ["zoos", "conservation", "animal welfare"],
    chain: [
      { zh: "动物被置于人工环境", en: "animals are kept in artificial environments" },
      { zh: "自然活动受到限制", en: "natural behaviour is restricted" },
      { zh: "压力行为增加", en: "stress-related behaviour appears" },
      { zh: "动物福利下降", en: "animal welfare deteriorates" },
    ],
    exampleZh: "狭小围栏中的动物可能反复踱步，这通常反映了缺少空间和环境刺激。",
    exampleEn:
      "Animals in small enclosures may pace repeatedly, often indicating a lack of space and environmental stimulation.",
    question:
      "Some people think zoos are cruel and should be closed. Discuss both views and give your opinion.",
  },
  {
    id: "animal-research",
    category: "动物",
    categoryEn: "Animals",
    topic: "动物实验",
    stance: "平衡",
    promptZh: "动物实验可能推动医学进步，但必须受到严格伦理限制。",
    reference:
      "Animal research may contribute to medical progress, but it must be subject to strict ethical controls.",
    keywords: ["animal research", "medical progress", "ethical"],
    chain: [
      { zh: "研究测试新的治疗方法", en: "new treatments are tested" },
      { zh: "安全风险得到识别", en: "safety risks are identified" },
      { zh: "医学知识增加", en: "medical knowledge advances" },
      { zh: "同时产生动物福利代价", en: "animal welfare costs remain" },
    ],
    exampleZh: "只有在没有可靠替代方法且研究可能挽救生命时，动物实验才更容易得到合理辩护。",
    exampleEn:
      "Animal testing is easier to justify when no reliable alternative exists and the research may save human lives.",
    question:
      "Medical experiments on animals are necessary for human progress. To what extent do you agree?",
  },
  {
    id: "transport-cycling",
    category: "交通",
    categoryEn: "Transport",
    topic: "自行车",
    stance: "正面",
    promptZh: "鼓励骑行可以同时缓解拥堵、污染和健康问题。",
    reference:
      "Encouraging cycling can simultaneously reduce congestion, pollution and health problems.",
    keywords: ["cycling", "congestion", "pollution"],
    chain: [
      { zh: "更多短途出行改用自行车", en: "more short journeys are made by bicycle" },
      { zh: "道路汽车数量减少", en: "the number of cars falls" },
      { zh: "排放与拥堵下降", en: "emissions and congestion decline" },
      { zh: "居民活动量增加", en: "physical activity rises" },
    ],
    exampleZh: "连续且安全的自行车道能让上班族愿意放弃短距离驾车。",
    exampleEn:
      "A connected network of safe cycle lanes can persuade commuters to stop driving for short journeys.",
    question:
      "What can governments do to encourage more people to use bicycles?",
  },
  {
    id: "transport-rail",
    category: "交通",
    categoryEn: "Transport",
    topic: "高速铁路",
    stance: "正面",
    promptZh: "高速铁路能加强地区联系，并促进沿线经济发展。",
    reference:
      "High-speed rail strengthens regional connections and can stimulate economic growth along its routes.",
    keywords: ["high-speed rail", "regional", "economic growth"],
    chain: [
      { zh: "城市间时间成本下降", en: "travel times between cities fall" },
      { zh: "人员和商业往来增加", en: "business and passenger movement grows" },
      { zh: "沿线投资扩大", en: "investment along the route expands" },
      { zh: "地方就业与收入增加", en: "local jobs and incomes increase" },
    ],
    exampleZh: "二线城市接入高铁后，可能吸引游客和企业，同时缓解航空运输压力。",
    exampleEn:
      "When a smaller city joins a high-speed rail network, it may attract tourists and businesses while reducing pressure on air travel.",
    question:
      "Governments should spend money on high-speed rail rather than improving existing public transport. Discuss both views.",
  },
  {
    id: "transport-cost",
    category: "交通",
    categoryEn: "Transport",
    topic: "交通投资",
    stance: "反面",
    promptZh: "过度投资大型交通项目可能挤占日常公共交通维护资金。",
    reference:
      "Excessive investment in major transport projects may divert funding from the maintenance of everyday public transport.",
    keywords: ["investment", "divert funding", "public transport"],
    chain: [
      { zh: "大量预算投入新项目", en: "large budgets go to new projects" },
      { zh: "公交地铁维护资金减少", en: "less funding remains for buses and metros" },
      { zh: "现有系统逐渐老化", en: "existing systems deteriorate" },
      { zh: "日常通勤体验变差", en: "daily commuting becomes less reliable" },
    ],
    exampleZh: "如果城市把大部分预算用于高铁站，老旧公交线路可能长期得不到更新。",
    exampleEn:
      "If a city directs most of its budget to a high-speed rail station, ageing bus routes may remain unimproved for years.",
    question:
      "Governments should prioritise new transport projects over maintaining existing systems. Do you agree?",
  },
];

const categoryColors: Record<string, string> = {
  政治: "#5e5a54",
  政府: "#5e5a54",
  全球化: "#5e5a54",
  环境: "#5e5a54",
  健康: "#5e5a54",
  科技: "#5e5a54",
  社会: "#5e5a54",
  工作: "#5e5a54",
  教育: "#5e5a54",
  文化: "#5e5a54",
  媒体: "#5e5a54",
  犯罪: "#5e5a54",
  "犯罪与处罚": "#5e5a54",
  动物: "#5e5a54",
  交通: "#5e5a54",
};

const categoryIcons: Record<string, string> = {
  政治: "政",
  政府: "政",
  全球化: "球",
  环境: "环",
  健康: "健",
  科技: "科",
  社会: "社",
  工作: "职",
  教育: "学",
  文化: "文",
  媒体: "媒",
  犯罪: "法",
  "犯罪与处罚": "法",
  动物: "生",
  交通: "行",
};

const STORAGE_KEY = "ielts-idea-gym-v1";
const AI_SUPPLEMENTS_KEY = "ielts-idea-gym-ai-supplements-v1";

type SavedState = {
  completed: string[];
  review: string[];
  daily: Record<string, number>;
};

const emptySaved: SavedState = { completed: [], review: [], daily: {} };

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function normalise(text: string) {
  return text.toLowerCase().replace(/[^a-z\s-]/g, " ");
}

function scoreSentence(text: string, card: IdeaCard) {
  if (!card.keywords.length) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.min(100, Math.round((words / 12) * 100));
  }
  const cleaned = normalise(text);
  const hits = card.keywords.filter((keyword) =>
    cleaned.includes(normalise(keyword).trim()),
  ).length;
  return Math.round((hits / card.keywords.length) * 100);
}

function scoreParagraph(text: string, card: IdeaCard) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();
  const keywordScore = scoreSentence(text, card);
  const hasReason = /\b(because|since|as|by|which|therefore|thus|consequently)\b/.test(
    lower,
  );
  const hasExample = /\b(for example|for instance|such as)\b/.test(lower);
  const hasResult =
    /\b(result|lead|allow|enable|increase|reduce|improve|contribute)\w*\b/.test(
      lower,
    );
  const lengthScore = words.length >= 75 ? 25 : Math.round((words.length / 75) * 25);
  return Math.min(
    100,
    Math.round(keywordScore * 0.35 + lengthScore + (hasReason ? 15 : 0) + (hasExample ? 15 : 0) + (hasResult ? 10 : 0)),
  );
}

function buildModelParagraph(card: IdeaCard) {
  const [first, second, third, fourth] = card.chain;
  return `${card.reference} This is because ${first.en}, meaning that ${second.en}. As a result, ${third.en} and ultimately ${fourth.en}. ${card.exampleEn} Therefore, this development can have a meaningful effect on individuals and society.`;
}

function makePracticeCard(source: (typeof allIdeas)[number]): IdeaCard {
  return {
    id: source.id,
    category: source.category,
    categoryEn: source.category,
    topic: source.topic,
    stance: "平衡",
    promptZh: source.claim,
    reference: source.reference,
    keywords: [],
    chain: [
      { zh: "提出核心观点", en: "state the core claim" },
      { zh: "解释发生原因", en: "explain why it happens" },
      { zh: "说明带来的结果", en: "show the likely consequence" },
      { zh: "补充具体例子", en: "add a realistic example" },
    ],
    exampleZh: "公开示例（可替换为自己的情境）。",
    exampleEn: source.example,
    question: `Develop one body paragraph using this idea: ${source.claim}`,
  };
}

const practiceCards = allIdeas.map((source) => {
  const generic = makePracticeCard(source);
  const detailed = cards.find(
    (card) => card.topic.length > 2 && source.claim.includes(card.topic),
  );
  return detailed
    ? {
        ...generic,
        keywords: detailed.keywords,
        chain: detailed.chain,
        question: detailed.question,
        needsAiSupplement: false,
      }
    : { ...generic, needsAiSupplement: true };
});

export default function Home() {
  const [view, setView] = useState<View>("practice");
  const [mode, setMode] = useState<PracticeMode>("sentence");
  const [cardIndex, setCardIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hint, setHint] = useState(false);
  const [saved, setSaved] = useState<SavedState>(emptySaved);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("全部");
  const [search, setSearch] = useState("");
  const [chainOrder, setChainOrder] = useState<number[]>([]);
  const [chainSubmitted, setChainSubmitted] = useState(false);
  const [aiSupplements, setAiSupplements] = useState<Record<string, AiSupplement>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setSaved(JSON.parse(raw));
        const aiRaw = localStorage.getItem(AI_SUPPLEMENTS_KEY);
        if (aiRaw) setAiSupplements(JSON.parse(aiRaw));
      } catch {
        setSaved(emptySaved);
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [saved, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem(AI_SUPPLEMENTS_KEY, JSON.stringify(aiSupplements));
  }, [aiSupplements, loaded]);

  const baseCurrent = practiceCards[cardIndex % practiceCards.length];
  const current = aiSupplements[baseCurrent.id]
    ? { ...baseCurrent, ...aiSupplements[baseCurrent.id] }
    : baseCurrent;
  const categories = useMemo(
    () => ["全部", ...Array.from(new Set(allIdeas.map((idea) => idea.category)))],
    [],
  );

  const visibleIdeas = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allIdeas.filter((idea) => {
      const inCategory = filter === "全部" || idea.category === filter;
      const inSearch =
        !query ||
        `${idea.category} ${idea.topic} ${idea.claim}`
          .toLowerCase()
          .includes(query);
      return inCategory && inSearch;
    });
  }, [filter, search]);

  const reviewCards = practiceCards.filter((card) => saved.review.includes(card.id));
  const practicedToday = saved.daily[todayKey()] || 0;
  const progress = Math.min(100, Math.round((saved.completed.length / practiceCards.length) * 100));

  function resetExercise(nextIndex?: number) {
    if (typeof nextIndex === "number") setCardIndex(nextIndex);
    setAnswer("");
    setSubmitted(false);
    setHint(false);
    setChainOrder([]);
    setChainSubmitted(false);
  }

  function nextCard() {
    resetExercise((cardIndex + 1) % practiceCards.length);
  }

  function chooseCard(card: IdeaCard, destination: View = "practice") {
    setCardIndex(practiceCards.findIndex((item) => item.id === card.id));
    setView(destination);
    setMode("sentence");
    resetExercise();
  }

  function chooseSourceIdea(id: string) {
    const index = practiceCards.findIndex((item) => item.id === id);
    if (index >= 0) {
      resetExercise(index);
      setMode("sentence");
      setView("practice");
    }
  }

  function markComplete() {
    const date = todayKey();
    setSaved((previous) => ({
      ...previous,
      completed: previous.completed.includes(current.id)
        ? previous.completed
        : [...previous.completed, current.id],
      daily: { ...previous.daily, [date]: (previous.daily[date] || 0) + 1 },
    }));
  }

  function submitAnswer() {
    if (!answer.trim()) return;
    setSubmitted(true);
    markComplete();
  }

  function toggleReview(id = current.id) {
    setSaved((previous) => ({
      ...previous,
      review: previous.review.includes(id)
        ? previous.review.filter((item) => item !== id)
        : [...previous.review, id],
    }));
  }

  function randomCard() {
    let next = Math.floor(Math.random() * practiceCards.length);
    if (next === cardIndex) next = (next + 1) % practiceCards.length;
    resetExercise(next);
    setView("practice");
  }

  async function completeCurrentCard() {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/deepseek-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claim: current.promptZh,
          category: current.category,
          topic: current.topic,
        }),
      });
      const payload = (await response.json()) as AiSupplement & { error?: string };
      if (!response.ok || payload.error) throw new Error(payload.error || "补全失败，请稍后再试。");
      setAiSupplements((previous) => ({
        ...previous,
        [current.id]: {
          reference: payload.reference,
          exampleEn: payload.exampleEn,
          keywords: payload.keywords,
          chain: payload.chain,
          question: payload.question,
        },
      }));
      resetExercise();
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "补全失败，请稍后再试。");
    } finally {
      setAiLoading(false);
    }
  }

  function addChainItem(index: number) {
    if (!chainOrder.includes(index) && !chainSubmitted) {
      setChainOrder((previous) => [...previous, index]);
    }
  }

  function removeChainItem(index: number) {
    if (!chainSubmitted) {
      setChainOrder((previous) => previous.filter((item) => item !== index));
    }
  }

  const sentenceScore = scoreSentence(answer, current);
  const paragraphScore = scoreParagraph(answer, current);
  const chainCorrect =
    chainOrder.length === current.chain.length &&
    chainOrder.every((item, index) => item === index);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("practice")} aria-label="回到练习首页">
          <span className="brand-mark">论</span>
          <span>
            <strong>论点健身房</strong>
            <small>IELTS IDEA GYM</small>
          </span>
        </button>

        <nav className="main-nav" aria-label="主导航">
          <button className={view === "practice" ? "active" : ""} onClick={() => setView("practice")}>
            <span>练</span> 今日训练
          </button>
          <button className={view === "library" ? "active" : ""} onClick={() => setView("library")}>
            <span>库</span> 观点库
          </button>
          <button className={view === "review" ? "active" : ""} onClick={() => setView("review")}>
            <span>复</span> 待复习
            {saved.review.length > 0 && <b>{saved.review.length}</b>}
          </button>
        </nav>

        <section className="side-progress">
          <div className="side-progress-head">
            <span>总进度</span>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>
            已练习 {saved.completed.length} / {practiceCards.length} 个观点
          </p>
        </section>

        <section className="daily-card">
          <div className="daily-ring" style={{ "--value": `${Math.min(practicedToday / 5, 1) * 360}deg` } as React.CSSProperties}>
            <span>{practicedToday}</span>
          </div>
          <div>
            <strong>今日目标</strong>
            <p>{practicedToday >= 5 ? "已完成，保持手感" : `再练 ${5 - practicedToday} 题`}</p>
          </div>
        </section>

        <p className="source-note">基于你提供的《雅思大作文观点库》重组，仅供个人学习。</p>
      </aside>

      <section className="content">
        {view === "practice" && (
          <>
            <section className="mode-tabs" aria-label="训练模式">
              <button className={mode === "sentence" ? "active" : ""} onClick={() => { setMode("sentence"); resetExercise(); }}>
                <b>01</b>
                <span>观点表达<small>中译英与改写</small></span>
              </button>
              <button className={mode === "chain" ? "active" : ""} onClick={() => { setMode("chain"); resetExercise(); }}>
                <b>02</b>
                <span>因果链<small>搭建论证路径</small></span>
              </button>
              <button className={mode === "paragraph" ? "active" : ""} onClick={() => { setMode("paragraph"); resetExercise(); }}>
                <b>03</b>
                <span>正文段<small>80–120 词输出</small></span>
              </button>
            </section>

            <section className="exercise-card">
              <div className="exercise-meta">
                <span className="category-pill" style={{ "--topic": categoryColors[current.category] } as React.CSSProperties}>
                  {current.category} · {current.categoryEn}
                </span>
                <span>{current.topic}</span>
                <span className={`stance ${current.stance}`}>{current.stance}论点</span>
                <span className="counter">{cardIndex + 1} / {practiceCards.length}</span>
                <button className="compact-random" onClick={randomCard} aria-label="随机一题">
                  ↝ <span>随机</span>
                </button>
              </div>

              {mode === "sentence" && (
                <div className="exercise-body">
                  <div className="prompt-block">
                    <span className="prompt-label">请用英文表达</span>
                    <h2>{current.promptZh}</h2>
                    <p>先抓住核心意思，不需要和参考答案一字不差。</p>
                    {current.needsAiSupplement && (
                      <div className="ai-complete-row">
                        <button className="ai-complete-button" onClick={completeCurrentCard} disabled={aiLoading}>
                          {aiLoading ? "DeepSeek 正在补全…" : aiSupplements[current.id] ? "用 DeepSeek 重新生成补全" : "用 DeepSeek 补全本卡"}
                        </button>
                        <small>补全关键词、因果链和题目；生成结果仅保存在当前设备。</small>
                      </div>
                    )}
                    {aiError && <p className="ai-error" role="status">{aiError}</p>}
                  </div>

                  {hint && (
                    <div className="keyword-hint">
                      <span>关键词</span>
                      {current.keywords.map((keyword) => <b key={keyword}>{keyword}</b>)}
                    </div>
                  )}

                  <label className="answer-box">
                    <span>Your answer</span>
                    <textarea
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      placeholder="Write one clear English sentence..."
                      disabled={submitted}
                    />
                    <small>{answer.trim().split(/\s+/).filter(Boolean).length} words</small>
                  </label>

                  {!submitted ? (
                    <div className="exercise-actions">
                      <button className="ghost-button" onClick={() => setHint(!hint)}>
                        {hint ? "收起提示" : "给我关键词"}
                      </button>
                      <button className="primary-button" onClick={submitAnswer} disabled={!answer.trim()}>
                        提交并对照
                      </button>
                    </div>
                  ) : (
                    <ResultPanel
                      score={sentenceScore}
                      label={current.keywords.length ? "关键词覆盖" : "表达完成度"}
                      reference={current.reference}
                      example={current.exampleEn}
                      reviewed={saved.review.includes(current.id)}
                      onReview={() => toggleReview()}
                      onRetry={() => resetExercise()}
                      onNext={nextCard}
                    />
                  )}
                </div>
              )}

              {mode === "chain" && (
                <div className="exercise-body">
                  <div className="prompt-block compact">
                    <span className="prompt-label">搭建因果链</span>
                    <h2>{current.promptZh}</h2>
                    <p>按合理顺序点击下方逻辑块，完成后再把它说成英文。</p>
                  </div>

                  <div className="chain-workspace">
                    <div className="chain-slots">
                      {current.chain.map((_, index) => {
                        const selected = chainOrder[index];
                        return (
                          <button
                            key={index}
                            className={selected === undefined ? "empty" : ""}
                            onClick={() => selected !== undefined && removeChainItem(selected)}
                          >
                            <small>{index + 1}</small>
                            {selected === undefined ? "选择一个逻辑块" : current.chain[selected].zh}
                          </button>
                        );
                      })}
                    </div>
                    <div className="chain-bank">
                      {[2, 0, 3, 1].map((index) => (
                        <button
                          key={index}
                          onClick={() => addChainItem(index)}
                          disabled={chainOrder.includes(index) || chainSubmitted}
                        >
                          {current.chain[index].zh}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!chainSubmitted ? (
                    <div className="exercise-actions">
                      <button className="ghost-button" onClick={() => setChainOrder([])}>重新排列</button>
                      <button
                        className="primary-button"
                        disabled={chainOrder.length !== current.chain.length}
                        onClick={() => { setChainSubmitted(true); markComplete(); }}
                      >
                        检查顺序
                      </button>
                    </div>
                  ) : (
                    <div className={`chain-result ${chainCorrect ? "correct" : "incorrect"}`}>
                      <div>
                        <span>{chainCorrect ? "✓" : "↺"}</span>
                        <strong>{chainCorrect ? "逻辑成立" : "再理一遍因果关系"}</strong>
                        <p>{chainCorrect ? "现在尝试不看中文，用英文复述这条链。" : "参考顺序如下，注意每一步如何推动下一步。"}</p>
                      </div>
                      <ol>
                        {current.chain.map((item, index) => (
                          <li key={item.en}><b>{index + 1}</b><span>{item.zh}<small>{item.en}</small></span></li>
                        ))}
                      </ol>
                      <div className="result-actions">
                        <button className="review-button" onClick={() => toggleReview()}>
                          {saved.review.includes(current.id) ? "✓ 已加入复习" : "+ 加入复习"}
                        </button>
                        <button className="primary-button" onClick={nextCard}>下一题 →</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mode === "paragraph" && (
                <div className="exercise-body paragraph-mode">
                  <div className="question-box">
                    <span>IELTS TASK 2</span>
                    <h2>{current.question}</h2>
                  </div>
                  <div className="paragraph-grid">
                    <aside className="paragraph-guide">
                      <strong>正文段骨架</strong>
                      {["观点句", "解释原因", "因果机制", "具体例子", "回扣题目"].map((item, index) => (
                        <div key={item}>
                          <b>{index + 1}</b>
                          <span>{item}</span>
                        </div>
                      ))}
                      <button onClick={() => setHint(!hint)}>{hint ? "隐藏论点" : "显示可用论点"}</button>
                      {hint && <p>{current.promptZh}</p>}
                    </aside>
                    <label className="answer-box paragraph-answer">
                      <span>Your body paragraph</span>
                      <textarea
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        placeholder="Develop one idea with a clear causal chain and a specific example..."
                        disabled={submitted}
                      />
                      <small className={answer.trim().split(/\s+/).filter(Boolean).length >= 80 ? "enough" : ""}>
                        {answer.trim().split(/\s+/).filter(Boolean).length} / 80–120 words
                      </small>
                    </label>
                  </div>
                  {!submitted ? (
                    <div className="exercise-actions">
                      <span className="autosave-note">草稿自动保留在当前页面</span>
                      <button className="primary-button" onClick={submitAnswer} disabled={!answer.trim()}>
                        完成正文段
                      </button>
                    </div>
                  ) : (
                    <ResultPanel
                      score={paragraphScore}
                      label="结构完成度"
                      reference={buildModelParagraph(current)}
                      example={current.exampleEn}
                      reviewed={saved.review.includes(current.id)}
                      onReview={() => toggleReview()}
                      onRetry={() => resetExercise()}
                      onNext={nextCard}
                    />
                  )}
                </div>
              )}
            </section>

            <section className="micro-tip">
              <span>今日提醒</span>
              <p><strong>不要追求与参考答案完全一致。</strong> 能独立写出“观点 → 为什么 → 结果 → 例子”，才算真正掌握。</p>
            </section>
          </>
        )}

        {view === "library" && (
          <section className="library">
            <div className="library-intro">
              <span>PDF 全量观点索引</span>
              <strong>{allIdeas.length}</strong>
              <p>已纳入 PDF 中每一条“论点／原因／措施”级观点。先选一个，再到训练区把它展开成英文。</p>
            </div>
            <div className="library-toolbar">
              <label>
                <span>⌕</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索话题、观点或英文表达" />
              </label>
              <span>{visibleIdeas.length} 条观点</span>
            </div>
            <div className="category-filter">
              {categories.map((category) => (
                <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>
                  {category}
                </button>
              ))}
            </div>
            <div className="card-grid">
              {visibleIdeas.map((idea) => (
                <article className="idea-card source-card" key={idea.id}>
                  <div className="idea-card-top">
                    <span className="category-icon" style={{ background: categoryColors[idea.category] || "#63716e" }}>{categoryIcons[idea.category] || "论"}</span>
                    <div><small>{idea.category}</small><strong>{idea.topic}</strong></div>
                    <span className="index-number">{idea.id.replace("pdf-", "#")}</span>
                  </div>
                  <p>{idea.claim}</p>
                  <div className="idea-tags">
                    <span>观点素材</span>
                  </div>
                  <div className="idea-card-bottom">
                    <span className="source-note-label">用于立场句、解释与例子展开</span>
                    <button onClick={() => chooseSourceIdea(idea.id)}>去练习 →</button>
                  </div>
                </article>
              ))}
            </div>
            {visibleIdeas.length === 0 && <div className="empty-state"><span>⌕</span><h2>没有找到相关观点</h2><p>换一个关键词或主题试试。</p></div>}
          </section>
        )}

        {view === "review" && (
          <section className="review-view">
            <div className="review-summary">
              <span>待复习</span>
              <strong>{reviewCards.length}</strong>
              <p>对不熟的观点进行第二次主动输出，比重复阅读更有效。</p>
            </div>
            {reviewCards.length > 0 ? (
              <div className="review-list">
                {reviewCards.map((card, index) => (
                  <article key={card.id}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <span className="category-icon" style={{ background: categoryColors[card.category] }}>{categoryIcons[card.category]}</span>
                    <div>
                      <small>{card.category} · {card.topic}</small>
                      <strong>{card.promptZh}</strong>
                      <p>{card.keywords.join(" · ")}</p>
                    </div>
                    <button onClick={() => chooseCard(card)}>去练习 →</button>
                    <button className="remove-review" onClick={() => toggleReview(card.id)}>移除</button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state review-empty">
                <span>✓</span>
                <h2>复习队列是空的</h2>
                <p>练习时遇到不熟的观点，点击“加入复习”就会出现在这里。</p>
                <button className="primary-button" onClick={() => setView("practice")}>开始今日训练</button>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

function ResultPanel({
  score,
  label,
  reference,
  example,
  reviewed,
  onReview,
  onRetry,
  onNext,
}: {
  score: number;
  label: string;
  reference: string;
  example: string;
  reviewed: boolean;
  onReview: () => void;
  onRetry: () => void;
  onNext: () => void;
}) {
  const message = score >= 85 ? "表达完整" : score >= 60 ? "核心意思已覆盖" : "再补足关键含义";
  return (
    <div className="result-panel">
      <div className="score-block">
        <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}>
          <span>{score}</span>
        </div>
        <div>
          <small>{label}</small>
          <strong>{message}</strong>
          <p>评分只用于检查内容覆盖和段落结构，不要求照抄参考答案。</p>
        </div>
      </div>
      <div className="reference-block">
        <span>参考表达</span>
        <p>{reference}</p>
      </div>
      <div className="example-block">
        <span>可用例子</span>
        <p>{example}</p>
      </div>
      <div className="result-actions">
        <button className="review-button" onClick={onReview}>{reviewed ? "✓ 已加入复习" : "+ 加入复习"}</button>
        <button className="ghost-button" onClick={onRetry}>再写一次</button>
        <button className="primary-button" onClick={onNext}>下一题 →</button>
      </div>
    </div>
  );
}
