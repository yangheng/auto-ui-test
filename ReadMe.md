# 自动化框架说明

1.  本项目是基于 [appium](http://appium.io/) 自动化测试框搭建,基于 [webdriver](http://webdriver.io) 交互协议实现与移动端通信.
2.  测试案例用的JavaScript 的 [mocha](https://mochajs.org/) 测试框架编写
3.  测试断言语法基于 [chai](http://chaijs.com/) 的 should 语法结构.


####    Appium 介绍
Appium 是基于 C/S 机构移动测试框架. 


## 开发测试案例

###   1.文件结构说明

    mocha.config.js     mocha测试案例hooks管理文件(统一由测试人员唐连杰管理)
    xcode.org.json      xcode 证书配置管理文件(仅限IOS测试)(详见后面说明)
    case/               编写测试案例文件存放位置

###   2. 测试案例书写规范

```javascript

    module.exports=function (client) {

        describe('----- context',function () {

            it('should list 3 contexts',function () {
                return client.contexts().then(function (result) {
                        console.log(result)
                        return client.context(result.value[result.value.length - 1]);
                        // console.log()
                    })
                    .getText('.case-box', 3000)
                    .then(function(text){
                        // console.log(text)
                        text.should.be.equal('这里是案例的内容区')
                        // return client.quit();
                        // console.log(client.getSource())
                    })
                    .getText('.container', 3000)
                    .then(function(text){
                        // console.log(text)
                        text.should.be.equal('这里是案例的内容区')
                        // return client.quit();
                        // console.log(client.getSource())
                    })
            })


        })


    }

```

#### 规范说明:

     client :  webdriver 实例, 采用统一的命名规范.

#### 相关开发文档参考
 1. API: [webdriver文档参考链接](http://webdriver.io/api.html)
 2. Mocha: [测试框架`Mocha`语法](https://mochajs.org/)
 3. 测试编写语法: [断言语法(推荐用`should`,当前项目使用should)](http://chaijs.com/)


## 自动安装说明
1.  mac 版支持自动化安装程序所依赖的库和软件包
2.  windows 版由于需要手动设置环境变量和下载Android 相关软件包,所以设计成半自动化,不能自动执行的任务将以"提示"方式出现,指导安装过程

 初次下载此项目之后,直接运行如下命令:
```
    npm run init
```
#### 说明:

1.程序会自动安装所有依赖和环境配置,如果安装都成功的话,会直接启动 appium 服务
2.Appium安装路径为：
```
/usr/local/lib/node_modules/appium
```

3.init 以后,如果再需要测试案例,可以直接全局启动 appium 服务,直接运行如下命令:
```
    appium
```

# MAC环境手动配置内容

##  IOS配置
1.  Xcode打开 WebDriverAgent.xcodeproj 之后,在 WebDriverAgentLib 和WebDriverAgentRunner 的General 面板上 选择 Automatically manage signing, Team 下拉选择框上选择自己的Development Team .
如下图
![配置](https://git.yunshipei.com/core/auto-ui-test/raw/master/md_resource/xcode-config.png)
![配置](./md_resource/xcode-config.png)

2.   在配置WebDriverAgentRunner 时候,Xcode 创建provisioning profile 可能会失败如下图:
![失败](https://git.yunshipei.com/core/auto-ui-test/raw/master/md_resource/xcode-facebook-fail.png)
![失败](./md_resource/xcode-facebook-fail.png)

出现这种情况的时候需要打开 Build Settings 面板,把 Product Bundle Identifier 设置为 com.gome.web
如下图
![bundle](https://git.yunshipei.com/core/auto-ui-test/raw/master/md_resource/xcode-bundle-id.png)
![bundle](./md_resource/xcode-bundle-id.png)

再返回到General 面板,这时候你看到的应该就是成功的了,如下图
![success](https://git.yunshipei.com/core/auto-ui-test/raw/master/md_resource/xcode-facebook-succeed.png)
![success](./md_resource/xcode-facebook-succeed.png)

3.  以上内容都配置完之后,在终端里执行如下命令

```
xcodebuild -project WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner -destination 'id=<测试机的udid>' test
```

出现以下结果则是成功:
```
Test Suite 'All tests' started at 2017-01-23 15:49:12.585
    Test Suite 'WebDriverAgentRunner.xctest' started at 2017-01-23 15:49:12.586
    Test Suite 'UITestingUITests' started at 2017-01-23 15:49:12.587
    Test Case '-[UITestingUITests testRunner]' started.
        t =     0.00s     Start Test at 2017-01-23 15:49:12.588
        t =     0.00s     Set Up
```

## Android 配置

1.  mac 测试安卓设备需要将 appium 所安装目录里的/node_modules/appium-chromedriver/chromedriver/mac/ 下的chromedriver 替换掉.

首先下载替换chromedriver 的内容

```
git@git.yunshipei.com:heng.yang/chromedriver.git
```
将下载下来的内容全部拷贝到 appium 所安装目录里的/node_modules/appium-chromedriver/chromedriver/mac/

# 案例开发参考规范

```
test
  |-- helpers
        |-- capabilities.js // session 配置
        |-- casesAddress.json // 案例库信息
  |-- test // 用例文件夹
    |-- io.js // 测试用例
```

