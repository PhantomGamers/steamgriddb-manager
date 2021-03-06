import React from 'react';
import {TitleBar} from 'react-desktop/windows';
import {Theme as UWPThemeProvider, getTheme} from 'react-uwp/Theme';
import NavigationView from 'react-uwp/NavigationView';
import SplitViewCommand from 'react-uwp/SplitViewCommand';
import {IconButton} from 'react-uwp';
import ToastHandler from './toastHandler.js';
import PubSub from 'pubsub-js';
import {HashRouter as Router, Redirect, Link, Route} from 'react-router-dom';

import Search from './Search.js';
import Games from './games.js';
import Import from './Import.js';

// Using window.require so babel doesn't change the node require
const electron = window.require('electron');
const remote = electron.remote;

import '../css/App.css';

import Steam from './Steam.js';
window.Steam = Steam;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {isMaximized: false, showBack: false};
        this.toggleMaximize = this.toggleMaximize.bind(this);

        //Track windows snap calling maximize / unmaximize
        const window = remote.BrowserWindow.getFocusedWindow();

        window.on('maximize', () => {
            this.setState({ isMaximized: true });
        });

        window.on('unmaximize', () => {
            this.setState({ isMaximized: false });
        });

        PubSub.subscribe('showBack', (message, args) => {
            this.setState({showBack: args});
        });
    }

    close() {
        const window = remote.BrowserWindow.getFocusedWindow();
        window.close();
    }

    minimize() {
        const window = remote.BrowserWindow.getFocusedWindow();
        window.minimize();
    }

    toggleMaximize() {
        const window = remote.BrowserWindow.getFocusedWindow();
        this.setState({ isMaximized: !this.state.isMaximized });
        if(!this.state.isMaximized) {
            window.maximize();
        } else {
            window.unmaximize();
        }
    }

    handleNavRedirect(path) {
        this.setState({redirectTo: path});
    }

    render() {
        const accentColor = electron.remote.systemPreferences.getAccentColor();
        const navWidth = 48;

        const navigationTopNodes = [
            <SplitViewCommand key="0" label="Library" icon={'Library'} onClick={() => this.handleNavRedirect('/')} />,
            <SplitViewCommand key="1" label="Import Games" icon={'ImportAll'} onClick={() => this.handleNavRedirect('/import')} />
        ];

        let backBtn;
        let titleWidth = '100%';
        if (this.state.showBack) {
            backBtn = <Link to='/' onClick={() => {this.setState({showBack: false});}}>
                <IconButton style={{width: navWidth, height: 30, lineHeight: '31px', backgroundColor: '#141414', float: 'left'}} size={22}>Back</IconButton>
            </Link>;
            titleWidth = `calc(100% - ${navWidth}px)`;
        }

        return (
            <UWPThemeProvider
                theme={getTheme({
                    themeName: 'dark',
                    accent: `#${accentColor}`,
                    useFluentDesign: true
                })}
            >
                <Router>
                    <div style={{width: '100%', height: '100%', backgroundColor: '#1a1a1a'}}>
                        {backBtn}
                        <TitleBar
                            title="SteamGridDB Manager"
                            style={{width: titleWidth}}
                            controls
                            isMaximized={this.state.isMaximized}
                            onCloseClick={this.close}
                            onMinimizeClick={this.minimize}
                            onMaximizeClick={this.toggleMaximize}
                            onRestoreDownClick = {this.toggleMaximize}
                            background="#141414"
                            color="#fff"
                            theme="dark"
                        />

                        <NavigationView
                            style={{height: 'calc(100vh - 30px)', width: '100%' }}
                            background='rgba(0, 0, 0, 0.85)'
                            displayMode='overlay'
                            autoResize={false}
                            initWidth={navWidth}
                            navigationTopNodes={navigationTopNodes}
                            focusNavigationNodeIndex={0}
                        >
                            <div style={{...getTheme().typographyStyles.base,
                                marginLeft: navWidth,
                                height: '100%',
                                paddingLeft: 10,
                                position: 'relative',
                                overflow: 'auto',
                                zIndex: 0
                            }}>
                                {this.state.redirectTo &&
                                    <Redirect to={this.state.redirectTo} />
                                }

                                <Route exact path="/" component={Games} />
                                <Route exact path="/import" component={Import} />
                                <Route exact path="/search" component={Search} />
                            </div>
                        </NavigationView>
                    </div>
                </Router>
                <ToastHandler />
            </UWPThemeProvider>
        );
    }
}

export default App;
