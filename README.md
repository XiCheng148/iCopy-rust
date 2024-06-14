# 开发

开发应用程序有两种方法。

## 在浏览器中调试前端页面

- `pnpm run serve` or `pnpm run serve:tauri`
- 启动 vite，你可以在浏览器中测试和开发你的应用程序 http://localhost:8080.

## 在 `Tauri` 窗口中

- `pnpm run serve:native`

将在启动[前端项目](http://localhost:8080),然后启动 Tauri 窗口，您将在本地窗口中看到您的应用程序。

# 打包

- 运行`pnpm run build` ，在 `./src-tauri/target/releases` 中构建应用程序并用
  Tauri 对其进行打包。
- `bundle\msi` 和 `bundle\nsis` 中有对应的安装包

# TODO
- [ ] 导入导出支持`rusqlite`
- [ ] 文件类型支持预览文件基本信息和复制
- [ ] 模糊搜索（现在是精准搜索）
- [ ] 每一项可以自定义标签分类
- [ ] 图片ocr后提取图片文字，供搜索使用（优先级不高待定）
- [ ] 设置面板
  - [ ] 自定义快捷键
  - [ ] 自定义文件存放位置
  - [ ] 记忆上次打开的分类
- [ ] 新增、删除动画效果
- [ ] 系统级提示
