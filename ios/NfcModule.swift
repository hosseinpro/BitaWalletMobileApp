//
//  NfcModule.swift
//  BitaWalletMobileApp
//
//  Created by Hossein Rezaeighaleh on 1/22/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

@objc(NfcModule)
class NfcModule: NSObject {
  
  @objc
  func enableReader(_ callback: RCTResponseSenderBlock) {
    callback([])
  }
  
  @objc func disableReader() {
  }
  
  @objc
  func transmit(_ apdu: NSString, withCallback callback: RCTResponseSenderBlock) {
    callback(["9000", NSNull()])
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
}
