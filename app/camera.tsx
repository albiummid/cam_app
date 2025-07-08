import { storeImage } from "@/libs/storage";
import {
    ArrowLeft,
    Camera as CameraIcon,
    Flashlight,
    Image as ImageIcon,
    RotateCcw,
} from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { Camera, CameraView } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H4, Image, Sheet, Text, XStack, YStack } from "tamagui";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraType, setCameraType] = useState("back");
    const [flashMode, setFlashMode] = useState("off");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const cameraRef = useRef<any>(null);
    const toast = useToastController();

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } =
                await Camera.requestCameraPermissionsAsync();
            const { status: mediaStatus } =
                await MediaLibrary.requestPermissionsAsync();
            setHasPermission(
                cameraStatus === "granted" && mediaStatus === "granted"
            );
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                });
                setCapturedImage(photo.uri);
                setIsSheetOpen(true);
            } catch (error) {
                Alert.alert("Error", "Failed to take picture");
            }
        }
    };

    const saveImage = async () => {
        if (capturedImage) {
            try {
                await MediaLibrary.saveToLibraryAsync(capturedImage);
                await storeImage(capturedImage);
                Alert.alert("Saved", "Image saved to gallery!");
                setIsSheetOpen(false);
                setCapturedImage(null);
            } catch (error) {
                Alert.alert("Error", "Failed to save image");
            }
        }
    };

    const retakePicture = () => {
        setCapturedImage(null);
        setIsSheetOpen(false);
    };

    const toggleCameraType = () => {
        setCameraType((current) => (current === "back" ? "front" : "back"));
    };

    const toggleFlash = () => {
        setFlashMode((current) => (current === "off" ? "on" : "off"));
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>No access to camera</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Camera component */}

                <View style={styles.backArrow}>
                    <ArrowLeft
                        onPress={() => router.back()}
                        color={"white"}
                        size={30}
                    />
                </View>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={cameraType as any}
                    enableTorch={flashMode === "on"}
                />

                {/* Rectangular overlay - positioned absolutely over camera */}
                <View style={styles.overlay}>
                    <View style={styles.rectangle} />
                </View>

                {/* Camera controls */}
                <View style={styles.controlsContainer}>
                    <XStack space="$4" style={styles.controls}>
                        <Button
                            size="$4"
                            circular
                            style={styles.controlButton}
                            onPress={toggleFlash}
                        >
                            <Flashlight size={24} color="white" />
                        </Button>

                        <Button
                            size="$6"
                            circular
                            style={styles.captureButton}
                            onPress={takePicture}
                        >
                            <CameraIcon size={32} color="black" />
                        </Button>

                        <Button
                            size="$4"
                            circular
                            style={styles.controlButton}
                            onPress={toggleCameraType}
                        >
                            <RotateCcw size={24} color="white" />
                        </Button>
                    </XStack>
                </View>

                {/* Image preview sheet */}

                <Sheet
                    modal
                    open={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    snapPoints={[50]}
                    position={0}
                    dismissOnSnapToBottom
                >
                    <Sheet.Overlay />
                    <Sheet.Frame>
                        <YStack
                            gap={10}
                            p={10}
                            pb={60}
                            style={styles.sheetContent}
                        >
                            <H4>Captured Image</H4>
                            {capturedImage && (
                                <Image
                                    source={{ uri: capturedImage }}
                                    width="100%"
                                    height={300}
                                    borderRadius="$4"
                                />
                            )}
                            <XStack space="$3" style={styles.sheetButtons}>
                                <Button
                                    size="$4"
                                    theme="red"
                                    onPress={retakePicture}
                                    icon={CameraIcon}
                                >
                                    Retake
                                </Button>
                                <Button
                                    size="$4"
                                    theme="blue"
                                    onPress={saveImage}
                                    icon={ImageIcon}
                                >
                                    Save to Gallery
                                </Button>
                            </XStack>
                        </YStack>
                    </Sheet.Frame>
                </Sheet>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        position: "relative",
    },
    camera: {
        flex: 1,
        height: "100%",
        width: "100%",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none", // Allow touches to pass through to camera
    },
    rectangle: {
        width: screenWidth * 0.7,
        height: screenHeight * 0.3,
        borderWidth: 2,
        borderColor: "white",
        backgroundColor: "transparent",
        borderRadius: 8,
    },
    controlsContainer: {
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    controls: {
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    controlButton: {
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    captureButton: {
        backgroundColor: "white",
    },
    sheetContent: {
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    sheetButtons: {
        justifyContent: "center",
    },
    backArrow: {
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 20,
    },
});
