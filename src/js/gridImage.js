import React from 'react';
import {Redirect} from 'react-router-dom';
import ProgressBar from 'react-uwp/ProgressBar';
import {CSSTransitionGroup} from 'react-transition-group';
import PropTypes from 'prop-types';
const ReactLazyLoad = require('react-lazyload').default;

class GridImage extends React.Component {
    constructor(props) {
        super(props);

        this.gridWidth = 300 * this.props.zoom;
        this.gridHeight = 140 * this.props.zoom;

        this.state = {
            isHover: false,
            toSearch: false,
            downloadProgress: false
        };
    }

    onMouseEnter() {
        this.setState({isHover: true});
    }

    onMouseLeave() {
        this.setState({isHover: false});
    }

    render() {
        const overlayOpacity = this.state.isHover | 0;

        if (this.state.toSearch) {
            const to = `/search/?game=${encodeURIComponent(this.props.name)}&appid=${this.props.appid}&type=${this.props.gameType}&gameId=${this.props.gameId}&platform=${this.props.platform}`;

            return (
                <Redirect to={to} />
            );
        }

        let progressBar = '';
        if (this.state.downloadProgress) {
            progressBar = (
                <div style={{
                    position: 'absolute',
                    width: `${this.gridWidth}px`,
                    bottom: '-5px'
                }}>
                    <ProgressBar
                        defaultProgressValue={this.state.downloadProgress}
                        barWidth={this.gridWidth}
                    />
                </div>
            );
        }

        let image = '';
        if (this.props.image) {
            image = (
                <ReactLazyLoad
                    height={this.gridHeight}
                    overflow
                    resize
                    once
                >
                    <CSSTransitionGroup key="1"
                        transitionName="grid-fadein"
                        transitionAppear={true}
                        transitionAppearTimeout={1000}
                        transitionEnter={false}
                        transitionLeave={false}>
                        <img key="1" style={{
                            width: `${this.gridWidth}px`,
                            height: `${this.gridHeight}px`
                        }} src={this.props.image} />
                    </CSSTransitionGroup>
                </ReactLazyLoad>
            );
        }

        return (
            <div
                style={{
                    margin: '5px',
                    position: 'relative',
                    width: `${this.gridWidth}px`,
                    height: `${this.gridHeight}px`,
                    backgroundColor: '#303030'
                }}
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
                onClick={this.props.onClick.bind(this)}
            >
                {image}

                <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    width: '100%',
                    fontSize: '1.2em',
                    fontWeight: '500',
                    textAlign: 'center',
                    color: '#fff',
                    zIndex: 0
                }}>
                    {this.props.name}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `${this.gridWidth}px`,
                        height: `${this.gridHeight}px`,
                        background: 'rgba(0,0,0,0.5)',
                        opacity: overlayOpacity,
                        transition: 'opacity 150ms ease 0s',
                        padding: 10,
                        zIndex: 1
                    }}
                >
                    {this.props.author &&
                        <span>Grid by: {this.props.author}</span>
                    }
                </div>

                {progressBar}
            </div>
        );
    }
}

GridImage.propTypes = {
    name: PropTypes.string,
    appid: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    gameType: PropTypes.string,
    gameId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    platform: PropTypes.string,
    author: PropTypes.string,
    zoom: PropTypes.number,
    image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    onClick: PropTypes.func
};

export default GridImage;
