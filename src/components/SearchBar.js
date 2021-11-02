import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextInput, StyleSheet } from 'react-native';
import debounce from 'lodash.debounce';

export default class SearchBar extends Component {
  static propTypes = {
    searchDeals: PropTypes.func.isRequired,
    initialSearchTerm: PropTypes.string.isRequired,
  };

  state = {
    searchTerm: this.props.initialSearchTerm,
  };

  searchDeals = searchTerm => {
    this.props.searchDeals(searchTerm);
    this.inputElement.blur();
  };

  debouncedSearchDeals = debounce(this.searchDeals, 300);

  handleChange = searchTerm => {
    this.setState({ searchTerm }, () => {
      // debounce to search
      this.debouncedSearchDeals(searchTerm);
    });
  };

  render() {
    return (
      <TextInput
        ref={inputElement => {
          this.inputElement = inputElement;
        }}
        placeholder="Search..."
        style={styles.input}
        onChangeText={this.handleChange}
        value={this.state.searchTerm}
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
