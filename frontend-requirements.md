# 挂号问问 - 前端需求说明文档
*面向AI Coding的移动Web应用设计规范*

## 1. 项目概述

### 1.1 产品定位
AI导诊助手，帮助用户根据症状选择正确的医院科室，避免挂错号。

### 1.2 技术要求
- **平台**: 移动端Web应用（主要适配手机竖屏）
- **框架**: 建议React/Vue.js + TypeScript
- **UI库**: 建议Ant Design Mobile 或 Vant
- **样式**: CSS-in-JS 或 Tailwind CSS
- **状态管理**: Redux/Zustand + LocalStorage持久化

### 1.3 目标医院范围
- 中日友好医院
- 北京朝阳医院  
- 北大口腔医院

## 2. 整体架构设计

### 2.1 页面结构
应用采用**单页面渐进式架构**：
- **主页面** (`/`): 集成对话交互、分析思考、推荐结果的完整流程
- **流程阶段**: 
  - 信息收集阶段：医院选择 + 对话交互
  - 分析思考阶段：4段式思考过程依次展开
  - 结果展示阶段：推荐卡片区域滑入展示

### 2.2 页面布局设计
**渐进式单页面布局**
- 位置：全屏垂直滚动布局，无需页面切换
- 阶段切换：通过区域展开/收缩和滚动定位实现
- 交互方式：点击操作 + 自动滚动引导
- 视觉连续性：保持对话历史可见，分析过程自然衔接

```css
/* 单页面渐进布局示例 */
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
}

.chat-section {
  flex: 1;
  transition: all 0.5s ease;
}

.chat-section.collapsed {
  flex: 0 0 auto;
  max-height: 120px; /* 显示最后几条消息 */
  overflow: hidden;
}

.analysis-section {
  transform: translateY(100%);
  transition: transform 0.5s ease;
}

.analysis-section.active {
  transform: translateY(0);
}
```

## 3. Chat页面详细设计

### 3.1 页面布局
```
┌─────────────────────┐
│   弧形导航条         │
├─────────────────────┤
│                     │
│   医院选择区域       │ (初始状态)
│                     │
├─────────────────────┤
│                     │
│                     │
│   对话消息区域       │ (展开后占主要空间)
│                     │
│                     │
├─────────────────────┤
│   输入框 + 功能按钮  │
└─────────────────────┘
```

### 3.2 医院选择区域
**初始状态展示**
- 3个医院卡片横向排列，支持滑动选择
- 卡片设计：圆角、阴影、医院logo + 名称 + 类型标签
- 选中状态：边框高亮 + 背景色变化

**折叠状态**
- 用户选择医院后，区域折叠为顶部一行显示
- 显示：已选医院名称 + 修改按钮
- 点击修改重新展开选择区域

### 3.3 对话消息区域

#### 消息类型定义
1. **系统欢迎消息**
   ```
   您好！我是挂号问问AI助手。
   我将根据您的症状为您推荐最合适的科室。
   请描述一下您的不适症状？
   ```

2. **用户症状输入消息**
   - 纯文本 + 可能的症状标签
   - 支持编辑/撤回功能

3. **AI响应消息**
   - 理解确认 + 追问
   - 黄金三问（为谁问诊、何时就诊、关键病史）
   - 特殊消息：上传化验单推荐

4. **上传化验单消息**
   - AI发送：包含上传按钮的特殊消息
   - 用户上传：图片预览 + 上传状态
   - AI确认：识别结果摘要

#### 消息样式规范
```css
.message-container {
  padding: 16px;
  margin-bottom: 12px;
}

.user-message {
  background: #007AFF;
  color: white;
  border-radius: 18px 18px 4px 18px;
  margin-left: 20%;
}

.ai-message {
  background: #F2F2F7;
  color: #000;
  border-radius: 18px 18px 18px 4px;
  margin-right: 20%;
}

.special-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
}
```

### 3.4 输入区域设计

#### 混合输入模式
- **主输入框**: 文本输入，支持多行
- **快捷症状标签**: 下方显示常见症状按钮，点击快速输入
- **功能按钮**: 发送、语音（可选）、相机（仅当AI推荐时显示）

