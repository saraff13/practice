import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

function App() {
  const [listData, setListData] = React.useState([]); // useState to store API response

  // API calling function with 2 arguments to handle
  const fetchApiData = (before = '', after = '') => {
    fetch(
      `https://api.reddit.com/r/dataisbeautiful/new?after=${after}&limit=10&before=${before}`,
    )
      .then(response => response.json())
      .then(data => {
        let dataToBeSet = [];
        if (before === '' && after === '') {
          // base case if both are empty
          dataToBeSet = data.data.children;
        } else if (before === '') {
          // if before is empty then after is filled that is user reached bottom, so new data to be appended at bottom of list
          dataToBeSet = [...listData, ...data.data.children];
        } else {
          // otherwise before is filled that is user reached top, so new data to be appended at top of list
          dataToBeSet = [...data.data.children, ...listData];
        }
        setListData(dataToBeSet); // setting the list data after updating
      });
  };

  React.useEffect(() => {
    fetchApiData(); // first render API call
  }, []);

  // rendering each item of flatlist
  const renderItem = item => {
    const {title, name, created, subreddit} = item.item.data; // destructuring as per requirement
    return (
      <View key={name} style={styles.eachCard}>
        <Text>Title: {title}</Text>
        <Text>Name: {name}</Text>
        <Text>Created: {created}</Text>
        <Text>Subreddit: {subreddit}</Text>
      </View>
    );
  };

  // function to be called when user reached bottom of the list
  const onEndReached = () => {
    if (listData.length > 0) {
      fetchApiData('', listData[listData.length - 1].data.name); // after name is passed and before is kept empty
    }
  };

  // function to be called when user reached top of the list
  const onTopReached = () => {
    if (listData.length > 0) {
      fetchApiData(listData[0].data.name, ''); // before name is passed and after is kept empty
    }
  };

  return (
    <FlatList
      data={listData}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onScroll={event => {
        if (event.nativeEvent.contentOffset.y === 0) {
          // if scroll height is 0 then user has reached top of the list while scrolling then API to be called with before and data to be appended at top of list data.
          onTopReached();
        }
      }}
      keyExtractor={item => item.data.name}
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
