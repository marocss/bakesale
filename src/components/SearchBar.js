import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextInput, StyleSheet } from 'react-native';
import debounce from 'lodash.debounce';

export default class SearchBar extends Component {
  static propTypes = {
    searchDeals: PropTypes.func.isRequired,
  };

  state = {
    searchTerm: '',
  };

  debouncedSearchDeals = debounce(this.props.searchDeals, 300);

  handleChange = searchTerm => {
    this.setState({ searchTerm }, () => {
      // debounce to search
      this.debouncedSearchDeals(searchTerm);
    });
  };

  render() {
    return (
      <TextInput
        placeholder="Search..."
        style={styles.input}
        onChangeText={this.handleChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
  },
});