#### 症状标签设计
分类显示15个高频症状：
- **胸外科**: 胸痛、肋骨痛、胸部外伤、胸壁包块、呼吸困难
- **骨科**: 关节疼痛、腰腿痛、颈肩痛、外伤骨折、肌肉疼痛  
- **齿科**: 牙痛、智齿痛、牙龈出血、牙外伤、张口受限

#### 键盘适配
- 键盘弹起时：对话区域向上顶起，保持输入框可见
- 工具栏吸附：输入框始终贴近键盘顶部
- 自动滚动：新消息自动滚动到可见区域

### 3.5 状态管理
```typescript
interface ChatState {
  selectedHospital: Hospital | null;
  messages: Message[];
  isTyping: boolean;
  uploadedImages: UploadedImage[];
  collectedFactors: {
    patient: PatientInfo;
    symptoms: SymptomInfo[];
    timeline: TimelineInfo;
    labResults: LabResult[];
  };
}
```

## 4. 渐进式分析流程设计

### 4.1 分析阶段触发
**触发条件**: AI判断收集信息足够，发送"开始分析"消息后自动进入分析阶段

**视觉转换**: Chat区域向上收缩，分析区域从下方滑入展示，保持对话历史可见

### 4.2 渐进式布局结构
```
┌─────────────────────┐
│ 对话历史区域(收缩)   │ ← 显示最后几条消息
├─────────────────────┤
│                     │
│ 当前分析步骤(展开)   │ ← 仅显示当前进行的步骤
│ 📋 第1步：信息汇总    │
│   ◔ 症状描述分析 75% │
│   ✅ 发病时间整理     │
│   ⚠️ 既往病史 [补充]  │
│   置信度评估: 65%    │
│                     │
├─────────────────────┤
│ 已完成步骤(收缩)     │ ← 可点击展开查看详情
│ 📋 信息汇总 ✅       │
│ 🏥 医院信息查询 ✅   │
└─────────────────────┘
```

### 4.3 依次展开的4段式分析流程

#### 步骤展示逻辑
- **单步展示**: 每次只展开显示当前进行的步骤，避免信息过载
- **依次进行**: 上一步骤完成后，自动展开下一步骤
- **历史收缩**: 已完成的步骤收缩显示，可点击查看详情
- **阻断机制**: 置信度不足时暂停流程，要求用户补充信息

#### 任务进度指示器设计
```css
/* 任务状态指示器 */
○ 等待状态: 灰色空心圆
◔ 进行中: 蓝色圆环，顺时针填充显示进度(25%, 50%, 75%)
✅ 已完成: 绿色圆形背景 + 白色对勾
⚠️ 需补充: 橙色圆形背景 + 白色感叹号  
❌ 失败: 红色圆形背景 + 白色叉号
```

#### 第1步：信息汇总与置信度评估
**展示时机**: 分析流程开始时立即展开
**标题**: "📋 正在汇总您的就诊信息..."

**任务列表**:
```
◔ 症状描述分析          进行中 (90%) 
✅ 发病时间整理          已完成
○ 既往病史检查          等待用户补充
⚠️ 用药情况核实         信息不全 [补充]
✅ 目标医院确认          已完成
○ 化验资料解读          未提供 [上传]
```

**置信度控制机制**:
```
置信度评估: 65% ⚠️ 
[信息不足，建议补充更多信息] 
[我已了解，继续分析]
```

**阻断逻辑**: 
- 置信度 < 60%: 强制要求补充信息，不可进入下一步
- 置信度 60-80%: 提示建议补充，可选择继续
- 置信度 > 80%: 自动进入下一步

#### 第2步：医院信息查询
**展示时机**: 第1步完成且置信度达标后展开
**标题**: "🏥 正在查询中日友好医院信息..."

**任务列表**:
```
✅ 官网数据获取          已完成
◔ 科室设置查询          进行中 (60%)
○ 诊疗范围整理          等待中
○ 门诊时间核实          等待中  
○ 特色诊疗了解          等待中
```

