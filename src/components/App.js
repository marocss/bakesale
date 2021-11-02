import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import ajax from '../ajax';
import DealDetail from './DealDetail';
import DealList from './DealList';
import SearchBar from './SearchBar';

class App extends React.Component {
  titleXPos = new Animated.Value(0);

  state = {
    deals: [],
    dealsFromSearch: [],
    currentDealId: null,
    activeSearchTerm: '',
  };

  animateTitle = (direction = 1) => {
    console.log('animating...');
    const titleSize = 154;
    const width = Dimensions.get('window').width - titleSize;

    Animated.timing(this.titleXPos, {
      toValue: direction * (width / 2),
      useNativeDriver: false,
      duration: 1000,
      easing: Easing.ease,
    }).start(({ finished }) => {
      if (finished) {
        // stop animation on unmount
        this.animateTitle(-1 * direction);
      }
    });
  };

  async componentDidMount() {
    this.animateTitle();
    // Animated.spring(this.titleXPos, {
    //   toValue: 100,
    //   useNativeDriver: false,
    // }).start(() => {
    //   Animated.spring(this.titleXPos, {
    //     toValue: -100,
    //     useNativeDriver: false,
    //   }).start();
    // });
    const deals = await ajax.fetchInitialDeals();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ deals });
  }

  setCurrentDeal = dealId => {
    this.setState({ currentDealId: dealId });
  };

  unsetCurrentDeal = () => {
    this.setState({ currentDealId: null });
  };

  currentDeal = () => {
    return this.state.deals.find(deal => deal.key === this.state.currentDealId);
  };

  searchDeals = async searchTerm => {
    let dealsFromSearch = [];

    if (searchTerm) {
      dealsFromSearch = await ajax.fetchDealSearchResults(searchTerm);
    }

    this.setState({ dealsFromSearch, activeSearchTerm: searchTerm });
  };

  // clearSearch = () => {
  //   this.setState({ dealsFromSearch: [] });
  // };

  render() {
    if (this.state.currentDealId) {
      return (
        <DealDetail
          initialDealData={this.currentDeal()}
          onBack={this.unsetCurrentDeal}
        />
      );
    }

    const dealsToDisplay =
      this.state.dealsFromSearch.length > 0
        ? this.state.dealsFromSearch
        : this.state.deals;

    if (dealsToDisplay.length > 0) {
      return (
        <View style={styles.main}>
          <SearchBar
            searchDeals={this.searchDeals}
            initialSearchTerm={this.state.activeSearchTerm}
          />
          <DealList deals={dealsToDisplay} onItemPress={this.setCurrentDeal} />
        </View>
      );
    }

    return (
      <Animated.View style={[styles.container, { left: this.titleXPos }]}>
        <Text style={styles.header}>Bakesale</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
  },
  main: {
    flex: 1,
    marginTop: 50,
  },
});

export default App;
