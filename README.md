# miraipie-bot

这是一个由 [miraipie](https://github.com/nepsyn/miraipie) 构建的QQ聊天机器人。

## 已有插件

- 命令解析器
- 简易数据库
- 频率限制器
- 计划任务
- 自动通过好友申请

## 已有功能

- 抽取阿尔卡纳牌
- 饮茶提醒
- 生成摸头图片
- 抽取每日人品值
- 复读
- 在线执行代码
- 随机生成器
- 以图搜图（saucenao）
- 群发言统计
- 微博热搜
- 一言
- 管理员功能
- 英语词典

## 如何使用

克隆本仓库：

```shell
git clone https://github.com/nepsyn/miraipie-bot.git
```

安装项目依赖：

```shell
npm install
```

全局安装 miraipie：

```shell
npm install -g miraipie
```

编辑 `miraipie.json.template` 文件，更改 adapter 配置，手动添加或删除插件。
完成后将文件保存为 `miraipie.json`。

之后通过 miraipie CLI 启动：

```shell
miraipie start
```

## 贡献插件

欢迎提交 pull request 共同丰富机器人功能。
