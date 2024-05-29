# 开发

开发应用程序有两种方法。

## 在浏览器中调试前端页面
- `pnpm run serve` or `pnpm run serve:tauri`
  - 启动 vite，你可以在浏览器中测试和开发你的应用程序 http://localhost:8080.

## 在 `Tauri` 窗口中

- `pnpm run serve:native`

将在启动[前端项目](http://localhost:8080),然后启动 Tauri 窗口，您将在本地窗口中看到您的应用程序。

# 打包

- 运行`pnpm run build` ，在 `./src-tauri/target/releases` 中构建应用程序并用 Tauri 对其进行打包。
- `bundle\msi` 和 `bundle\nsis` 中有对应的安装包
