//
//  NfcModule.m
//  BitaWalletMobileApp
//
//  Created by Hossein Rezaeighaleh on 1/22/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(NfcModule, NSObject)
RCT_EXTERN_METHOD(enableReader: (RCTResponseSenderBlock)cardDetected)
RCT_EXTERN_METHOD(transmit: (NSString)apdu withCallback:(RCTResponseSenderBlock)transmitResponse)
RCT_EXTERN_METHOD(disableReader)
@end
