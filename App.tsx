import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

function App() {
  const [listData, setListData] = React.useState([]);

  const fetchApiData = (before = '', after = '') => {
    fetch(
      `https://api.reddit.com/r/dataisbeautiful/new?after=${after}&limit=10&before=${before}`,
    )
      .then(response => response.json())
      .then(data => {
        let dataToBeSet = [];
        if (before === '' && after === '') {
          dataToBeSet = data.data.children;
        } else if (before === '') {
          dataToBeSet = [...listData, ...data.data.children];
        } else {
          dataToBeSet = [...data.data.children, ...listData];
        }
        setListData(dataToBeSet);
      });
  };

  React.useEffect(() => {
    fetchApiData();
  }, []);

  const renderItem = item => {
    const {title, name, created, subreddit} = item.item.data;
    return (
      <View key={name} style={styles.eachCard}>
        <Text>Title: {title}</Text>
        <Text>Name: {name}</Text>
        <Text>Created: {created}</Text>
        <Text>Subreddit: {subreddit}</Text>
      </View>
    );
  };

  const onEndReached = () => {
    if (listData.length > 0) {
      fetchApiData('', listData[listData.length - 1].data.name);
    }
  };

  const onTopReached = () => {
    if (listData.length > 0) {
      fetchApiData(listData[0].data.name, '');
    }
  };

  return (
    <FlatList
      data={listData}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onScroll={event => {
        if (event.nativeEvent.contentOffset.y === 0) {
          onTopReached();
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  eachCard: {
    borderWidth: 1,
    marginVertical: 12,
  },
});

export default App;
