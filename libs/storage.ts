import AsyncStorage from "@react-native-async-storage/async-storage";

export const getImages = async () =>
    JSON.parse((await AsyncStorage.getItem("images")) ?? "[]") as string[];

export const storeImage = async (imageURI: string) => {
    let images = await getImages();
    images.push(imageURI);
    await AsyncStorage.setItem("images", JSON.stringify(images));
};

export const removeImage = async (imageURI: string) => {
    let images = (await getImages()).filter((x) => x !== imageURI);
    await AsyncStorage.setItem("images", JSON.stringify(images));
};
