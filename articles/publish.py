import requests, os, json

r = requests.post("http://localhost:8080/api/auth/login", json={"username":"admin","password":"123456"})
token = r.json()["token"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

base = "/tmp/articles"

articles = [
    ("article2.md", "Claude Code 深度使用指南：从入门到精通",
     "全面介绍 Claude Code 的安装、配置、核心功能和高效使用技巧，帮助你成为 Vibe Coding 高手。",
     "Claude Code,AI编程,工具教程"),
    ("article3.md", "Trae IDE 体验：国产 AI 编程工具的崛起",
     "深度体验字节跳动推出的 Trae AI IDE，对比 Cursor 和 Claude Code，分享使用心得和最佳实践。",
     "Trae,AI编程,IDE评测"),
    ("article4.md", "Vibe Coding 实战：用 AI 工具 2 小时搭建个人网站",
     "记录我使用 Claude Code 从零搭建全栈个人网站的全过程，包含技术选型、架构设计和部署细节。",
     "Vibe Coding,实战,全栈开发"),
    ("article5.md", "AI 编程工具生态概览：Claude Code、Codex、Trae、OpenClaw、KimiClaw",
     "全面梳理当前主流 AI 编程工具的特点、适用场景和选型建议，帮你找到最适合自己的 Vibe Coding 搭档。",
     "AI编程,工具评测,生态概览"),
    ("article6.md", "Vibe Coding 最佳实践：写出让 AI 更懂你的 Prompt",
     "分享如何写出高质量的 AI 编程 Prompt，包含具体案例和模板，让你的 Vibe Coding 效率再翻倍。",
     "Vibe Coding,Prompt,最佳实践"),
]

for filename, title, summary, tags in articles:
    content = open(os.path.join(base, filename), "r", encoding="utf-8").read()
    data = {"title": title, "summary": summary, "content": content, "tags": tags}
    resp = requests.post("http://localhost:8080/api/articles", json=data, headers=headers)
    d = resp.json()
    print(f"ID={d.get('id')} OK - {title}")

print(f"\nPublished {len(articles)} articles!")
