# Development

开发应用程序有两种方法。

## In Browser
- `pnpm run serve`
  - 启动 vite，你可以在浏览器中测试和开发你的应用程序 http://localhost:8080.

## In Tauri Window

启动两个终端

1- `pnpm run serve:tauri`

这将启动 Vite 

2- `pnpm run serve:native`

这将启动 Tauri 窗口，您将在本地窗口中看到您的应用程序。

**Note:** 浏览器的开发和 Tauri 窗口的开发主要有两点不同。

- 一个是谁执行你的 http 调用，因为在浏览器中，你受到 CORS 规则的约束，但是在 Tauri 模式下测试时，Tauri 的本地模块正在执行 http 调用，所以 CORS 不会成为问题。

- 其次是渲染器引擎。在浏览器中，它通常是最新的现代引擎，但在 Tauri 中，它将是操作系统的网络引擎，这很好，但可能不如浏览器。

# Building

`pnpm run build` 在 `./src-tauri/target/releases` 中构建应用程序并用 Tauri 对其进行打包.
