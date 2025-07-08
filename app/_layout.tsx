import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, TamaguiProvider } from "@tamagui/core";
import { Toast, ToastProvider, ToastViewport } from "@tamagui/toast";
import { Stack } from "expo-router";
import { PortalProvider } from "tamagui";
// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig);

type Conf = typeof config;

// make imports typed
declare module "@tamagui/core" {
    interface TamaguiCustomConfig extends Conf {}
}
export default function RootLayout() {
    return (
        <TamaguiProvider config={config}>
            <PortalProvider>
                <ToastProvider>
                    <Toast>
                        <Toast.Title />
                        <Toast.Description />

                        <Toast.Close />
                    </Toast>

                    <ToastViewport />
                </ToastProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </PortalProvider>
        </TamaguiProvider>
    );
}
