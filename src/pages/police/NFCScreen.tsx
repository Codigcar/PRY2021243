import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import NfcManager, { Ndef, NfcError, NfcEvents, NfcTech } from 'react-native-nfc-manager';

// Pre-step, call this before any NFC operations
NfcManager.start();

function NFCScreen() {

    const handleException = (ex:any) => {
        if (ex instanceof NfcError.UserCancel) {
            // bypass
        } else if (ex instanceof NfcError.Timeout) {
            Alert.alert('NFC Session Timeout');
        } else {
            console.warn(ex);
            Alert.alert('NFC Error', `${ex}`);
        }
    };

    async function readNdef() {
        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await NfcManager.getTag();

            const tagPayload:any = tag?.ndefMessage[0]?.payload;
            console.log('Tag found', JSON.stringify(tagPayload));
            let text = Ndef.text.decodePayload(tagPayload);
            console.log({text});
            
        } catch (ex) {
            console.warn('Oops!', ex);
        } finally {
            // stop the nfc scanning
            NfcManager.cancelTechnologyRequest();
        }
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={readNdef}>
                <Text>Scan a Tag</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NFCScreen;