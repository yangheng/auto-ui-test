exports.ios107sim = {
  "platformName": "iOS",
  "platformVersion": "10.3",
  "deviceName": "iPhone Simulator",
  app:undefined
}

exports.ios107 = {
  "platformName": "iOS",
  "platformVersion": "10.3.2",
  "deviceName": "iPhone 6",
  "bundleId": "com.gome.web",
  "udid": "350046e62142a821d98727aa7fa40cd353725eff",
  "xcodeOrgId": "Y3333NF579",
  "xcodeSigningId": "iPhone Developer",
}

exports.ios92 = {
  browserName: '',
  'appium-version': '1.6',
  platformName: 'iOS',
  platformVersion: '10.1',
  deviceName: 'iPhone 5s',
  app: undefined // will be set later
};

exports.ios81 = {
  browserName: '',
  'appium-version': '1.6',
  platformName: 'iOS',
  platformVersion: '10.1',
  deviceName: 'iPhone Simulator',
  app: undefined // will be set later
};


exports.android18 = {
  browserName: '',
  'appium-version': '1.6',
  platformName: 'Android',
  platformVersion: '5.1',
  deviceName: 'Android Emulator',
  app: undefined // will be set later
};

exports.android19 = {
  browserName: '',
  'appium-version': '1.6',
  platformName: 'Android',
  platformVersion: '5.1',
  deviceName: 'Android Emulator',
  app: undefined // will be set later
};

exports.selendroid16 = {
  browserName: '',
  'appium-version': '1.6',
  platformName: 'Android',
  platformVersion: '5.1',
  automationName: 'selendroid',
  deviceName: 'Android Emulator',
  app: undefined // will be set later
};
exports.androidP9 = {
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
  //androidDeviceSocket:'chrome_devtools_remote',
  androidDeviceSocket:'com.yunshipei.enterplorer.debug_devtools_remote',
  //chromedriverExecutable: "path/to/patched/driver",
  chromeOptions:{

  },
  noSign:true,
  noReset:true,
  enablePerformanceLogging:true
};