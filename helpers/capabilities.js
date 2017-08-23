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

exports.p9={
    platformName: 'Android',
    platformVersion: '7.0',
    //browserName: 'Chromium',
    deviceName: 'HUAWEI P9',
    udid: 'PBV7N16322001695',
    appPackage: 'com.yunshipei.enterplorer.debug',
    appActivity: 'com.yunshipei.ui.activity.SplashActivity',
    automationName: 'uiautomator2',
    autoWebView:true,
    chromedriverExecutable:"/usr/local/lib/node_modules/appium/node_modules/_appium-chromedriver@2.12.1@appium-chromedriver/chromedriver/mac/chromedriver",
    // chromedriverExecutable:"/Applications/Appium.app/Contents/Resources/app/node_modules/appium/node_modules/appium-chromedriver/chromedriver/mac/chromedriver",
    //androidDeviceSocket:'com.yunshipei.enterplorer.debug_devtools_remote',
    chromeOptions:{

    },
    noSign:true,
    noReset:true,
    enablePerformanceLogging:true
}

exports.iphone7={
    "platformName": "iOS",
    "platformVersion": "10.3",
    "automationName":"XCUITest",
    "deviceName": "iPhone 7 Plus",
    "bundleId": "com.yunshipei.YSPExplorer",
    "udid": "623ef7ebc6d5e24f4a40059f82c9472ebd82f5ea",
    "xcodeOrgId": "Y3333NF579",//team id signed in xcode
    "xcodeSigningId": "iPhone Developer",
    "startIWDP":true
}
