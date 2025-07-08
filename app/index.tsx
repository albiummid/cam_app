import { getImages, removeImage } from "@/libs/storage";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H5, Image, Text, View } from "tamagui";
const { width } = Dimensions.get("window");
export default function IndexScreen() {
    const [images, setImages] = useState<string[]>([]);

    useFocusEffect(
        useCallback(() => {
            getImages().then((data) => {
                setImages(data);
            });
        }, [])
    );

    const handleRemoveImage = async (uri: string) => {
        await removeImage(uri);
        setImages(await getImages());
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    ListHeaderComponent={
                        <View>
                            <H5 style={styles.headerText}>Captured images</H5>
                        </View>
                    }
                    ListEmptyComponent={
                        <Text style={styles.listEmptyText}>
                            No images captured yet.
                        </Text>
                    }
                    data={images}
                    renderItem={({ item: uri }) => (
                        <View>
                            <Image
                                objectFit="cover"
                                source={{ uri }}
                                style={{
                                    marginVertical: 5,
                                    height: width * 0.8,
                                    width: width * 0.9,
                                    borderRadius: 10,
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    handleRemoveImage(uri);
                                }}
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 5,
                                }}
                            >
                                <MaterialIcons
                                    name="delete-outline"
                                    color={"red"}
                                    size={20}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <Button
                    style={styles.button}
                    onPress={() => {
                        router.push("/camera");
                    }}
                    theme={"red"}
                >
                    Capture Image
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        textAlign: "center",
        marginBottom: 20,
    },
    listEmptyText: { textAlign: "center", marginTop: 40 },
    button: { position: "absolute", bottom: 10 },
});
