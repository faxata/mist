import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class NodeInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSubmenu: false,
      peerCount: 0,
      timestamp: Date.now()
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    web3.eth.net.getPeerCount((error, result) => {
      if (!error) {
        this.setState({ peerCount: result });
      }
    });

    this.setState({ timestamp: this.state.timestamp + 1 });
  };

  // showSubmenu = e => {
  // const $this = $(e.currentTarget);
  // const tabTopOffset = $this.offset().top;
  // const $submenuContainer = $this.find('.submenu-container');
  // const $submenu = $this.find('.sub-menu');
  // const submenuHeaderHeight = $this.find('header').outerHeight();
  // const windowHeight = $(window).outerHeight();

  // $submenuContainer.css('top', tabTopOffset + 'px');
  // $submenu.css(
  // 'max-height',
  // windowHeight - tabTopOffset - submenuHeaderHeight - 30 + 'px'
  // );
  // };

  renderRemoteStats() {
    // hide remote stats if you're all synced up
    if (this.props.nodes.active !== 'remote') {
      return null;
    }

    const remoteTimestamp = moment.unix(this.props.nodes.remote.timestamp);
    const diff = moment().diff(remoteTimestamp, 'seconds');

    return (
      <div id="remote-stats" className="node-info__section">
        <div className="node-info__node-title">REMOTE</div>
        <div>
          <i className="icon-layers" /> {this.props.nodes.remote.blockNumber}
        </div>
        <div>
          <i className="icon-clock" /> {diff} seconds
        </div>
      </div>
    );
  }

  renderLocalStats() {
    const {
      highestBlock,
      currentBlock,
      startingBlock,
      syncMode
    } = this.props.nodes.local;

    let localStats;
    const blocksBehind = highestBlock - currentBlock;
    const progress =
      (currentBlock - startingBlock) / (highestBlock - startingBlock) * 100;

    if (this.props.nodes.active === 'remote') {
      localStats = (
        <div>
          <div className="block-number">
            <i className="icon-layers" /> {blocksBehind} blocks behind
          </div>
          <div>
            <i className="icon-users" /> {this.state.peerCount} peers
          </div>
          <div>
            <i className="icon-cloud-download" />
            <progress max="100" value={progress} />
          </div>
        </div>
      );
    } else {
      localStats = (
        <div>
          <div className="block-number">
            <i className="icon-layers" /> formattedBlockNumber
          </div>
          <div>
            <i className="icon-users" /> {thist.state.peerCount} peers
          </div>
          <div>
            <i className="icon-clock" /> timeSinceBlock
          </div>
        </div>
      );
    }

    return (
      <div id="local-stats" className="node-info__section">
        <div className="node-info__node-title">
          LOCAL
          <span className="node-info__local-syncmode">[sync: {syncMode}]</span>
        </div>

        {localStats}
      </div>
    );
  }

  render() {
    // TODO: determine status
    const status = 'red';

    return (
      <div id="node-info">
        <div
          id="node-info__light"
          className={`light-color__${status}`}
          onMouseEnter={() =>
            this.setState({ showSubmenu: !this.state.showSubmenu })
          }
        />

        {this.state.showSubmenu && (
          <section className="submenu-container">
            <section>
              <div className="node-info__section">
                <div>
                  network:{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: '#24C33A',
                      textTransform: 'uppercase'
                    }}
                  >
                    {this.props.nodes.network}
                  </span>
                </div>

                <div>
                  node:{' '}
                  <span
                    style={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                  >
                    {this.props.nodes.active}
                  </span>
                </div>
              </div>

              {this.renderRemoteStats()}

              {this.renderLocalStats()}
            </section>
          </section>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(NodeInfo);
