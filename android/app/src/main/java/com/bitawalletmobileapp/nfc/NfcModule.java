
package com.bitawalletmobileapp.nfc;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.app.Activity;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.IsoDep;

public class NfcModule extends ReactContextBaseJavaModule implements NfcAdapter.ReaderCallback {

    private final ReactApplicationContext reactContext;

    public NfcModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        nfcAdapter = NfcAdapter.getDefaultAdapter(reactContext);
    }

    @Override
    public String getName() {
        return "Nfc";
    }

    private NfcAdapter nfcAdapter = null;
    private IsoDep myCard;
    private Callback cardDetected = null;

    @ReactMethod
    public void enableReader(Callback cardDetected) {
        this.cardDetected = cardDetected;

        Activity activity = getCurrentActivity();
        nfcAdapter.enableReaderMode(activity, this,
                NfcAdapter.FLAG_READER_NFC_A | NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK, null);
    }

    @ReactMethod
    public void disableReader() {
        Activity activity = getCurrentActivity();
        nfcAdapter.disableReaderMode(activity);
    }

    public void onTagDiscovered(Tag tag) {
        myCard = IsoDep.get(tag);
        if (!myCard.isConnected()) {
            try {
                myCard.connect();
                myCard.setTimeout(5000); // max timeout for an APDU
            } catch (Exception e) {
                return;
            }
        }

        // time to first display reset
        try {
            Thread.sleep(2500);
        } catch (InterruptedException e) {
        }

        if (cardDetected != null) {
            cardDetected.invoke();
        }
    }

    @ReactMethod
    public void transmit(String apdu, Callback transmitResponse) {
        byte[] byteApdu = hex2byte(apdu);
        byte[] byteResponse = null;
        try {
            byteResponse = myCard.transceive(byteApdu);
        } catch (Exception e) {
            transmitResponse.invoke(null, "transceive error: " + e.getMessage());
            return;
        }
        if (byteResponse == null) {
            transmitResponse.invoke(null, "transceive error: " + "response is null");
            return;
        }

        transmitResponse.invoke(byte2hex(byteResponse));
    }

    private String byte2hex(byte[] bytes) {
        String hex = "";
        for (int i = 0; i < bytes.length; i++) {
            hex += String.format("%02X", bytes[i] & 0xFF);
        }
        return hex;
    }

    private byte[] hex2byte(String hex) {
        String hexchars = "0123456789abcdef";

        hex = hex.replaceAll(" ", "").toLowerCase();
        if (hex == null) {
            return null;
        }
        byte[] bytes = new byte[hex.length() / 2];

        for (int i = 0; i < hex.length(); i += 2) {
            int i1 = hexchars.indexOf(hex.charAt(i));
            int i2 = hexchars.indexOf(hex.charAt(i + 1));
            bytes[i / 2] = (byte) ((i1 << 4) | i2);
        }
        return bytes;
    }
}