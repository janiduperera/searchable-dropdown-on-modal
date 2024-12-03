import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { useRef, useState } from "react";
import countries from "@/assets/countries.json";

type popUpPositions = {
  left: number;
  top: number;
};

type countriesType = {
  name: string;
  code: string;
};

export default function SearchableNameFilter({}) {
  const chevronDownBlack = require("../assets/images/Other-icons/chevron-down-black.png");
  const chevronUpBlack = require("../assets/images/Other-icons/chevron-down-black-up.png");

  const dropDownRef = useRef<View | null>(null);
  const [popUpPositions, setPopUpPositions] = useState<popUpPositions>({
    left: 0,
    top: 0,
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);
  const [data, setData] = useState<any>(countries);
  const [selectedItem, setSelectedItem] = useState<string>("");

  const onSearch = (_search: string) => {
    if (_search !== "") {
      const tempData = data.filter(({ name }: countriesType) => {
        return name.toLowerCase().indexOf(_search.toLowerCase()) > -1;
      });
      setData(tempData);
    } else {
      setData(countries);
    }
  };

  const onDropDownClicked = (): void => {
    dropDownRef?.current?.measure((x, y, width, height, pagex, pagey) => {
      setPopUpPositions({
        left: pagex,
        top: pagey + height,
      });
    });

    setClicked(!clicked);
  };

  const dropDownMenu = (
    <View
      style={[
        styles.dropDownMenu,
        styles.shadowProp,
        {
          top: popUpPositions.top,
          left: popUpPositions.left,
        },
      ]}
    >
      <View style={styles.searchInputBox}>
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeText={(txt) => {
            onSearch(txt);
            setSearch(txt);
          }}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => {
                setSelectedItem(item);
                setClicked(!clicked);
                onSearch("");
                setSearch("");
              }}
            >
              <View style={styles.dropDownMenu_Button}>
                <Text style={styles.dropDownMenu_Text}>{item}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );

  return (
    <View style={styles.dropDownSection}>
      <View style={styles.labelSection}>
        <Text style={styles.labelStyle}>Select country</Text>
      </View>

      <Pressable onPress={() => onDropDownClicked()}>
        <View ref={dropDownRef} style={styles.dropDownButton}>
          <Text style={styles.dropDownButton_Text}>
            {selectedItem === "" ? "Select" : selectedItem}
          </Text>
          <View style={styles.dropDownButton_ArrowBox}>
            <Image
              style={styles.dropDownButton_ArrowBox_Chevron}
              source={clicked ? chevronUpBlack : chevronDownBlack}
            ></Image>
          </View>
        </View>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={clicked}
        onRequestClose={() => {
          setClicked(!clicked);
        }}
      >
        {dropDownMenu}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropDownSection: {
    backgroundColor: "white",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    borderBottomWidth: 1,
    borderColor: "grey",
  },

  labelSection: {
    flex: 1,
  },

  labelStyle: {
    fontFamily: "SpaceMono",
    color: "black",
    fontSize: 14,
    textTransform: "uppercase",
  },

  shadowProp: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20, // This should make the shadow work in Andorid
  },

  dropDownButton: {
    width: 242,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "grey",
    borderRadius: 8,
    paddingHorizontal: 5,
  },

  dropDownButton_Text: {
    fontFamily: "SpaceMono",
    color: "black",
    fontSize: 15,
  },

  dropDownButton_ArrowBox: {
    width: 32,
    height: 32,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  dropDownButton_ArrowBox_Chevron: {
    width: 18,
    height: 10,
  },

  searchInputBox: {
    height: 40,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  searchInput: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 8,
    fontFamily: "SpaceMono",
    color: "grey",
    fontSize: 15,
    paddingHorizontal: 5,
  },

  dropDownMenu: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "grey",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "white",
    height: 283,
    width: 242,
  },

  dropDownMenu_Button: {
    width: 242,
    height: 40,
    justifyContent: "center",
  },

  dropDownMenu_Text: {
    fontFamily: "SpaceMono",
    color: "black",
    fontSize: 16,
    marginLeft: 10,
  },
});
