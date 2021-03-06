
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, Provider } from 'mobx-react/native';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';

import { CHART_GENRES_MAP } from '../../config';
import CardStore from '../../stores/card';
import Card from './Card';
import blacklist from '../../utils/blacklist';
import RippleHeader from '../components/RippleHeader';

@inject(stores => ({
    type: stores.charts.type,
    changeType: stores.charts.changeType,
}))
export default class Charts extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    componentWillMount() {
        for (var genre of CHART_GENRES_MAP) {
            genre.store = genre.store || new CardStore();
        }
    }

    showChart(data) {
        this.props.navigation.navigate('Category', { data });
    }

    render() {
        var isTop = this.props.type === 'top';
        var isNewHot = this.props.type === 'trending';

        return (
            <View style={styles.container}>
                <View style={styles.nav}>
                    <RippleHeader />

                    <TouchableOpacity style={styles.type} onPress={e => this.props.changeType('top')}>
                        <Text style={[styles.text, isTop && styles.textActive]}>TOP 50</Text>
                        <View style={[styles.indicator, isTop && styles.indicatorActive]} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.type} onPress={e => this.props.changeType('trending')}>
                        <Text style={[styles.text, isNewHot && styles.textActive]}>NEW & HOT</Text>
                        <View style={[styles.indicator, isNewHot && styles.indicatorActive]} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.categories} showsVerticalScrollIndicator={false}>
                    {
                        new Array(Math.ceil(CHART_GENRES_MAP.length / 2)).fill(0).map((e, index) => {
                        var offset = index * 2;

                        return (
                            <View style={styles.row} key={index}>
                                {
                                    [CHART_GENRES_MAP[offset], CHART_GENRES_MAP[offset + 1]].map((genre, index) => {
                                        if (genre) {
                                            return (
                                                <Provider card={genre.store} key={index}>
                                                    <Card
                                                        genre={blacklist(genre, 'store')}
                                                        showChart={(data) => this.showChart(data)} />
                                                </Provider>
                                            );
                                        }
                                    })
                                }
                            </View>
                        );
                    })
                    }
                </ScrollView>
            </View>
        );
    }
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1dfdd',
        alignItems: 'center',
        justifyContent: 'center'
    },

    nav: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 100,
        width,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(241,223,221,.9)',
        zIndex: 9,
    },

    type: {
        width: width / 2,
        alignItems: 'center',
    },

    text: {
        marginTop: 30,
        color: 'rgba(0,0,0,.4)',
        fontWeight: '100',
        fontSize: 16,
        letterSpacing: 3,
    },

    textActive: {
        color: 'rgba(0,0,0,.8)',
    },

    indicator: {
        width: 14,
        marginTop: 8,
        borderBottomColor: 'transparent',
        borderBottomWidth: 1,
    },

    indicatorActive: {
        borderBottomColor: 'rgba(0,0,0,.8)',
    },

    categories: {
        marginBottom: 50,
        paddingTop: 100,
    },

    row: {
        height: 158,
        width: 318,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});
