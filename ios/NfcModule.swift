//
//  NfcModule.swift
//  BitaWalletMobileApp
//
//  Created by Hossein Rezaeighaleh on 1/22/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation

import CoreNFC

@objc(NfcModule)
class NfcModule: NSObject, NFCTagReaderSessionDelegate {
  
  var cardDetected : RCTResponseSenderBlock?
  var session : NFCTagReaderSession?
  var tag : NFCISO7816Tag?
  
  func tagReaderSessionDidBecomeActive(_ session: NFCTagReaderSession) {
  }
  
  func tagReaderSession(_ session: NFCTagReaderSession, didInvalidateWithError error: Error) {
  }
  
  func tagReaderSession(_ session: NFCTagReaderSession, didDetect tags: [NFCTag]) {
    if case let NFCTag.iso7816(tag) = tags.first!
    {
      session.connect(to: tags.first!) { (error: Error?) in
        self.tag = tag
        self.cardDetected!([])
      }
    }
  }
  
  @IBAction func beginScanning(_ sender: Any) {
    session = NFCTagReaderSession(pollingOption: .iso14443, delegate: self)
    session?.alertMessage = "Hold your Xeba Wallet near to your phone"
    session?.begin()
  }
  
  @objc
  func enableReader(_ cardDetected: @escaping RCTResponseSenderBlock) {
    self.cardDetected = cardDetected
    beginScanning(self)
  }
  
  @objc func disableReader() {
    session?.invalidate()
  }
  
  func hex2byte(hexString: NSString) -> Data? {
    let hexString2 = hexString as String
    let len = hexString2.count / 2
    var data = Data(capacity: len)
    for i in 0..<len {
        let j = hexString2.index(hexString2.startIndex, offsetBy: i*2)
        let k = hexString2.index(j, offsetBy: 2)
        let bytes = hexString2[j..<k]
        if var num = UInt8(bytes, radix: 16) {
            data.append(&num, count: 1)
        } else {
          return nil
        }
    }
    return data
  }

  func byte2hex(data: Data) -> String {
    let hexAlphabet = "0123456789abcdef".unicodeScalars.map { $0 }
    return String(data.reduce(into: "".unicodeScalars, { (result, value) in
        result.append(hexAlphabet[Int(value/16)])
        result.append(hexAlphabet[Int(value%16)])
    }))
    }
  
  @objc
  func transmit(_ apdu: NSString, withCallback transmitResponse: @escaping RCTResponseSenderBlock) {
    let bApdu = hex2byte(hexString: apdu)
    let myAPDU = NFCISO7816APDU(data: bApdu!)!
    if self.session == nil || self.tag == nil {
      transmitResponse([NSNull(), "tag is null"])
      return
    }
    self.tag!.sendCommand(apdu: myAPDU) { (response: Data, sw1: UInt8, sw2: UInt8, error: Error?) in
      if error != nil {
        transmitResponse([NSNull(), "error"])
        return
      }
      var byteResponse = self.byte2hex(data: response)
      byteResponse = byteResponse + String(format:"%02X", sw1) + String(format:"%02X", sw2)
      transmitResponse([byteResponse, NSNull()])
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
}
