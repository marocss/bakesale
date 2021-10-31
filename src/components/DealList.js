import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList } from 'react-native';
import DealItem from './DealItem';

export default class DealList extends Component {
  static propTypes = {
    deals: PropTypes.array.isRequired,
    onItemPress: PropTypes.func.isRequired,
  };

  render() {
    const { deals, onItemPress } = this.props;

    return (
      <View style={styles.list}>
        <FlatList
          data={deals}
          renderItem={({ item }) => (
            <DealItem deal={item} onPress={onItemPress} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#eee',
    flex: 1,
    width: '100%',
    paddingTop: 50,
  },
});
