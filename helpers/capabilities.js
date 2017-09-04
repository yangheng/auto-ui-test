/**
 * Created by kukuchong on 2017/8/21.
 */

exports.config={
    host: 'localhost',
    port: 4723,
    service: "appium",
    logLevel: "verbose",
    logOutput: "wdio.log",
    screenshotPath: "screenshot",
    waitforTimeout: 3000,
    debug: true,
    desiredCapabilities:{

    },
    reporters: ['dot', 'allure']
}

exports.platform={
    'android':{
        "platformName": 'Android',
        "appPackage": 'com.yunshipei.enterplorer.debug',
        "appActivity": 'com.yunshipei.ui.activity.SplashActivity',
        "automationName": 'uiautomator2',
        "autoWebView":true,
        "chromeOptions":{},
        //chromedriverExecutable:"/usr/local/lib/node_modules/appium/node_modules/_appium-chromedriver@2.12.1@appium-chromedriver/chromedriver/mac/chromedriver",
        "noSign":true,
        "noReset":true,
        "enablePerformanceLogging":true
    },
    "ios":{
        "platformName": "iOS",
        "automationName":"XCUITest",
        "bundleId": "com.yunshipei.YSPExplorer",
        "xcodeOrgId": "Y3333NF579",// 换成自己的xcode
        "xcodeSigningId": "iPhone Developer",
        "startIWDP":true
    }
}

exports.devices={
    "android":{
        "PBV7N16322001695":{
            "platformVersion": '7.0',
            "deviceName": 'HUAWEI P9',
            "udid": 'PBV7N16322001695'
        }
    },
    "ios":{
        "623ef7ebc6d5e24f4a40059f82c9472ebd82f5ea":{
            "platformVersion": "10.3",
            "deviceName": "iPhone 7 Plus",
            "udid":"623ef7ebc6d5e24f4a40059f82c9472ebd82f5ea"
            
        },
        "faf2513b7b07aaa16446c2b5b3cd8c68979173f6":{
            "platformVersion": "10.3",
            "deviceName": "iPhone 7 Plus",
            "udid":"623ef7ebc6d5e24f4a40059f82c9472ebd82f5ea"
        }
    }


}