**数据来源展示**:
```
数据来源: 4个官方渠道
• 医院官网 ✅
• 科室介绍页面 ◔
• 门诊安排 ○
• 专家介绍 ○
```

#### 第3步：医生信息查询
**展示时机**: 第2步完成后展开
**标题**: "👨‍⚕️ 正在查询专家团队信息..."

**任务列表**:
```
✅ 骨科专家团队          已完成
◔ 胸外科专家团队        进行中 (45%)
○ 学术背景整理          等待中
○ 专业特长匹配          等待中
○ 出诊时间查询          等待中
○ 患者评价汇总          等待中
```

**专家发现状态**:
```
已找到: 8位相关专家
• 骨科: 4位专家 ✅
• 胸外科: 4位专家 ◔
• 匹配度分析: 等待中 ○
```

#### 第4步：智能推理分析
**展示时机**: 第3步基本完成后展开
**标题**: "🤔 正在进行智能推理分析..."

**任务列表**:
```
✅ 症状因子分析          已完成
✅ 患者特征评估          已完成
◔ 科室匹配计算          进行中 (80%)
○ 医生推荐排序          等待中
○ 就诊时间优化          等待中
○ 风险评估报告          等待中
```

**推理过程展示**:
```
影响因子权重分析:
• 症状因子: 胸痛+外伤史 ✅ 权重: 0.35
• 患者因子: 成年男性 ✅ 权重: 0.20
• 时间因子: 工作日就诊 ◔ 权重: 0.15
• 医院因子: 综合医院 ○ 权重: 0.20
• 专业因子: 科室匹配度 ○ 权重: 0.10

推理引擎: 正在计算最优方案...
```

### 4.4 推荐结果卡片区域

#### 结果呈现结构
1. **首选推荐卡片** (占主要视觉重量)
2. **备选推荐卡片** (较小尺寸)  
3. **操作按钮区域**

#### 科室推荐卡片设计
```
┌─────────────────────────────┐
│ 🏥 首选推荐                 │
│                             │
│ 骨科 - 中日友好医院          │
│ ⭐ 推荐指数: 95%             │
│                             │
│ 📋 推荐理由:                │
│ 根据您描述的胸部疼痛伴外伤史，│
│ 结合深呼吸加重的特点，考虑肋骨│
│ 或胸壁软组织损伤可能性较大。  │
│ 骨科具备相关诊疗经验。       │
│                             │
│ 🕐 门诊时间: 周一至周五全天   │
│ 📍 科室位置: 门诊楼3楼        │
│                             │
│ [查看推荐依据] [立即挂号]     │
└─────────────────────────────┘
```

#### 医生推荐卡片设计
```
┌─────────────────────────────┐
│ 👨‍⚕️ 推荐专家                │
│                             │
│ 张主任 - 主任医师            │
│ 🎓 北医大博士，30年临床经验   │
│ 🏆 擅长: 胸壁外伤、肋骨骨折   │
│                             │
│ 📅 本周出诊:                │
│ 周二上午、周四下午           │
│                             │
│ [查看详情]                   │
└─────────────────────────────┘
```

#### 结果页面底部操作区
- **重新咨询**: 回到Chat页面继续对话
- **挂号指引**: 跳转到百度(临时替代医院官网)
- **分享结果**: 保存推荐结果截图

### 4.5 卡片编辑功能
**可编辑内容**:
- 症状描述修正
- 遗漏信息补充  
- 时间/紧急程度调整
- 既往史补充

**编辑触发**:
- 点击卡片中的可编辑字段
- 弹出inline编辑框或bottom sheet
- 实时更新，重新计算推荐结果

## 5. 移动端UI/UX规范

### 5.1 视觉设计系统

#### 色彩规范
```css
:root {
  /* 主色调 */
  --primary-color: #007AFF;
  --primary-light: #5AC8FA; 
  --primary-dark: #0051D5;
  
  /* 辅助色 */
  --success-color: #34C759;
  --warning-color: #FF9500;
  --error-color: #FF3B30;
  
  /* 中性色 */
  --text-primary: #000000;
  --text-secondary: #6B6B6B;
  --background-primary: #FFFFFF;
  --background-secondary: #F2F2F7;
  
  /* 卡片色 */
  --card-background: #FFFFFF;
  --card-border: #E5E5EA;
  --card-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

#### 字体规范
```css
/* 字号等级 */
.text-title: 24px, font-weight: 600
.text-headline: 20px, font-weight: 600  
.text-body: 16px, font-weight: 400
.text-caption: 14px, font-weight: 400
.text-small: 12px, font-weight: 400

