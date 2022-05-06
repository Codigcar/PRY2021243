import React, {useState} from 'react';
import {View, Platform, FlatList, Text} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {SearchBarBaseProps} from 'react-native-elements/dist/searchbar/SearchBar';
import {Styles} from '../assets/css/Styles';
import {Dimensions} from 'react-native';

const CSearchBar = ({
  accidents,
  search,
  setSearch,
  filteredDataSource,
  setFilteredDataSource,
  rendeItem,
}: any) => {
  const SafeSearchBar = SearchBar as unknown as React.FC<SearchBarBaseProps>;

  const searchFilterFunction = (text: string) => {
    if (text) {
      const newData = accidents.filter(function (item: any) {
        const itemData = item.user?.dni;
        return itemData.indexOf(text) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(accidents);
      setSearch(text);
    }
  };

  return (
    <View style={{marginVertical: 5, flex: 1}}>
      <SafeSearchBar
        containerStyle={{
          backgroundColor: '#fff',
          borderTopColor: '#FFF',
          borderBottomColor: '#FFF',
          paddingHorizontal: 0,
          marginRight: 20,
          ...Platform.select({
            ios: {
              paddingVertical: 0,
              borderRadius: 10,
            },
          }),
        }}
        inputContainerStyle={Styles.estiloBarraBusqueda}
        onChangeText={(text: string) => searchFilterFunction(text)}
        onClear={() => searchFilterFunction('')}
        placeholder="Buscar por DNI..."
        value={search}
        platform={'android'}
      />
      <View style={{flex: 1}}>
        {accidents.length > 0 ? (
          <View style={{flex: 1}}>
            {typeof filteredDataSource === 'string' ? (
              <FlatList
                data={accidents}
                keyExtractor={(item, index) => index.toString()}
                renderItem={rendeItem}
              />
            ) : (
              <View style={{flex: 1}}>
                {filteredDataSource.length === 0 ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View>
                      <Text>No se encontraron alertas con este DNI</Text>
                    </View>
                  </View>
                ) : (
                  <FlatList
                    data={filteredDataSource}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={rendeItem}
                  />
                )}
              </View>
            )}
          </View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Alertas no encontradas</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CSearchBar;
