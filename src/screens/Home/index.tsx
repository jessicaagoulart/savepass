import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { StatusBar } from "react-native";

import { Header } from "../../components/Header";
import { SearchBar } from "../../components/SearchBar";
import { LoginDataItem } from "../../components/LoginDataItem";

import {
	Container,
	Metadata,
	Title,
	TotalPassCount,
	LoginList,
} from "./styles";

type LoginDataProps = Array<{
	id: string;
	service_name: string;
	email: string;
	password: string;
}>;

type LoginListDataProps = LoginDataProps[];

export function Home() {
	const [searchText, setSearchText] = useState("");
	const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
	const [data, setData] = useState<LoginListDataProps>([]);

	async function loadData() {
		const dataKey = await AsyncStorage.getItem("@savepass:logins");
		setSearchListData(JSON.parse(dataKey));
		setData(JSON.parse(dataKey));
	}

	function handleFilterLoginData() {
		if (searchText === "" || searchText === null || searchText === undefined) {
			return;
		}
		const result = data.filter((item) => item.service_name === searchText);
		setSearchListData(result);
	}

	function handleChangeInputText(text: string) {
		setSearchText(text);
	}

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [])
	);

	return (
		<>
			<Header
				user={{
					name: "Rocketseat",
					avatar_url: "https://i.ibb.co/ZmFHZDM/rocketseat.jpg",
				}}
			/>
			<StatusBar backgroundColor="#1967FB" />
			<Container>
				<SearchBar
					placeholder="Qual senha você procura?"
					onChangeText={handleChangeInputText}
					value={searchText}
					returnKeyType="search"
					onSubmitEditing={handleFilterLoginData}
					onSearchButtonPress={handleFilterLoginData}
				/>

				<Metadata>
					<Title>Suas senhas</Title>
					<TotalPassCount>
						{searchListData.length
							? `${`${searchListData.length}`.padStart(2, "0")} ao total`
							: "Nada a ser exibido"}
					</TotalPassCount>
				</Metadata>

				<LoginList
					keyExtractor={(item) => item.id}
					data={searchListData}
					renderItem={({ item: loginData }) => {
						return (
							<LoginDataItem
								service_name={loginData.service_name}
								email={loginData.email}
								password={loginData.password}
							/>
						);
					}}
				/>
			</Container>
		</>
	);
}