/* 行高 */
line-height: 1.4 (正文)
line-height: 1.2 (标题)
```

#### 间距规范
```css
/* 8px网格系统 */
--spacing-xs: 4px;
--spacing-sm: 8px;  
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;
```

### 5.2 组件规范

#### 按钮组件
```css
/* 主要按钮 */
.btn-primary {
  height: 44px;
  border-radius: 22px;
  background: var(--primary-color);
  color: white;
  font-size: 16px;
  font-weight: 600;
}

/* 次要按钮 */  
.btn-secondary {
  height: 44px;
  border-radius: 22px;
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

/* 卡片按钮 */
.btn-card {
  height: 36px;
  border-radius: 18px;
  padding: 0 16px;
  font-size: 14px;
}
```

#### 卡片组件
```css
.card {
  background: var(--card-background);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  padding: 16px;
  margin-bottom: 16px;
}

.card-interactive {
  transition: transform 0.2s ease;
}

.card-interactive:active {
  transform: scale(0.98);
}
```

### 5.3 响应式适配

#### 安全区域适配
```css
/* 适配刘海屏和底部指示器 */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

#### 触控优化
- **最小触控目标**: 44x44px
- **卡片点击**: 0.98倍缩放反馈
- **长按**: 300ms延迟，触觉反馈
- **滑动**: 支持惯性滚动，边界回弹

#### 性能优化
- **图片懒加载**: 化验单、医生头像等
- **虚拟滚动**: 长对话列表
- **骨架屏**: 加载状态占位
- **预加载**: 关键页面数据预取

### 5.4 手势交互

#### 支持的手势
1. **点击**: 按钮、卡片、链接激活
2. **长按**: 消息编辑/删除菜单  
3. **上下滚动**: 内容浏览，区域切换
4. **双击**: 快速回到顶部
5. **捏合**: 图片放大查看(化验单)
6. **拖拽**: 对话区域展开/收缩

#### 手势反馈
```css
/* 触觉反馈API调用 */
navigator.vibrate([10]); // 轻微震动
navigator.vibrate([10, 50, 10]); // 成功反馈震动
```

## 6. 状态管理与数据流

### 6.1 全局状态结构
```typescript
interface AppState {
  // 用户会话
  session: {
    sessionId: string;
    userId?: string;
    createdAt: Date;
    lastActiveAt: Date;
  };
  
  // 应用流程状态
  flow: {
    currentStage: 'chat' | 'analysis' | 'result';
    chatCollapsed: boolean;
    analysisStep: number; // 0-3 当前分析步骤
    canProceedToNext: boolean;
  };
  
  // 对话状态
  chat: {
    selectedHospital: Hospital | null;
    messages: Message[];
    isTyping: boolean;
    inputText: string;
    uploadQueue: UploadTask[];
  };
  
  // 分析流程状态  
  analysis: {
    steps: AnalysisStep[]; // 4个分析步骤的状态
    currentStep: number; // 当前活跃步骤
    completedSteps: number[]; // 已完成步骤列表
    collectedFactors: CollectedFactors;
    recommendations: Recommendation[];
    confidence: number; // 整体置信度
  };
  
  // 用户偏好
  preferences: {
    fontSize: 'small' | 'medium' | 'large';
    enableHaptics: boolean;
    enableVoice: boolean;
  };
}
```

### 6.2 数据持久化策略
```typescript
// LocalStorage持久化
const persistConfig = {
  key: 'guahao-app',
  storage: 'localStorage',
  whitelist: ['session', 'chat', 'analysis', 'preferences'],
  transforms: [
    // 图片数据压缩存储
    createTransform(
      (inboundState) => ({...inboundState, images: compressImages(inboundState.images)}),
      (outboundState) => ({...outboundState, images: decompressImages(outboundState.images)}),
      { whitelist: ['chat'] }
    )
  ]
};
```

### 6.3 错误处理与恢复
```typescript
interface ErrorState {
  network: {
    isOnline: boolean;
    lastFailedRequest?: FailedRequest;
    retryCount: number;
  };
  
  upload: {
    failedUploads: FailedUpload[];
    isRetrying: boolean;
  };
  
  analysis: {
    lastError?: AnalysisError;
    canRetry: boolean;
  };
}
```

## 7. API接口设计预期

### 7.1 Chat相关接口
```typescript
// 发送消息
POST /api/chat/message
{
  sessionId: string;
  message: string;
  type: 'text' | 'symptom_tags' | 'hospital_selection';
  metadata?: any;
}

// 上传化验单
POST /api/chat/upload
Content-Type: multipart/form-data
{
  sessionId: string;
  file: File;
  type: 'lab_report' | 'medical_image';
}

// 获取聊天历史
GET /api/chat/history?sessionId={sessionId}
```

### 7.2 分析相关接口
```typescript
// 开始分析
POST /api/analysis/start
{
  sessionId: string;
  factors: CollectedFactors;
}

// 获取分析进度
GET /api/analysis/progress?sessionId={sessionId}

// 获取推荐结果
GET /api/analysis/recommendations?sessionId={sessionId}
```

### 7.3 医院数据接口
```typescript
// 获取医院列表
GET /api/hospitals

// 获取科室信息
GET /api/hospitals/{hospitalId}/departments

// 获取医生信息  
GET /api/departments/{departmentId}/doctors
```

## 8. 部署与环境配置

### 8.1 开发环境要求
- **Node.js**: >= 16.0.0
- **包管理器**: npm 或 yarn
- **开发服务器**: Vite 或 Create React App
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript strict mode

### 8.2 生产构建优化
```javascript
// 构建配置示例
const buildConfig = {
  // 代码分割
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
      ui: {
        test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
        name: 'ui-components',
        chunks: 'all',
      }
    }
  },
  
  // 资源优化
  optimization: {
    minimizer: ['terser', 'css-minimizer'],
    splitChunks: true,
    sideEffects: false
  }
};
```

### 8.3 PWA配置
```json
{
  "name": "挂号问问",
  "short_name": "挂号问问", 
  "description": "AI导诊助手",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#007AFF",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 9. 测试策略

### 9.1 用户体验测试重点
1. **触控体验**: 44px最小触控目标测试
2. **滚动性能**: 长列表滚动流畅度
3. **页面切换**: 弧形导航切换动画
4. **图片上传**: 化验单拍照/选择/上传流程
5. **离线体验**: 网络断开后的数据恢复

### 9.2 兼容性测试
- **iOS Safari**: >= 13.0
- **Android Chrome**: >= 80.0
- **微信内置浏览器**: 最新版本
- **屏幕尺寸**: 375px - 428px 宽度
- **网络环境**: 3G/4G/WiFi各种网速

### 9.3 性能指标要求
- **首屏加载**: < 2秒
- **页面切换**: < 300ms
- **图片上传**: 进度实时反馈
- **内存使用**: < 100MB (移动端)
- **电池优化**: 避免CPU密集型动画

## 10. 开发优先级与里程碑

### 10.1 第一周目标 (MVP基础)
- [ ] 项目脚手架搭建
- [ ] 弧形导航组件开发
- [ ] Chat页面基础布局
- [ ] 医院选择组件
- [ ] 基础消息组件
- [ ] 移动端适配(安全区域)

### 10.2 第二周目标 (核心功能)
- [ ] 完整对话流程
- [ ] 症状标签输入
- [ ] 化验单上传组件
- [ ] 思考&结果页面
- [ ] 4段式进度展示
- [ ] 推荐卡片组件

### 10.3 第三周目标 (体验优化)
- [ ] 动画效果完善
- [ ] 错误处理优化
- [ ] 性能优化
- [ ] 用户测试反馈迭代
- [ ] 部署上线准备

---

*本文档将随开发进程持续更新，当前版本: v1.0* 