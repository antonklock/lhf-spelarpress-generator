import ae from "npm:after-effects";

// import { PLAYER_PORTRAIT_PATH, PLAYER_FRONT_IMAGE_PATH, PLAYER_BACK_IMAGE_PATH } from "./playerImagesPlaceholder.ts";

type UpdateProps = {
    firstName: string;
    lastName: string;
    number: string;
    images: {
        portrait: string;
        front: string;
        back: string;
    };
}

// const updateProps = {
//     firstName: "Anton",
//     lastName: "Klock",
//     number: "7",
//     images: {
//         portrait: PLAYER_PORTRAIT_PATH,
//         front: PLAYER_FRONT_IMAGE_PATH,
//         back: PLAYER_BACK_IMAGE_PATH
//     }
// }

const updatePlayerPresso = (updateProps: UpdateProps) => {
    try {
        ae(
            (updateProps: UpdateProps) => {
                const project = app.project;
                if (!project) {
                    alert("No project found!");
                    return;
                }

                ////////// PLAYER NAME & NUMBER //////////

                function searchForComp(searchTerm: string, items = project.items) {
                    try {
                        if (!items) {
                            alert("No items found!");
                            return null;
                        }

                        const itemCount = items.length || items.numItems;

                        for (var i = 1; i <= itemCount; i++) {
                            try {
                                const item = items[i];
                                if (!item) {
                                    alert("Item " + i + " is null");
                                    continue;

                                }

                                if (item.typeName === "Composition" && item.name === searchTerm) {
                                    return item;
                                }

                                if (item.typeName === "Folder") {
                                    const folderItemCount = item.numItems;
                                    for (var j = 1; j <= folderItemCount; j++) {
                                        const folderItem = item.item(j);
                                        if (folderItem.typeName === "Composition" && folderItem.name === searchTerm) {
                                            return folderItem;
                                        }
                                        if (folderItem.typeName === "Folder") {
                                            const result = searchForComp(searchTerm, folderItem.items);
                                            if (result) return result;
                                            continue;
                                        }
                                    }
                                }
                            } catch (err) {
                                alert("Error processing item " + i + ": " + (err as Error).toString());
                            }
                        }
                    } catch (err) {
                        alert("Error in searchForComp: " + (err as Error).toString());
                    }
                    return null;
                }

                const namesComp = searchForComp("NAMES COMP", project.items);

                if (!namesComp) {
                    alert("Could not find Names comp!");
                    return;
                }

                const firstNameLayer = namesComp.layers.byName("FIRST NAME");
                const lastNameLayer = namesComp.layers.byName("LAST NAME");
                const numberLayer = namesComp.layers.byName("NUMBER");


                if (!firstNameLayer || !lastNameLayer || !numberLayer) {
                    alert("Could not find all required layers!");
                    return;
                }

                firstNameLayer.property("Source Text").setValue(updateProps.firstName);
                lastNameLayer.property("Source Text").setValue(updateProps.lastName);
                numberLayer.property("Source Text").setValue(updateProps.number);

                ////////// PLAYER PORTRAIT //////////

                const playerPortraitComp = searchForComp("PLAYER PORTRAIT", project.items);
                if (!playerPortraitComp) alert("Couldn't find playerPortraitComp")

                const playerPortraitLayer = playerPortraitComp.layers.byName("PLAYER PORTRAIT");
                if (!playerPortraitLayer) alert("Couldn't find playerPortraitLayer");

                if (updateProps.images.portrait) {
                    const newFootageItem = new ImportOptions(File(updateProps.images.portrait));
                    const newFootage = project.importFile(newFootageItem);
                    const oldSource = playerPortraitLayer.source;
                    playerPortraitLayer.replaceSource(newFootage, false);
                    oldSource.remove();
                }

                ////////// PLAYER FRONT IMAGE //////////

                const playerFrontImageComp = searchForComp("PLAYER FRONT IMAGE", project.items);
                if (!playerFrontImageComp) alert("Couldn't find playerFrontImageComp")

                const playerFrontImageLayer = playerFrontImageComp.layers.byName("PLAYER FRONT IMAGE");
                if (!playerFrontImageLayer) alert("Couldn't find playerFrontImageLayer");

                if (updateProps.images.front) {
                    const newFootageItem = new ImportOptions(File(updateProps.images.front));
                    const newFootage = project.importFile(newFootageItem);
                    const oldSource = playerFrontImageLayer.source;
                    playerFrontImageLayer.replaceSource(newFootage, false);
                    oldSource.remove();
                }

                ////////// PLAYER BACK IMAGE //////////

                const playerBackImageComp = searchForComp("PLAYER BACK IMAGE", project.items);
                if (!playerBackImageComp) alert("Couldn't find playerBackImageComp")

                const playerBackImageLayer = playerBackImageComp.layers.byName("PLAYER BACK IMAGE");
                if (!playerBackImageLayer) alert("Couldn't find playerBackImageLayer");

                if (updateProps.images.back) {
                    const newFootageItem = new ImportOptions(File(updateProps.images.back));
                    const newFootage = project.importFile(newFootageItem);
                    const oldSource = playerBackImageLayer.source;
                    playerBackImageLayer.replaceSource(newFootage, false);
                    oldSource.remove();
                }

                return project;
            }, updateProps
        );
    } catch (error) {
        console.log("Error: ", error);
    }
};

export default updatePlayerPresso;