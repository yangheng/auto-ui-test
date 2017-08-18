# 编译chromium 

标签（空格分隔）： 开源

---

# 前言
在做自动化测试框架过程时遇到了一个大麻烦，就是appium（@1.6.5） 在MAC下无法实现Android context切换到webview,所以在一番周折之后，查到了原因是chromedriver 存在的bug，appium上已经有大神 [pull request](https://github.com/appium/appium-android-driver/pull/238) 了，并且已经合并到appium 最新版本里.
尽管appium已经修复了这个问题，但是chromedriver（chromium） 并没有及时修复，需要开发者手动打补丁并重新编译chromedriver（chromium），以下内容将详细说明编译chromedriver 的过程

# 准备工作
#####   1. 一个 64位 Mac ，系统 10.11+
#####   2. xcode 7.3+
#####   3. OS X 10.10 SDK ,可以用以下命令来检查是否满足编译条件
>   ls `xcode-select -p`/Platforms/MacOSX.platform/Developer/SDKs

#####   4.  安装 depot_tools
#####   5.  安装 gpy
#####   6.  ！！！ 要有足够快的VPN

#   安装 depot_tools
chromium 源代码也是用git管理，但是不要用git clone源代码，直接用这个工具搞更快更稳定

#####   1.  下载 depot_tools 源代码
```
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
```
克隆到本地之后，将项目目录添加到环境变量里，不明白如何添加的请自行百度

#   安装 gpy 

在编译chromium 过程中需要gpy来编译，需要全局安卓gpy。[相关链接](https://github.com/mogemimi/gyp-getting-started#how-to-build)

#####   1.  下载 gyp 源代码
```
git clone git://github.com/enginetrouble/gyp-getting-started.git
```
#####   2.  下载到本地之后，进入到gpy-getting-started 目录后，下载相关工具
```
git clone https://chromium.googlesource.com/external/gyp.git tools/gyp
```
#####   3.  执行脚本 setup.py

```
cd tools/gyp
[sudo] python setup.py install
```

#   下载chromium 源码

####    1. 创建chromium文件夹
```
mkdir chromium && cd chromium
```
####    2. 拉取最新代码
```
fetch chromium --no-history
```
下载完成后chromium 文件夹里会有 src文件夹 和 .gclient文件

####    3. 进到src目录下，获取最新代码

```
cd src
gclient sync
```
####4. 执行hooks 获取编译需要的库和工具

```
gclient runhooks
```

#  打补丁
### ！！！此部分内容不是编译chromium crosswalk-webview 下有bug,所以需要打补丁，重新编译，此补丁的相关链接如下[https://codereview.chromium.org/2375613002/](https://codereview.chromium.org/2375613002/)

此部分内容是将补丁下载到本地，将源文件替换掉，补丁里面的download 链接是个git diff,很崩溃，没有好的下载补丁的办法，只能对着diff，手动修改本地对应的源文件。这部分内容如果有好的下载办法可以反馈给我哈

#   编译

[相关资料1](https://dev.chromium.org/developers/how-tos/old-get-the-code) [相关资料2](https://chromium.googlesource.com/chromium/src/+/master/docs/mac_build_instructions.md)
####    1.新建一个编译输出目录
```
gn gen out/Default
```
1.Chromium 主要编译工具是Ninja,但是需要用 GN 生产一个.ninja 的编译配置文件 
2.out/Default 当然是一个目录，可以根据需要修改

####    2.编译
```
ninja -C out/Default chromedriver
```
1. chromedriver 是最终的输出文件，可以根据需要自定义名字,因为我是要用在appium里，所以需要用chromedriver 名字

#   编译完毕！！
### ！！！以下内容仅供appium相关用户使用
# 替换 appium chromedriver
将 编译输出目录out/Default 的所有文件都拷贝到 appium/node_modules/appium-chromedriver/chromedriver/mac/ 目录下，即可
