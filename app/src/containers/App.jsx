import React, {Component} from 'react';
import {
    Button,
    Title,
    PageTitle,
    MainContainer,
    PopupSkillBar,

    WideInput,
    CentredPanel,
    Section,
    SectionContent,
    FlexContainer,
    SkillBar,
    SearchItem,
    LinkContainer,
    Vitalick,
    Text,

    PopupNotification,
    PopupContent,
    ContentLineFund,
    Status,
    PopupBarFooter
} from '@cybercongress/ui';
import styles from './app.less';

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

class App extends Component {

    state = {
        links: [],
        defaultAddress: null,
        browserSupport: false,
        searchQuery: '',
        seeAll: false,
        balance: 0,
        remained: 0,
        max_value: 0,

        successPopup: false,
        errorPopup: false,
    };

    search(_query) {
        const query =  _query || this.searchInput.value ;

        console.log('search');
        console.log(query);
        console.log(this.searchInput.value);
        console.log(getQueryStringValue('query'));
        console.log();

        // if (this.refs.searchInput.value === getQueryStringValue('query')) {
            window.cyber.search(query).then((result) => {
                console.log('result: ', result);
                this.setState({
                    links: result,
                    searchQuery: query
                })
            })
        // } else {
        //     window.location = 'cyb://' + query;            
        // }
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.search();
        }
    };

    link() {
        const address = this.state.defaultAddress;
        const cidFrom = this.searchInput.value;
        const cidTo = this.cidToInput.value;
        console.log("from: " + cidFrom + " to: " + cidTo);

        window.cyber.link(cidFrom, cidTo, address)
            .then(a => {
                this.setState({
                    successPopup: true
                })
            })
            .catch(a => {
                this.setState({
                    errorPopup: true
                })
            })
    }

    componentDidMount() {
        if (!window.cyber) {
            return
        } else {

            this.setState({
                browserSupport: true,
                searchQuery: getQueryStringValue('query')
            }, () => {
                window.cyber.getDefaultAddress(({ address, balance, remained, max_value }) => {
                    // window.cyber.getAccountBandwidth(address).then(() => {
                    //     debugger
                    // });

                    this.setState({
                        remained: remained,
                        max_value, max_value,
                        defaultAddress: address,
                        balance
                    })
                    this.search(getQueryStringValue('query'));
                });
            });
        }
    }

    seeAll = () => {
        this.setState({
            seeAll: !this.state.seeAll
        })
    }

    openLink = (e, link) => {
        // e.preventDefault();
        const { balance, defaultAddress: address } = this.state;
        const cidFrom = this.refs.searchInput.value;
        const cidTo = link.content;
        console.log("from: " + cidFrom + " to: " + cidTo, address, balance);

        window.cyber.link(cidFrom, cidTo, address);        
    }

    close = () => {
        this.setState({
            successPopup: false,
            errorPopup: false,
        })
    }

    render() {
        const { seeAll, balance, defaultAddress, remained, max_value, successPopup, errorPopup } = this.state;
        if (!this.state.browserSupport) {
            return <div>
                Browser not supported. Download latest CYB!
            </div>
        }

        const { searchQuery, links } = this.state;


//                <a onClick={(e) => this.openLink(e, link)} href={`cyb://${link.content}`}> {link.content} </a><span>{link.rank}</span>

        const searchResults = links.slice(0, seeAll ? links.length : 10).map(link =>
            <SearchItem key={link.cid} onClick={(e) => this.openLink(e, link)} rank={link.rank}>
                {link.content}
            </SearchItem>
        );


        console.log(' defaultAddress ', this.state.defaultAddress)
        const index = false;

        return (
            <MainContainer>
                <FlexContainer>
                    <PageTitle>Cyberd search</PageTitle>
                    <div style={ { width: '30%' } }>
                        <Text style={ { paddingBottom: '10px' } }>
                            Your bandwidth:
                        </Text>
                        <SkillBar value={ 10 }>
                            {PopupNotification && (
                                <PopupSkillBar>
                                    <Text color='white'>{remained} of {max_value} left ({(remained / max_value * 100).toFixed(2) }%) </Text>
                                </PopupSkillBar>
                            )}
                        </SkillBar>
                    </div>
                </FlexContainer>
                <FlexContainer>
                    <WideInput
                      defaultValue={ searchQuery }
                      inputRef={node => this.searchInput = node }
                      onKeyPress={ this._handleKeyPress }
                    />
                    <Button
                      type='button'
                      color='blue'
                      transformtext
                      style={ { height: '30px', marginLeft: '10px' } }
                      onClick={() => this.search()}
                    >
                        search
                    </Button>
                </FlexContainer>
                {links.length > 0 && (
                    <div>
                        <Title style={ { marginLeft: '0px', marginBottom: '0px' } }>
                            Search results:
                        </Title>
                        <LinkContainer column>
                            {searchResults}
                        </LinkContainer>
                        {links.length > 10 && (
                            <Button
                              color='blue'
                              style={ { marginLeft: '0px' } }
                              transformtext
                              type='button'
                              onClick={ () => this.seeAll() }
                            >
                                {!seeAll ? 'see all' : 'top 10'}
                            </Button>
                        )}
                    </div>
                )}

                {index && (
                    <div>
                        <Title style={ { marginLeft: '0px', marginBottom: '30px', textAlign: 'center' } }>
                            Search statistic:
                        </Title>
                        <Section>
                            <SectionContent style={ { width: '25%' } }>
                                <CentredPanel>
                                    <Text
                                      color='blue'
                                      style={ { paddingBottom: '10px' } }
                                      bold
                                      size='xxlg'
                                    >
                                        1000
                                    </Text>
                                    <Text color='blue' bold size='xlg'>
                                        link
                                    </Text>
                                </CentredPanel>
                            </SectionContent>
                            <SectionContent style={ { width: '25%' } }>
                                <CentredPanel>
                                    <Text
                                      color='blue'
                                      bold
                                      size='xxlg'
                                      style={ { paddingBottom: '10px' } }
                                    >
                                        1000
                                    </Text>
                                    <Text color='blue' bold size='xlg'>
                                        CIDs
                                    </Text>
                                </CentredPanel>
                            </SectionContent>
                            <SectionContent style={ { width: '25%' } }>
                                <CentredPanel>
                                    <Text
                                      color='blue'
                                      style={ { paddingBottom: '10px' } }
                                      bold
                                      size='xxlg'
                                    >
                                        1000
                                    </Text>
                                    <Text color='blue' bold size='xlg'>
                                        accounts
                                    </Text>
                                </CentredPanel>
                            </SectionContent>
                        </Section>
                    </div>
                )}

                {defaultAddress && balance > 0 && searchQuery && links.length > 0 && (
                    <LinkContainer column>
                        <Text size='lg' style={ { marginBottom: '20px' } }>
                            Have your own option for
                            <b>
                                "
                                {searchQuery}
                                "
                            </b>
                            ? Link your query and Cyb
                            will understand it!
                        </Text>
                        <FlexContainer>
                            <WideInput placeholder='type your link her...' inputRef={node => { this.cidToInput = node; }} />
                            <Button
                              color='ogange'
                              transformtext
                              type='button'
                              style={ { height: '30px', marginLeft: '10px' } }
                              onClick={ () => this.link() }
                            >
                                Link it!
                            </Button>
                        </FlexContainer>
                    </LinkContainer>
                )}

                {defaultAddress && balance > 0 && searchQuery && links.length === 0 && (
                    <LinkContainer style={ { paddingTop: '100px' } } center>
                        <div style={ { width: '60%' } }>
                            <Text size='lg' style={ { marginBottom: '10px' } }>
                                Seems that you are first one who are searching for
                                <b>
                                    "
                                    {searchQuery}
                                    "
                                </b>
                            </Text>

                            <Text size='lg' style={ { marginBottom: '20px' } }>
                                <b>Link your query</b>
                                and Cyb will understand it!
                            </Text>

                            <FlexContainer>
                                <WideInput placeholder='type your link her...' inputRef={node => { this.cidToInput = node; }} />
                                <Button
                                  color='greenyellow'
                                  transformtext
                                  type='button'
                                  style={ { height: '30px', marginLeft: '10px' } }
                                  onClick={ () => this.link() }
                                >
                                    Link it!
                                </Button>
                            </FlexContainer>
                        </div>

                        <div style={ { width: '30%' } }>
                            <Vitalick />
                        </div>
                    </LinkContainer>
                )}

                {successPopup && (
<PopupNotification open='claimFundOpen' onClose={this.close}>
            <PopupContent>
                <ContentLineFund>
                    <Status type='successfully'>Successfully linked</Status>
                </ContentLineFund>
            </PopupContent>
            <PopupBarFooter>
                <Button transparent='true' style={ { color: '#4a90e2', marginRight: '10px' } }>
                    see results
                </Button>
            </PopupBarFooter>
        </PopupNotification>

                )}

    {errorPopup && (
<PopupNotification open='claimFundOpen' type='error' onClose={this.close}>
            <Status type='error'>Link error</Status>
        </PopupNotification>
    )}

            </MainContainer>            
        )
    }
}

export default App;
